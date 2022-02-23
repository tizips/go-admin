import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, notification, Spin, Upload } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import Constants from '@/utils/Constants';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import Pattern from '@/utils/Pattern';
import { doUpdate } from './service';

import styles from './index.less';

const Account: React.FC = () => {

  const { initialState, setInitialState } = useModel('@@initialState');

  const [former] = Form.useForm();
  const [validator, setValidator] = useState<APIAccount.Validators>({});
  const [loading, setLoading] = useState<APIAccount.Loading>({});
  const [picture, setPicture] = useState<string | undefined>();
  const [change, setChange] = useState(false);

  const onUpload = (e: any) => {

    if (Array.isArray(e)) return e;

    const { status, response }: { status: string; response: APIResponse.Response<API.Upload> } = e.file;
    if (status === 'uploading' && !loading.upload) setLoading({ ...loading, upload: true });
    else if (status == 'done') {
      setLoading({ ...loading, upload: false });
      if (response.code !== Constants.Success) {
        notification.error({ message: response.message });
      } else {
        setValidator({ ...validator, avatar: undefined });
        setPicture(response.data.url);
        setChange(true);
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
    if (!picture) {
      setValidator({
        ...validator,
        avatar: {
          status: 'error', message: '头像不能为空',
        },
      });
    } else {
      const params: APIAccount.Editor = {
        nickname: values.nickname,
        avatar: picture,
        mobile: values.mobile,
        email: values.email,
        password: values.password,
      };
      await onSave(params);
    }
  };

  useEffect(() => {
    if (initialState?.account) {
      const data: APIAccount.Former = {
        username: initialState.account.username,
        nickname: initialState.account.nickname,
        mobile: initialState.account.mobile,
        email: initialState.account.email,
      };
      if (initialState.account.avatar) setPicture(initialState.account.avatar);
      former.setFieldsValue(data);
    }
  }, [initialState?.account]);

  return (
    <Card title='个人中心'>
      <Form form={former}
            labelCol={{ sm: 4, md: 3, lg: 2 }} wrapperCol={{ lg: 12 }}
            onValuesChange={() => setChange(true)} onFinish={onSubmit}
      >
        <Form.Item label='头像' required validateStatus={validator.avatar?.status} help={validator.avatar?.message}>
          <Form.Item noStyle>
            <Upload
              name='file'
              listType='picture-card'
              showUploadList={false}
              action={Constants.Upload}
              headers={{ Authorization: localStorage.getItem(Constants.Authorization) as string }}
              data={{ dir: '/avatar' }}
              onChange={onUpload}>
              <Spin spinning={!!loading.upload} indicator={<LoadingOutlined />}>
                {
                  picture ?
                    <img src={picture} alt='avatar' className={styles.uploadImage} /> :
                    <div className={styles.upload}>
                      <UploadOutlined className='upload-icon' />
                    </div>
                }
              </Spin>
            </Upload>
          </Form.Item>
        </Form.Item>
        <Form.Item name='nickname' label='昵称' rules={[{ required: true }, { max: 20 }]}>
          <Input />
        </Form.Item>
        <Form.Item name='mobile' label='手机号'
                   rules={[{ required: true }, { max: 20 }, { pattern: RegExp(Pattern.MOBILE), message: '手机号输入错误' }]}>
          <Input />
        </Form.Item>
        <Form.Item name='email' label='邮箱' rules={[{ max: 60 }, { type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name='password' label='密码'
                   rules={[{ pattern: RegExp(Pattern.ADMIN_PASSWORD) }]}>
          <Input.Password placeholder='留空不修改' />
        </Form.Item>
        {
          change ?
            <Form.Item
              wrapperCol={{ sm: { span: 20, offset: 4 }, md: { span: 21, offset: 3 }, lg: { span: 12, offset: 2 } }}>
              <Button type='primary' htmlType='submit' block>修改</Button>
            </Form.Item> : <></>
        }
      </Form>
    </Card>
  );
};

export default Account;