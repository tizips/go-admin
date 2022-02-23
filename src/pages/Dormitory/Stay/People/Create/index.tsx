import { Form, Input, Modal, notification, Select, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate } from './service';
import Constants from '@/utils/Constants';
import { doFloorByOnline, doRoomByOnline } from '@/services/dormitory';

const Create: React.FC<APIStayPeople.Props> = (props) => {

  const init: APIStayPeople.Former = {
    name: '',
    building: undefined,
    floor: undefined,
    room: undefined,
    order: 50,
    is_enable: 1,
  };

  const [former] = Form.useForm();
  const [filter, setFilter] = useState<APIStayPeople.Filter>({});
  const [loading, setLoading] = useState<APIStayPeople.Loading>({});
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
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  const onSubmit = (values: APIStayPeople.Former) => {

    const params: APIStayPeople.Editor = {
      name: values.name,
      room: values.room,
      order: values.order,
      is_enable: values.is_enable,
    };

    toCreate(params);
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

    former.setFieldsValue(init);
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
    <Modal title='办理入住' visible={props.visible} closable={false}
           centered onOk={() => former.submit()}
           maskClosable={false} onCancel={props.onCancel}
           confirmLoading={loading.confirmed}>
      <Form form={former} initialValues={init} onFinish={onSubmit}>
        <Form.Item label='名称' name='name' rules={[{ required: true }, { max: 20 }]}>
          <Input />
        </Form.Item>
        <Form.Item label='楼栋' name='building' rules={[{ required: true }]}>
          <Select onChange={onChangeBuilding}>
            {
              props.buildings?.map(item => (
                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        {
          <Form.Item label='楼层' name='floor' rules={[{ required: true }]}>
            <Select onChange={onChangeFloor} loading={loading.floor}>
              {
                floors.map(item => (
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        }
        {
          <Form.Item label='房间' name='room' rules={[{ required: true }]}>
            <Select loading={loading.room}>
              {
                rooms.map(item => (
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
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

export default Create;