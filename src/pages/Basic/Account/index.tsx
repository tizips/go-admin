import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Image, Input, notification, Progress, Upload } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import Constants from '@/utils/Constants';
import { UploadOutlined } from '@ant-design/icons';
import Pattern from '@/utils/Pattern';
import { doUpdate } from './service';

import styles from './index.less';

const Account: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const [former] = Form.useForm<APIAccount.Former>();
  const [loading, setLoading] = useState<APIAccount.Loading>({});
  const [change, setChange] = useState(false);

  const avatar = Form.useWatch('avatar', former);

  const onUpload = (e: any) => {
    if (Array.isArray(e)) return e;

    if (e.file.status == 'done') {
      const { uid, response }: { uid: string; response: APIResponse.Response<API.Upload> } = e.file;

      if (response.code !== Constants.Success) {
        notification.error({ message: response.message });
      } else {
        setChange(true);
        e.fileList.forEach((item: any) => {
          if (item.uid == uid) item.thumbUrl = response.data.url;
        });
      }
    }

    return e && e.fileList;
  };

  const onSave = async (params: APIAccount.Editor) => {
    setLoading({ ...loading, confirm: true });
    doUpdate(params)
      .then(async (response: APIResponse.Response<any>) => {
        if (response.code != Constants.Success) {
          notification.error({ message: response.message });
        } else {
          setChange(false);
          notification.success({ message: '修改成功' });

          const userInfo = await initialState?.toAccount?.();

          if (userInfo) {
            await setInitialState((s) => ({ ...s, account: userInfo }));
          }
        }
      })
      .finally(() => setLoading({ ...loading, confirm: false }));
  };

  const onSubmit = async (values: APIAccount.Former) => {
    const params: APIAccount.Editor = {
      nickname: values.nickname,
      avatar: '',
      mobile: values.mobile,
      email: values.email,
      password: values.password,
    };

    if (values.avatar && values.avatar.length > 0) params.avatar = values.avatar[0].thumbUrl;

    await onSave(params);
  };

  useEffect(() => {
    if (initialState?.account) {
      const data: APIAccount.Former = {
        username: initialState.account.username,
        nickname: initialState.account.nickname,
        mobile: initialState.account.mobile,
        email: initialState.account.email,
        avatar: [],
      };
      if (initialState.account.avatar) {
        data.avatar = [{ uid: 'avatar', thumbUrl: initialState.account.avatar }];
      }
      former.setFieldsValue(data);
    }
  }, [initialState?.account]);

  return (
    <Card title="个人中心">
      <Form
        form={former}
        labelCol={{ sm: 4, md: 3, lg: 2 }}
        wrapperCol={{ lg: 12 }}
        onValuesChange={() => setChange(true)}
        onFinish={onSubmit}
      >
        <Form.Item
          name="avatar"
          label="头像"
          valuePropName="fileList"
          rules={[{ required: true }]}
          getValueFromEvent={onUpload}
        >
          <Upload
            name="file"
            listType="picture-card"
            showUploadList={false}
            action={Constants.Upload}
            maxCount={1}
            headers={{ Authorization: localStorage.getItem(Constants.Authorization) as string }}
            data={{ dir: 'avatar' }}
          >
            {avatar && avatar.length > 0 ? (
              avatar[0].status == 'uploading' ? (
                <Progress type="circle" percent={avatar[0].percent} width={80} />
              ) : (
                <Image src={avatar[0].thumbUrl} preview={false} fallback={Constants.PictureFail} />
              )
            ) : (
              <div className={styles.upload}>
                <UploadOutlined className="upload-icon" />
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item name="nickname" label="昵称" rules={[{ required: true }, { max: 20 }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="mobile"
          label="手机号"
          rules={[
            { required: true },
            { max: 20 },
            { pattern: RegExp(Pattern.MOBILE), message: '手机号输入错误' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="email" label="邮箱" rules={[{ max: 60 }, { type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ pattern: RegExp(Pattern.ADMIN_PASSWORD) }]}
        >
          <Input.Password autoComplete="none" placeholder="留空不修改" />
        </Form.Item>
        {change ? (
          <Form.Item
            wrapperCol={{
              sm: { span: 20, offset: 4 },
              md: { span: 21, offset: 3 },
              lg: { span: 12, offset: 2 },
            }}
          >
            <Button type="primary" htmlType="submit" block>
              修改
            </Button>
          </Form.Item>
        ) : (
          <></>
        )}
      </Form>
    </Card>
  );
};

export default Account;
