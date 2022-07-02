import { Form, Input, Modal, notification, Select, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';
import Pattern from '@/utils/Pattern';
import { useModel } from 'umi';
import { doRoleByEnable } from '@/services/site';

const Editor: React.FC<APISiteAuthAdmin.Props> = (props) => {
  const { initialState } = useModel('@@initialState');

  const [former] = Form.useForm<APISiteAuthAdmin.Former>();
  const [roles, setRoles] = useState<APIData.Online[]>([]);
  const [loading, setLoading] = useState<APISiteAuthAdmin.Loading>({});

  const toPermissions = () => {
    setLoading({ ...loading, permission: true });
    doRoleByEnable()
      .then((response: APIResponse.Response<APISiteAuthAdmin.Role[]>) => {
        if (response.code === Constants.Success) {
          setRoles(response.data);
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

  const onSubmit = (values: APISiteAuthAdmin.Former) => {
    const params: APISiteAuthAdmin.Editor = {
      username: values.username,
      nickname: values.nickname,
      mobile: values.mobile,
      is_enable: values.is_enable,
      password: values.password,
      roles: values.roles,
    };

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const toInit = () => {
    const data: APISiteAuthAdmin.Former = {
      username: '',
      nickname: '',
      mobile: '',
      password: '',
      is_enable: 1,
      roles: [],
    };

    if (props.params) {
      data.nickname = props.params.nickname;
      data.mobile = props.params.mobile;
      data.is_enable = props.params.is_enable;
      props.params.roles?.forEach((item) => data.roles?.push(item.id));
    }

    former.setFieldsValue(data);
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
      if (roles.length <= 0) toPermissions();
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
      <Form form={former} onFinish={onSubmit} labelCol={{ span: 4 }}>
        {!props.params ? (
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true }, { pattern: RegExp(Pattern.ADMIN_USERNAME) }]}
          >
            <Input />
          </Form.Item>
        ) : (
          <></>
        )}
        <Form.Item label="昵称" name="nickname" rules={[{ required: true }, { max: 20 }]}>
          <Input />
        </Form.Item>
        <Form.Item label="电话" name="mobile" rules={[{ required: true }, { max: 20 }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: !props.params }, { pattern: RegExp(Pattern.ADMIN_PASSWORD) }]}
        >
          <Input.Password placeholder="留空不修改" />
        </Form.Item>
        <Form.Item label="角色" name="roles" rules={[{ required: true }]}>
          <Select mode="multiple" optionLabelProp="label">
            {roles.map((item) => (
              <Select.Option
                key={item.id}
                value={item.id}
                label={<Tag color={initialState?.settings?.primaryColor}>{item.name}</Tag>}
              >
                {item.name}
              </Select.Option>
            ))}
          </Select>
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
