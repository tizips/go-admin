import { Button, Cascader, Form, Input, Modal, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';
import {
  doDormitoryAssetCategoryByOnline,
  doDormitoryAssetDeviceByOnline,
} from '@/services/dormitory';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Loop from '@/utils/Loop';
import Pattern from '@/utils/Pattern';

const Create: React.FC<APIDormitoryAssetPackage.Props> = (props) => {
  const [former] = Form.useForm<APIDormitoryAssetPackage.Former>();
  const [loading, setLoading] = useState<APIDormitoryAssetPackage.Loading>({});
  const [devices, setDevices] = useState<APIData.Tree[]>([]);

  const toCategoriesByOnline = () => {
    setLoading({ ...loading, category: true });
    doDormitoryAssetCategoryByOnline()
      .then((response: APIResponse.Response<APIData.Online[]>) => {
        if (response.code == Constants.Success) {
          const data: APIData.Tree[] = [];
          if (response.data)
            response.data.forEach((item) =>
              data.push({
                id: item.id,
                object: 'category',
                name: item.name,
                isLeaf: false,
              }),
            );
          setDevices(data);
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

          if (props.onCreate) props.onCreate();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  const onSubmit = (values: APIDormitoryAssetPackage.Former) => {
    const params: APIDormitoryAssetPackage.Editor = {
      name: values.name,
      devices: [],
    };

    if (values.devices) {
      values.devices.forEach((item) => {
        if (item.device && item.device.length >= 2) {
          params.devices?.push({
            device: item.device[item.device?.length - 1],
            number: item.number ? parseInt(item.number, 10) : 0,
          });
        }
      });
    }

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const toChildren = (id?: number) => {
    doDormitoryAssetDeviceByOnline(id).then((response: APIResponse.Response<APIData.Online[]>) => {
      const data = [...devices];
      if (response.code == Constants.Success) {
        Loop.ById(data, id, (item: APIData.Tree) => (item.children = response.data), 'category');
      }
      if (data !== devices) setDevices(data);
    });
  };

  const onChildren = (values: APIDormitoryAssetPackage.Devices[]) => {
    const value = values[values.length - 1];

    if (value.children == undefined) {
      const data = [...devices];
      Loop.ById(data, value.id, (item: APIDormitoryAssetPackage.Devices) => {
        item.loading = true;
      });
      setDevices(data);

      toChildren(value.id);
    }
  };

  const toInit = () => {
    const data: APIDormitoryAssetPackage.Former = {
      name: '',
      devices: [{}],
    };

    if (props.params) {
      data.name = props.params.name;
      data.devices = [];
      props.params.devices?.forEach((item) => {
        const temps: number[] = [];
        if (item.category) temps.push(item.category);
        if (item.id) temps.push(item.id);
        data.devices?.push({ device: temps, number: `${item.number}` });
      });
    }

    former.setFieldsValue(data);
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
      if (devices.length <= 0) toCategoriesByOnline();
    }
  }, [props.visible]);

  useEffect(() => {
    if (props.visible && props.params && devices.length > 0) {
      let categories: number[] = [];
      props.params.devices?.forEach((item) => {
        if (item.category) categories.push(item.category);
      });
      categories = [...new Set(categories)];
      const data: number[] = [];
      let mark = false;
      categories.forEach((value) => {
        devices.forEach((item) => {
          if (item.id == value && item.children == undefined) {
            mark = true;
            data.push(value);
          }
        });
      });
      if (mark) data.forEach((item) => toChildren(item));
    }
  }, [props.visible, devices, props.params]);

  return (
    <Modal
      title="设备打包"
      open={props.visible}
      closable={false}
      centered
      onOk={() => former.submit()}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Form form={former} onFinish={onSubmit}>
        <Form.Item name="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入打包名称" />
        </Form.Item>
        <Form.List name="devices">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Form.Item key={field.key}>
                  <Input.Group compact>
                    <Form.Item
                      noStyle
                      name={[field.name, 'device']}
                      rules={[{ required: true, message: '请选择设备' }]}
                    >
                      <Cascader
                        options={devices}
                        loadData={onChildren}
                        fieldNames={{ label: 'name', value: 'id' }}
                        style={{ width: '60%' }}
                        placeholder="请选择设备"
                      />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      name={[field.name, 'number']}
                      rules={[
                        { required: true, message: '请输入派发数量' },
                        { pattern: RegExp(Pattern.INTEGER), message: '数量输入错误' },
                      ]}
                    >
                      <Input
                        style={{ width: '40%' }}
                        placeholder="请输入数量"
                        suffix={
                          fields.length > 1 ? (
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                              style={{ color: '#f5222d' }}
                            />
                          ) : (
                            <></>
                          )
                        }
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              ))}
              <Form.Item>
                <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add()}>
                  新增分配设备
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default Create;
