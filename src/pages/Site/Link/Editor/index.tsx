import { Form, Input, Modal, notification, Select, Slider, Spin, Tabs, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';
import { UploadOutlined } from '@ant-design/icons';
import styles from './index.less';

const Editor: React.FC<APISiteLink.Props> = (props) => {

  const init: APISiteLink.Former = {
    name: '',
    uri: '',
    admin: '',
    email: '',
    summary: '',
    no: 50,
    position: 0,
    is_enable: 1,
  };

  const [former] = Form.useForm();
  const [loading, setLoading] = useState<APISiteLink.Loading>({});
  const [type, setType] = useState('basic');
  const [picture, setPicture] = useState<string | undefined>();
  const [admin, setAdmin] = useState<string | undefined>();
  const [validator, setValidator] = useState<APISiteLink.Validators>({});

  const toCreate = (params: any) => {
    setLoading({ ...loading, confirmed: true });
    doCreate(params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '添加成功' });

          if (props.onCreate) props.onCreate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  const toUpdate = (params: any) => {
    setLoading({ ...loading, confirmed: true });
    doUpdate(props.params?.id, params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '修改成功' });
          if (props.onUpdate) props.onUpdate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  const onValidator = () => {
    setValidator({});
    const values: APISiteLink.Former = former.getFieldsValue();
    console.info(values);
    if (!values.name || !values.uri) {
      setType('basic');
    }
    former.submit();
  };

  const onSubmit = (values: APISiteLink.Former) => {
    const params: APISiteLink.Editor = {
      name: values.name,
      logo: picture,
      uri: values.uri,
      admin: values.admin,
      email: values.email,
      summary: values.summary,
      no: values.no,
      position: values.position,
      is_enable: values.is_enable,
    };


    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const toUpload = (e: any) => {

    if (Array.isArray(e)) return e;

    const { status, response }: { status: string; response: APIResponse.Response<API.Upload> } = e.file;
    if (status === 'uploading' && !loading.upload) setLoading({ ...loading, upload: true });
    else if (status == 'done') {
      setLoading({ ...loading, upload: false });
      if (response.code !== Constants.Success) {
        notification.error({ message: response.message });
      } else {
        setValidator({ ...validator, picture: undefined });
        setPicture(response.data.url);
      }
    }
    return e && e.fileList;
  };

  const onChangeAdmin = (e: any) => {
    const { value } = e.target;
    setAdmin(value);
  };

  const toInit = () => {
    setPicture(undefined);
    setAdmin(undefined);
    setType('basic');

    const data = init;

    if (props.params) {
      data.name = props.params.name;
      data.uri = props.params.uri;
      data.no = props.params.no;
      data.is_enable = props.params.is_enable;
      data.summary = props.params.summary;
      data.position = props.params.position;
      data.admin = props.params.admin;
      data.email = props.params.email;

      if (props.params.admin) setAdmin(props.params.admin);
      if (props.params.logo) data.picture?.push(props.params.logo);
    }

    former.setFieldsValue(data);
  };

  useEffect(() => {
    if (props.visible) toInit();
  }, [props.visible]);

  return (
    <Modal width={660} visible={props.visible} closable={false} centered onOk={onValidator}
           maskClosable={false} onCancel={props.onCancel} className={styles.modal}
           confirmLoading={loading.confirmed}>
      <Spin spinning={false} tip='数据加载中...'>
        <Form form={former} initialValues={init} onFinish={onSubmit}
              labelCol={{ span: 3 }}>
          <Tabs activeKey={type} onChange={activeKey => setType(activeKey)}>
            <Tabs.TabPane key='basic' tab='基本' forceRender>
              <Form.Item label='名称' name='name' rules={[{ required: true }, { max: 120 }]}>
                <Input />
              </Form.Item>
              <Form.Item label='链接' name='uri' rules={[{ required: true }, { max: 120 }, { type: 'url' }]}>
                <Input />
              </Form.Item>
              <Form.Item label='排序' name='no' rules={[{ required: true }, { type: 'number' }]}>
                <Slider min={1} max={100} />
              </Form.Item>
              <Form.Item label='启用' name='is_enable' rules={[{ required: true }]}>
                <Select>
                  <Select.Option value={1}>是</Select.Option>
                  <Select.Option value={0}>否</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name='summary' label='简介' rules={[{ max: 120 }]}>
                <Input.TextArea />
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane key='other' tab='其他' forceRender>
              <Form.Item label='Logo' validateStatus={validator.picture?.status} help={validator.picture?.message}>
                <Form.Item noStyle>
                  <Upload
                    name='file'
                    listType='picture-card'
                    showUploadList={false}
                    action={Constants.Upload}
                    headers={{ Authorization: localStorage.getItem(Constants.Authorization) as string }}
                    data={{ dir: '/category' }}
                    onChange={toUpload}
                  >
                    <Spin spinning={!!loading.upload} tip='Loading...'>
                      {
                        picture ?
                          <img src={picture} alt='avatar' /> :
                          <div className={styles.upload}>
                            <UploadOutlined className='upload-icon' />
                          </div>
                      }
                    </Spin>
                  </Upload>
                </Form.Item>
              </Form.Item>
              <Form.Item label='位置' name='position' rules={[{ required: true }]}>
                <Select>
                  <Select.Option value={0}>全部</Select.Option>
                  <Select.Option value={1}>底部</Select.Option>
                  <Select.Option value={2}>其他</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name='admin' label='站长' rules={[{ max: 20 }]}>
                <Input onChange={onChangeAdmin} />
              </Form.Item>
              {
                admin ?
                  <Form.Item name='email' label='邮箱' rules={[{ required: !!admin }, { max: 120 }, { type: 'email' }]}>
                    <Input />
                  </Form.Item> : <></>
              }
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Editor;