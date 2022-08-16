import { Cascader, Form, Input, Modal, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doPermissionBySelf, doUpdate } from './service';
import Constants from '@/utils/Constants';

const Editor: React.FC<APISiteManageRole.Props> = (props) => {
  const [former] = Form.useForm<APISiteManageRole.Former>();
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState<APISiteManageRole.Loading>({});

  const toPermissions = () => {
    setLoading({ ...loading, permission: true });
    doPermissionBySelf()
      .then((response: APIResponse.Response<APISiteManageRole.Permission[]>) => {
        if (response.code === Constants.Success) {
          setPermissions(response.data);
        }
      })
      .finally(() => setLoading({ ...loading, permission: false }));
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

  const onSubmit = (values: APISiteManageRole.Former) => {
    const params: APISiteManageRole.Editor = {
      name: values.name,
      summary: values.summary,
      permissions: values.permissions,
    };

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const toInit = () => {
    const data: APISiteManageRole.Former = {
      name: '',
      summary: '',
      permissions: [],
    };

    if (props.params) {
      data.name = props.params.name;
      data.permissions = props.params.permissions;
      data.summary = props.params.summary;
    }

    former.setFieldsValue(data);
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
      if (permissions.length <= 0) toPermissions();
    }
  }, [props.visible]);

  return (
    <Modal
      title={props.params ? '编辑' : '创建'}
      visible={props.visible}
      centered
      onOk={former.submit}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Form form={former} onFinish={onSubmit} labelCol={{ span: 3 }}>
        <Form.Item label="名称" name="name" rules={[{ required: true }, { max: 20 }]}>
          <Input />
        </Form.Item>
        <Form.Item label="权限" name="permissions" rules={[{ required: true }]}>
          <Cascader
            options={permissions}
            fieldNames={{ label: 'name', value: 'id' }}
            multiple
            maxTagCount="responsive"
          />
        </Form.Item>
        <Form.Item label="简介" name="summary" rules={[{ max: 255 }]}>
          <Input.TextArea rows={2} maxLength={255} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Editor;
