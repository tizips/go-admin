import { Cascader, Form, Input, Modal, notification, Select, Spin, Tabs, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doInformation, doUpdate, doUsed } from './service';
import { doUpload } from '@/services/helper';
import Constants from '@/utils/Constants';
import { InboxOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor';
// @ts-ignore
import ColorPicker from 'braft-extensions/dist/color-picker';
// @ts-ignore
import Table from 'braft-extensions/dist/table';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';
import 'braft-extensions/dist/table.css';
import styles from './index.less';

BraftEditor.use(ColorPicker({ theme: 'dark' }));
BraftEditor.use(Table({ columnResizable: true }));

const Editor: React.FC<APISiteArticle.Props> = (props) => {
  const init: APISiteArticle.Former = {
    category: undefined,
    name: '',
    title: '',
    keyword: '',
    description: '',
    source_name: '',
    source_uri: '',
    is_comment: 0,
    is_enable: 1,
    content: BraftEditor.createEditorState(null),
  };

  const [former] = Form.useForm();
  const [categories, setCategories] = useState<any>([]);
  const [loading, setLoading] = useState<APISiteArticle.Loading>({});
  const [type, setType] = useState('basic');
  const [picture, setPicture] = useState<string | undefined>();
  const [source, setSource] = useState<string | undefined>();
  const [validator, setValidator] = useState<APISiteArticle.Validators>({});

  const toCategories = () => {
    setLoading({ ...loading, category: true });
    doUsed()
      .then((response: APIResponse.Response<APISiteArticle.Category[]>) => {
        if (response.code === Constants.Success) {
          setCategories(response.data);
        }
      })
      .finally(() => setLoading({ ...loading, category: false }));
  };

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
    const values: APISiteArticle.Former = former.getFieldsValue();

    if (!values.name || !values.category) {
      setType('basic');
    } else if (values.content.isEmpty()) {
      setType('content');
    }
    former.submit();
  };

  const onSubmit = (values: APISiteArticle.Former) => {
    const params: APISiteArticle.Editor = {
      name: values.name,
      picture,
      title: values.title,
      keyword: values.keyword,
      description: values.description,
      source_name: values.source_name,
      source_uri: values.source_uri,
      is_comment: values.is_comment,
      is_enable: values.is_enable,
      content: values.content.toHTML(),
    };

    if (values.category) params.category = values.category[values.category.length - 1];

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const toUpload = (e: any) => {
    if (Array.isArray(e)) return e;

    const { status, response }: { status: string; response: APIResponse.Response<API.Upload> } =
      e.file;
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

  const toUploadByEditor = (param: any) => {
    doUpload(param.file, '/article').then((response: APIResponse.Response<API.Upload>) => {
      param.progress(100);
      if (response.code !== Constants.Success) {
        param.error({ msg: response.message });
      } else {
        param.success({ url: response.data.url, meta: { alt: response.data.name } });
      }
    });
  };

  const toInitByUpdate = () => {
    setLoading({ ...loading, information: true });
    doInformation(props.params?.id)
      .then((response: APIResponse.Response<APISiteArticle.Information>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
          if (props.onCancel) props.onCancel();
        } else {
          const data: APISiteArticle.Former = {
            category: response.data.category,
            name: response.data.name,
            title: response.data.title,
            keyword: response.data.keyword,
            description: response.data.description,
            source_uri: response.data.source_uri,
            source_name: response.data.source_name,
            is_comment: response.data.is_comment,
            is_enable: response.data.is_enable,
            content: BraftEditor.createEditorState(response.data.content),
          };

          setSource(response.data.source_name);
          setPicture(response.data.picture);

          former.setFieldsValue(data);
        }
      })
      .finally(() => setLoading({ ...loading, information: false }));
  };

  const onChangeSource = (e: any) => {
    const { value } = e.target;
    setSource(value);
  };

  const toInit = () => {
    setPicture(undefined);
    setSource(undefined);
    setType('basic');

    if (!props.params) former.setFieldsValue(init);
    else toInitByUpdate();
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
      if (categories.length <= 0) toCategories();
    }
  }, [props.visible]);

  return (
    <Modal
      width={660}
      open={props.visible}
      closable={false}
      centered
      onOk={onValidator}
      maskClosable={false}
      onCancel={props.onCancel}
      className={styles.modal}
      confirmLoading={loading.confirmed}
    >
      <Spin spinning={!!loading.information} tip="数据加载中...">
        <Form form={former} initialValues={init} onFinish={onSubmit} labelCol={{ span: 3 }}>
          <Tabs activeKey={type} onChange={(activeKey) => setType(activeKey)}>
            <Tabs.TabPane key="basic" tab="基本" forceRender>
              <Form.Item label="栏目" name="category" rules={[{ required: true }]}>
                <Cascader options={categories} fieldNames={{ label: 'name', value: 'id' }} />
              </Form.Item>
              <Form.Item label="名称" name="name" rules={[{ required: true }, { max: 120 }]}>
                <Input.TextArea rows={2} maxLength={120} showCount />
              </Form.Item>
              <Form.Item name="source_name" label="转载" rules={[{ max: 20 }]}>
                <Input onChange={onChangeSource} />
              </Form.Item>
              {source ? (
                <Form.Item
                  name="source_uri"
                  label="链接"
                  rules={[{ required: !!source }, { max: 120 }]}
                >
                  <Input placeholder="请输入转载链接" />
                </Form.Item>
              ) : (
                <></>
              )}
              <Form.Item label="启用" name="is_enable" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value={1}>是</Select.Option>
                  <Select.Option value={0}>否</Select.Option>
                </Select>
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane key="seo" tab="SEO" forceRender>
              <Form.Item name="title" label="标题" rules={[{ max: 60 }]}>
                <Input />
              </Form.Item>
              <Form.Item name="keyword" label="词组" rules={[{ max: 60 }]}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label="描述" rules={[{ max: 255 }]}>
                <Input.TextArea rows={2} showCount maxLength={255} />
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane key="other" tab="其他" forceRender>
              <Form.Item
                label="图片"
                validateStatus={validator.picture?.status}
                help={validator.picture?.message}
              >
                <Form.Item noStyle>
                  <Upload
                    name="file"
                    listType="picture-card"
                    className={styles.upload}
                    showUploadList={false}
                    action={Constants.Upload}
                    headers={{
                      Authorization: localStorage.getItem(Constants.Authorization) as string,
                    }}
                    data={{ dir: '/article' }}
                    onChange={toUpload}
                  >
                    <Spin spinning={!!loading.upload} tip="Loading...">
                      {picture ? (
                        <img src={picture} alt="avatar" style={{ width: '100%' }} />
                      ) : (
                        <div className="upload-area">
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined className="upload-icon" />
                          </p>
                          <p className="ant-upload-text">点击进行上传</p>
                          <p className="ant-upload-hint">Support for a single upload.</p>
                        </div>
                      )}
                    </Spin>
                  </Upload>
                </Form.Item>
              </Form.Item>
              <Form.Item label="留言" name="is_comment" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value={1}>开启</Select.Option>
                  <Select.Option value={0}>关闭</Select.Option>
                </Select>
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane key="content" tab="内容" forceRender>
              <Form.Item
                name="content"
                rules={[
                  {
                    required: true,
                    validator: (rule, value) => {
                      if (value.isEmpty()) {
                        return Promise.reject('请输入内容');
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
              >
                <BraftEditor
                  media={{ uploadFn: toUploadByEditor }}
                  // controls={Constants.Controls()}
                  className={styles.braft}
                />
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Editor;
