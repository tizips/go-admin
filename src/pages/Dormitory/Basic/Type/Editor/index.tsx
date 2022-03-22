import { Button, Form, Input, Modal, notification, Select, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const Editor: React.FC<APIBasicType.Props> = (props) => {
  const init: APIBasicType.Former = {
    name: '',
    order: 50,
    beds: undefined,
    is_enable: 1,
  };

  const [former] = Form.useForm();
  const [loading, setLoading] = useState<APIBasicType.Loading>({});

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

  const onSubmit = (values: APIBasicType.Former) => {
    const params: APIBasicType.Editor = {
      name: values.name,
      beds: values.beds,
      order: values.order,
      is_enable: values.is_enable,
    };

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const toInit = () => {
    const data = init;

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

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 21 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 21, offset: 3 },
    },
  };

  return (
    <Modal
      title={props.params ? '修改' : '创建'}
      visible={props.visible}
      closable={false}
      centered
      onOk={() => former.submit()}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Form form={former} initialValues={init} onFinish={onSubmit} {...formItemLayout}>
        <Form.Item label="名称" name="name" rules={[{ required: true }, { max: 20 }]}>
          <Input />
        </Form.Item>
        {!props.params ? (
          <Form.List name="beds">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    key={field.key}
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '配置' : ''}
                    required
                  >
                    <Input.Group compact>
                      <Form.Item
                        noStyle
                        name={[field.name, 'is_public']}
                        rules={[{ required: true, message: '请输入名称' }]}
                      >
                        <Select style={{ width: '40%' }}>
                          <Select.Option value={1}>公共</Select.Option>
                          <Select.Option value={2}>床位</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        noStyle
                        name={[field.name, 'name']}
                        rules={[{ required: true, message: '请输入名称' }]}
                      >
                        <Input
                          style={{ width: '60%' }}
                          placeholder="请输入名称"
                          suffix={
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                              style={{ color: '#f5222d' }}
                            />
                          }
                        />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                ))}
                <Form.Item {...formItemLayoutWithOutLabel}>
                  <Button
                    type="dashed"
                    block
                    icon={<PlusOutlined />}
                    onClick={() => add({ is_public: 2, name: undefined })}
                  >
                    新增默认床位
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        ) : (
          <></>
        )}

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
