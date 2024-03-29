import { Form, Input, Modal, notification, Select, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';

const Editor: React.FC<APIDormitoryAssetCategory.Props> = (props) => {
  const [former] = Form.useForm<APIDormitoryAssetCategory.Former>();
  const [loading, setLoading] = useState<APIDormitoryAssetCategory.Loading>({});

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

  const onSubmit = (values: APIDormitoryAssetCategory.Former) => {
    const params: APIDormitoryAssetCategory.Editor = {
      name: values.name,
      order: values.order,
      is_enable: values.is_enable,
    };

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const toInit = () => {
    const data: APIDormitoryAssetCategory.Former = { name: '', order: 50, is_enable: 1 };

    if (props.params) {
      data.name = props.params.name;
      data.order = props.params.order;
      data.is_enable = props.params.is_enable;
    }

    former.setFieldsValue(data);
  };

  useEffect(() => {
    if (props.visible) toInit();
  }, [props.visible]);

  return (
    <Modal
      title={props.params ? '修改' : '创建'}
      open={props.visible}
      closable={false}
      centered
      onOk={() => former.submit()}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Form form={former} onFinish={onSubmit}>
        <Form.Item label="名称" name="name" rules={[{ required: true }, { max: 20 }]}>
          <Input />
        </Form.Item>
        <Form.Item label="排序" name="order" rules={[{ required: true }, { type: 'number' }]}>
          <Slider min={1} max={99} />
        </Form.Item>
        <Form.Item label="启用" name="is_enable" rules={[{ required: true }]}>
          <Select>
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={2}>否</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Editor;
