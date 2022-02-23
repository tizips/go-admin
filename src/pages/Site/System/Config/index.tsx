import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, notification, Select, Tabs } from 'antd';
import { doList, doUpdate } from '@/pages/Site/System/Config/service';
import Constants from '@/utils/Constants';
import { useModel } from '@@/plugin-model/useModel';

const System: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [former] = Form.useForm();
  const [systems, setSystems] = useState<APISiteSystem.Data[]>([]);
  const [active, setActive] = useState<string | undefined>();
  const [system, setSystem] = useState<APISiteSystem.Data | undefined>({});
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState<APISiteSystem.Loading>({});

  const toList = () => {
    doList().then((response: APIResponse.Response<APISiteSystem.Data[]>) => {
      if (response.code === Constants.Success) {
        if (!active) setActive(response.data[0].type);
        setSystems(response.data);
      }
    });
  };

  const toHandler = () => {
    const temp = systems.find((item) => item.type == active);
    if (temp && temp.children) {
      setSystem(temp);
      const data: any = {};
      temp.children.forEach((item) => {
        if (item.key) data[item.key] = item.val;
      });
      if (data) former.setFieldsValue(data);
    }
  };

  const onChangeActive = (key: string) => {
    setActive(key);
    setChange(false);
  };

  const onSubmit = (values: any) => {
    setLoading({ ...loading, confirm: true });
    doUpdate(active, values)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: `${system?.label}修改成功` });
          setChange(false);
          toList();
        }
      })
      .finally(() => setLoading({ ...loading, confirm: false }));
  };

  useEffect(() => {
    toList();
  }, []);

  useEffect(() => {
    if (active && systems) toHandler();
  }, [systems, active]);

  return (
    <Card>
      <Tabs activeKey={active} onChange={onChangeActive}>
        {systems.map((item) => (
          <Tabs.TabPane key={item.type} tab={item.label} />
        ))}
      </Tabs>
      <Form
        form={former}
        labelCol={{ span: 2 }}
        onFinish={onSubmit}
        onValuesChange={() => setChange(true)}
      >
        {system?.children?.map((item) => (
          <Form.Item
            name={item.key}
            key={item.key}
            label={item.label}
            rules={[
              {
                required: item.required === 1,
              },
              {
                type:
                  item.genre === 'url'
                    ? 'url'
                    : item.genre == 'email'
                    ? 'email'
                    : item.genre == 'enable'
                    ? 'number'
                    : 'string',
              },
            ]}
          >
            {item.genre === 'input' || item.genre == 'url' || item.genre === 'email' ? (
              <Input
                disabled={
                  initialState?.permissions &&
                  initialState?.permissions?.indexOf('site.system.update') < 0
                }
              />
            ) : item.genre === 'textarea' ? (
              <Input.TextArea
                rows={3}
                disabled={
                  initialState?.permissions &&
                  initialState?.permissions?.indexOf('site.system.update') < 0
                }
              />
            ) : item.genre === 'enable' ? (
              <Select
                disabled={
                  initialState?.permissions &&
                  initialState?.permissions?.indexOf('site.system.update') < 0
                }
              >
                <Select.Option value={0}>否</Select.Option>
                <Select.Option value={1}>是</Select.Option>
              </Select>
            ) : (
              <></>
            )}
          </Form.Item>
        ))}
        {system && system.children && system.children?.length > 0 && change ? (
          <Form.Item wrapperCol={{ offset: 2 }}>
            <Button type="primary" htmlType="submit" loading={loading.confirm} block>
              提交
            </Button>
          </Form.Item>
        ) : (
          <></>
        )}
      </Form>
    </Card>
  );
};

export default System;
