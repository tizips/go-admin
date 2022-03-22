import { Cascader, Col, DatePicker, Form, Input, Modal, notification, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate } from './service';
import Constants from '@/utils/Constants';
import {
  doBedByOnline,
  doFloorByOnline,
  doRoomByOnline,
  doStayCategoryByOnline,
} from '@/services/dormitory';
import moment from 'moment';
import Loop from '@/utils/Loop';

import styles from './index.less';

const Create: React.FC<APIStayPeople.Props> = (props) => {
  const init: APIStayPeople.Former = {
    positions: undefined,
    is_temp: 2,
    category: undefined,
    name: '',
    mobile: '',
    date: moment(),
    remark: '',
  };

  const [former] = Form.useForm();
  const [loading, setLoading] = useState<APIStayPeople.Loading>({});
  const [categories, setCategories] = useState<APIDormitory.StayCategory[]>([]);
  const [category, setCategory] = useState<APIDormitory.StayCategory[]>([]);
  const [positions, setPositions] = useState<APIData.Tree[]>([]);
  const [isTemp, setIsTemp] = useState(init.is_temp);

  const toFloorsByOnline = (id?: number) => {
    doFloorByOnline(id, { is_public: 2 }).then(
      (response: APIResponse.Response<APIResponse.Online[]>) => {
        const data = [...positions];
        Loop.ById(
          data,
          id,
          (item: APIData.Tree) => {
            item.children = [];
            if (response.code == Constants.Success) {
              response.data.forEach((value) =>
                item.children?.push({
                  id: value.id,
                  object: 'floor',
                  name: value.name,
                  isLeaf: false,
                }),
              );
            }
          },
          'building',
        );
        if (data !== positions) setPositions(data);
      },
    );
  };

  const toRoomsByOnline = (id?: number) => {
    doRoomByOnline(id, { is_public: 2 }).then(
      (response: APIResponse.Response<APIResponse.Online[]>) => {
        const data = [...positions];
        Loop.ById(
          data,
          id,
          (item: APIData.Tree) => {
            item.children = [];
            if (response.code == Constants.Success) {
              response.data.forEach((value) =>
                item.children?.push({
                  id: value.id,
                  object: 'room',
                  name: value.name,
                  isLeaf: false,
                }),
              );
            }
          },
          'floor',
        );
        if (data !== positions) setPositions(data);
      },
    );
  };

  const toBedsByOnline = (id?: number) => {
    doBedByOnline(id, { is_public: 2 }).then(
      (response: APIResponse.Response<APIResponse.Online[]>) => {
        const data = [...positions];
        Loop.ById(
          data,
          id,
          (item: APIData.Tree) => {
            item.children = [];
            if (response.code == Constants.Success) {
              response.data.forEach((value) => item.children?.push(value));
            }
          },
          'room',
        );
        if (data !== positions) setPositions(data);
      },
    );
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
      category: values.category,
      name: values.name,
      mobile: values.mobile,
      remark: values.remark,
    };

    if (values.positions && values.positions.length == 4) params.bed = values.positions[3];

    if (isTemp == 1 && Array.isArray(values.date) && values.date.length >= 2) {
      params.start = values.date[0].format('YYYY-MM-DD');
      params.end = values.date[1].format('YYYY-MM-DD');
    } else if (isTemp == 2 && moment.isMoment(values.date)) {
      params.start = values.date.format('YYYY-MM-DD');
    }

    toCreate(params);
  };

  const onChangeTemp = (value: number) => {
    setIsTemp(value);
    former.setFieldsValue({ category: undefined, date: undefined });
  };

  const onPositions = (values: APIData.Tree[]) => {
    const value = values[values.length - 1];
    if (value.children == undefined || value.children.length <= 0) {
      if (value.object === 'building') toFloorsByOnline(value.id);
      else if (value.object === 'floor') toRoomsByOnline(value.id);
      else if (value.object === 'room') toBedsByOnline(value.id);
    }
  };

  const toInit = () => {
    setIsTemp(init.is_temp);

    former.setFieldsValue(init);
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
      if (categories.length <= 0) toCategoriesByOnline();
    }
  }, [props.visible]);

  useEffect(() => {
    if (props.visible && props.buildings && props.buildings.length > 0 && positions.length <= 0) {
      const data: APIData.Tree[] = [];
      props.buildings.forEach((item) =>
        data.push({ id: item.id, object: 'building', name: item.name, isLeaf: false }),
      );
      setPositions(data);
    }
  }, [props.visible, props.buildings]);

  useEffect(() => {
    if (props.visible && categories && categories.length > 0) {
      const data: APIDormitory.StayCategory[] = [];
      categories.forEach((item) => {
        if (item.is_temp === isTemp) data.push(item);
      });
      setCategory(data);
      if (data && data.length > 0) former.setFieldsValue({ category: data[0].id });
    }
  }, [props.visible, isTemp, categories]);

  return (
    <Modal
      title="办理入住"
      visible={props.visible}
      closable={false}
      centered
      onOk={() => former.submit()}
      width={660}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Form form={former} initialValues={init} onFinish={onSubmit} labelCol={{ span: 5 }}>
        <Row gutter={10}>
          <Col span={24} md={{ span: 12 }}>
            <Form.Item label="位置" name="positions" rules={[{ required: true }]}>
              <Cascader
                options={positions}
                loadData={onPositions}
                fieldNames={{ label: 'name', value: 'id' }}
              />
            </Form.Item>
            <Form.Item label="临时" name="is_temp" rules={[{ required: true }]}>
              <Select onChange={onChangeTemp}>
                <Select.Option value={1}>临时入住</Select.Option>
                <Select.Option value={2}>正式入住</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="类型" name="category" rules={[{ required: true }]}>
              <Select loading={loading.category}>
                {category.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="日期" name="date" rules={[{ required: true }]}>
              {isTemp === 2 ? <DatePicker className={styles.date} /> : <DatePicker.RangePicker />}
            </Form.Item>
          </Col>
          <Col span={24} md={{ span: 12 }}>
            <Form.Item label="姓名" name="name" rules={[{ required: true }, { max: 20 }]}>
              <Input />
            </Form.Item>
            <Form.Item label="电话" name="mobile" rules={[{ required: true }, { max: 20 }]}>
              <Input />
            </Form.Item>
            <Form.Item label="备注" name="remark" rules={[{ max: 255 }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Create;
