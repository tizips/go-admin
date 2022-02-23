import { Form, Input, Modal, notification, Select, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';
import { doFloorByOnline, doRoomByOnline } from '@/services/dormitory';

const Editor: React.FC<APIBasicBed.Props> = (props) => {

  const init: APIBasicBed.Former = {
    name: '',
    building: undefined,
    floor: undefined,
    room: undefined,
    order: 50,
    is_enable: 1,
  };

  const [former] = Form.useForm();
  const [filter, setFilter] = useState<APIBasicBed.Filter>({});
  const [loading, setLoading] = useState<APIBasicBed.Loading>({});
  const [floors, setFloors] = useState<APIResponse.Online[]>([]);
  const [rooms, setRooms] = useState<APIResponse.Online[]>([]);

  const toFloorsByOnline = () => {
    setLoading({ ...loading, floor: true });
    doFloorByOnline(filter.building)
      .then((response: APIResponse.Response<APIResponse.Online[]>) => {
        if (response.code == Constants.Success) setFloors(response.data);
      })
      .finally(() => setLoading({ ...loading, floor: false }));
  };

  const toRoomsByOnline = () => {
    setLoading({ ...loading, room: true });
    doRoomByOnline(filter.floor)
      .then((response: APIResponse.Response<APIResponse.Online[]>) => {
        if (response.code == Constants.Success) setRooms(response.data);
      })
      .finally(() => setLoading({ ...loading, room: false }));
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

  const onSubmit = (values: APIBasicBed.Former) => {

    const params: APIBasicBed.Editor = {
      name: values.name,
      room: values.room,
      order: values.order,
      is_enable: values.is_enable,
    };

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const onChangeBuilding = (value: number) => {
    setFilter({ ...filter, building: value, floor: undefined });

    former.setFieldsValue({ floor: undefined, room: undefined });
  };

  const onChangeFloor = (value: number) => {
    setFilter({ ...filter, floor: value });

    former.setFieldsValue({ room: undefined });
  };

  const toInit = () => {

    setFilter({ ...filter, building: undefined });
    setFloors([]);

    const data = init;

    if (props.params) {
      data.name = props.params.name;
      data.building = 0;
      data.floor = 0;
      data.room = 0;
      data.order = props.params.order;
      data.is_enable = props.params.is_enable;
    }

    former.setFieldsValue(data);
  };

  useEffect(() => {
    if (filter.building) toFloorsByOnline();
    else setFloors([]);
  }, [filter.building]);

  useEffect(() => {
    if (filter.floor) toRoomsByOnline();
    else setRooms([]);
  }, [filter.floor]);

  useEffect(() => {
    if (props.visible) {
      toInit();
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
              <Select onChange={onChangeFloor} loading={loading.floor} disabled={!!props.params}>
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
        {
          rooms && rooms.length > 0 || props.params ?
            <Form.Item label='房间' name='room' rules={[{ required: true }]}>
              <Select loading={loading.room} disabled={!!props.params}>
                {
                  props.params ?
                    <Select.Option value={0}>{props.params.room}</Select.Option> :
                    rooms.map(item => (
                      <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    ))
                }
              </Select>
            </Form.Item> : <></>
        }
        <Form.Item label='排序' name='order' rules={[{ required: true }, { type: 'number' }]}>
          <Slider min={1} max={99} />
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