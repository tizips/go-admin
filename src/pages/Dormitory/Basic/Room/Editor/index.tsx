import { Form, Input, Modal, notification, Select, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';
import { doFloorByOnline, doTypeByOnline } from '@/services/dormitory';

const Editor: React.FC<APIBasicRoom.Props> = (props) => {

  const init: APIBasicRoom.Former = {
    name: '',
    building: undefined,
    floor: undefined,
    type: undefined,
    order: 50,
    is_furnish: 0,
    is_enable: 1,
  };

  const [former] = Form.useForm();
  const [filter, setFilter] = useState<APIBasicRoom.Filter>({});
  const [loading, setLoading] = useState<APIBasicRoom.Loading>({});
  const [floors, setFloors] = useState<APIResponse.Online[]>([]);
  const [types, setTypes] = useState<APIResponse.Online[]>([]);

  const toFloorsByOnline = () => {
    setLoading({ ...loading, floor: true });
    doFloorByOnline(filter.building)
      .then((response: APIResponse.Response<APIResponse.Online[]>) => {
        if (response.code == Constants.Success) setFloors(response.data);
      })
      .finally(() => setLoading({ ...loading, floor: false }));
  };

  const toTypesByOnline = () => {
    setLoading({ ...loading, type: true });
    doTypeByOnline()
      .then((response: APIResponse.Response<APIResponse.Online[]>) => {
        if (response.code == Constants.Success) setTypes(response.data);
      })
      .finally(() => setLoading({ ...loading, type: false }));
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

  const onSubmit = (values: APIBasicRoom.Former) => {

    const params: APIBasicRoom.Editor = {
      name: values.name,
      floor: values.floor,
      type: values.type,
      order: values.order,
      is_furnish: values.is_furnish,
      is_enable: values.is_enable,
    };

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const onChangeBuilding = (value: number) => {
    setFilter({ ...filter, building: value });

    former.setFieldsValue({ floor: undefined });
  };

  const toInit = () => {

    setFilter({ ...filter, building: undefined });
    setFloors([]);

    const data = init;

    if (props.params) {
      data.name = props.params.name;
      data.building = 0;
      data.floor = 0;
      data.order = props.params.order;
      data.type = props.params.type_id;
      data.is_furnish = props.params.is_furnish;
      data.is_enable = props.params.is_enable;
    }

    former.setFieldsValue(data);
  };

  useEffect(() => {
    if (filter.building) toFloorsByOnline();
  }, [filter]);

  useEffect(() => {
    if (props.visible) {
      toInit();
      if (types.length <= 0) toTypesByOnline();
    }
  }, [props.visible]);

  return (
    <Modal title={props.params ? '修改' : '创建'} visible={props.visible} closable={false}
           centered onOk={() => former.submit()}
           maskClosable={false} onCancel={props.onCancel}
           confirmLoading={loading.confirmed}>
      <Form form={former} initialValues={init} onFinish={onSubmit}>
        <Form.Item label='名称' name='name' rules={[{ required: true }, { max: 20 }]}>
          <Input />
        </Form.Item>
        <Form.Item label='楼栋' name='building' rules={[{ required: true }]}>
          <Select onChange={onChangeBuilding} disabled={!!props.params}>
            {
              props.params ?
                <Select.Option value={0}>{props.params.building}</Select.Option> :
                props.buildings?.map(item => (
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                ))
            }
          </Select>
        </Form.Item>
        {
          floors && floors.length > 0 || props.params ?
            <Form.Item label='楼层' name='floor' rules={[{ required: true }]}>
              <Select loading={loading.floor} disabled={!!props.params}>
                {
                  props.params ?
                    <Select.Option value={0}>{props.params.floor}</Select.Option> :
                    floors.map(item => (
                      <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    ))
                }
              </Select>
            </Form.Item> : <></>
        }
        <Form.Item label='房型' name='type' rules={[{ required: true }]}>
          <Select loading={loading.type}>
            {
              types.map(item => (
                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item label='排序' name='order' rules={[{ required: true }, { type: 'number' }]}>
          <Slider min={1} max={99} />
        </Form.Item>
        <Form.Item label='装修' name='is_furnish' rules={[{ required: true }]}>
          <Select>
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={0}>否</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='启用' name='is_enable' rules={[{ required: true }]}>
          <Select>
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={0}>否</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Editor;