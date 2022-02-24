import { Col, DatePicker, Form, Input, Modal, notification, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate } from './service';
import Constants from '@/utils/Constants';
import { doBedByOnline, doFloorByOnline, doRoomByOnline, doStayCategoryByOnline } from '@/services/dormitory';
import moment from 'moment';

const Create: React.FC<APIStayPeople.Props> = (props) => {

  const init: APIStayPeople.Former = {
    building: undefined,
    floor: undefined,
    room: undefined,
    bed: undefined,
    is_temp: 0,
    category: undefined,
    name: '',
    mobile: '',
    date: '',
  };

  const [former] = Form.useForm();
  const [filter, setFilter] = useState<APIStayPeople.Filter>({});
  const [loading, setLoading] = useState<APIStayPeople.Loading>({});
  const [floors, setFloors] = useState<APIResponse.Online[]>([]);
  const [rooms, setRooms] = useState<APIResponse.Online[]>([]);
  const [beds, setBeds] = useState<APIResponse.Online[]>([]);
  const [categories, setCategories] = useState<APIDormitory.StayCategory[]>([]);
  const [category, setCategory] = useState<APIDormitory.StayCategory[]>([]);
  const [isTemp, setIsTemp] = useState(init.is_temp);

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

  const toBedsByOnline = () => {
    setLoading({ ...loading, bed: true });
    doBedByOnline(filter.room)
      .then((response: APIResponse.Response<APIResponse.Online[]>) => {
        if (response.code == Constants.Success) setBeds(response.data);
      })
      .finally(() => setLoading({ ...loading, bed: false }));
  };

  const toCategoriesByOnline = () => {
    setLoading({ ...loading, category: true });
    doStayCategoryByOnline()
      .then((response: APIResponse.Response<APIDormitory.StayCategory[]>) => {
        if (response.code == Constants.Success) setCategories(response.data);
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

  const onSubmit = (values: APIStayPeople.Former) => {

    const params: APIStayPeople.Editor = {
      bed: values.bed,
      category: values.category,
      name: values.name,
      mobile: values.mobile,
      remark: values.remark,
    };

    if (isTemp == 1 && Array.isArray(values.date) && values.date.length >= 2) {
      params.start = values.date[0].format('YYYY-MM-DD');
      params.end = values.date[1].format('YYYY-MM-DD');
    } else if (isTemp == 0 && moment.isMoment(values.date)) {
      params.start = values.date.format('YYYY-MM-DD');
    }

    toCreate(params);
  };

  const onChangeBuilding = (value: number) => {
    setFilter({ ...filter, building: value, floor: undefined });

    former.setFieldsValue({ floor: undefined, room: undefined, bed: undefined });
  };

  const onChangeFloor = (value: number) => {
    setFilter({ ...filter, floor: value, room: undefined });

    former.setFieldsValue({ room: undefined, bed: undefined });
  };

  const onChangeRoom = (value: number) => {
    setFilter({ ...filter, room: value });

    former.setFieldsValue({ bed: undefined });
  };

  const onChangeTemp = (value: number) => {
    setIsTemp(value);
    former.setFieldsValue({ category: undefined, date: undefined });
  };

  const toInit = () => {

    setFilter({ ...filter, building: undefined });
    setFloors([]);
    setRooms([]);
    setBeds([]);
    setIsTemp(init.is_temp);

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
    if (filter.room) toBedsByOnline();
    else setBeds([]);
  }, [filter.room]);

  useEffect(() => {
    if (props.visible) {
      toInit();
      if (categories.length <= 0) toCategoriesByOnline();
    }
  }, [props.visible]);

  useEffect(() => {
    if (props.visible && categories && categories.length > 0) {
      const data: APIDormitory.StayCategory[] = [];
      categories.forEach(item => {
        if (item.is_temp === isTemp) data.push(item);
      });
      setCategory(data);
      if (data && data.length > 0) former.setFieldsValue({ category: data[0].id });
    }
  }, [props.visible, isTemp, categories]);

  return (
    <Modal title='办理入住' visible={props.visible} closable={false}
           centered onOk={() => former.submit()} width={600}
           maskClosable={false} onCancel={props.onCancel}
           confirmLoading={loading.confirmed}>
      <Form form={former} initialValues={init} onFinish={onSubmit} labelCol={{ span: 6 }}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item label='楼栋' name='building' rules={[{ required: true }]}>
              <Select onChange={onChangeBuilding}>
                {
                  props.buildings?.map(item => (
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item label='楼层' name='floor' rules={[{ required: true }]}>
              <Select onChange={onChangeFloor} loading={loading.floor}>
                {
                  floors.map(item => (
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item label='房间' name='room' rules={[{ required: true }]}>
              <Select loading={loading.bed} disabled={floors.length <= 0} onChange={onChangeRoom}>
                {
                  rooms.map(item => (
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item label='床位' name='bed' rules={[{ required: true }]}>
              <Select loading={loading.bed} disabled={rooms.length <= 0}>
                {
                  beds.map(item => (
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item label='临时' name='is_temp' rules={[{ required: true }]}>
              <Select onChange={onChangeTemp}>
                <Select.Option value={1}>临时入住</Select.Option>
                <Select.Option value={0}>正式入住</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={13}>
            <Form.Item label='类型' name='category' rules={[{ required: true }]}>
              <Select loading={loading.category}>
                {
                  category.map(item => (
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item label='姓名' name='name' rules={[{ required: true }, { max: 20 }]}>
              <Input />
            </Form.Item>
            <Form.Item label='电话' name='mobile' rules={[{ required: true }, { max: 20 }]}>
              <Input />
            </Form.Item>
            <Form.Item label='日期' name='date' rules={[{ required: true }]}>
              {
                isTemp === 0 ?
                  <DatePicker /> : <DatePicker.RangePicker />
              }
            </Form.Item>
            <Form.Item label='备注' rules={[{ required: true }, { max: 255 }]}>
              <Input.TextArea rows={1} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Create;