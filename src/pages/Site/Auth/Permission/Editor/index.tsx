import { Cascader, Form, Input, Modal, notification, Select, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doParents, doUpdate } from './service';
import Constants from '@/utils/Constants';
import { doApis } from '@/services/site';

const Editor: React.FC<APIAuthPermission.Props> = (props) => {

  const init: APIAuthPermission.Former = {
    parent: [],
    name: '',
    slug: '',
    uri: '',
  };

  const [former] = Form.useForm();
  const [apis, setApis] = useState<APIAuthPermission.Api[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState<APIAuthPermission.Loading>({});
  const [parent, setParent] = useState([]);

  const toApis = () => {
    setLoading({ ...loading, api: true });
    doApis(props.module)
      .then((response: APIResponse.Response<APIAuthPermission.Api[]>) => {
        if (response.code === Constants.Success) {
          const data = response.data;
          if (props.params) data.push({ method: props.params.method, path: props.params.path });
          setApis(data);
        }
      })
      .finally(() => setLoading({ ...loading, api: false }));
  };

  const toParents = () => {
    setLoading({ ...loading, parent: true });
    doParents(props.module)
      .then((response: APIResponse.Response<APIAuthPermission.Parent[]>) => {
        if (response.code === Constants.Success) {
          setParents(response.data);
        }
      })
      .finally(() => setLoading({ ...loading, parent: false }));
  };

  const toCreate = (params: any) => {
    setLoading({ ...loading, confirmed: true });
    doCreate(params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '添加成功' });

          setParents([]);

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

          setParents([]);

          if (props.onUpdate) props.onUpdate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  const onSubmit = (values: APIAuthPermission.Former) => {

    const uri: string[] | undefined = values.uri?.split('|');

    const params: APIAuthPermission.Editor = {
      module: props.module,
      parent: values.parent ? values.parent[values.parent?.length - 1] : undefined,
      name: values.name,
      slug: values.slug,
    };

    if (uri?.length == 2) {
      params.method = uri[0];
      params.path = uri[1];
    }

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const onChangeParent = (values: any) => {
    setParent(values);
  };

  const toInit = () => {
    const data = init;
    if (props.params) {
      data.parent = props.params.parents;
      data.name = props.params.name;
      data.slug = props.params.slug;
      if (props.params.method && props.params.path) data.uri = `${props.params.method}|${props.params.path}`;
    }
    former.setFieldsValue(data);
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
      toApis();
      if (parents.length <= 0) toParents();
    }
  }, [props.visible]);

  return (
    <Modal title={props.params ? '编辑' : '创建'} visible={props.visible} centered onOk={former.submit}
           maskClosable={false} onCancel={props.onCancel} confirmLoading={loading.confirmed}>
      <Form form={former} initialValues={init} onFinish={onSubmit} labelCol={{ span: 3 }}>
        <Form.Item label='父级' name='parent'>
          <Cascader options={parents} fieldNames={{ label: 'name', value: 'id' }} onChange={onChangeParent}
                    changeOnSelect disabled={!!props.params?.children} />
        </Form.Item>
        <Form.Item label='名称' name='name' rules={[{ required: true }, { max: 20 }]}>
          <Input />
        </Form.Item>
        <Form.Item label='标示' name='slug' rules={[{ required: true }, { max: 64 }]}>
          <Input />
        </Form.Item>
        <Form.Item label='接口' name='uri' rules={[{ required: parent.length >= 2 }]}>
          <Select loading={loading.api}>
            {
              apis.map(item => (
                <Select.Option key={`${item.method}|${item.path}`} value={`${item.method}|${item.path}`}>
                  <Tag color={item.method && props.methods ? props.methods[item.method] : ''}>{item.method}</Tag>
                  {item.path}
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Editor;