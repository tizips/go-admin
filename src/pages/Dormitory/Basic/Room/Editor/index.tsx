import { Cascader, Form, Input, Modal, notification, Select, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';
import { doDormitoryFloorByOnline, doDormitoryTypeByOnline } from '@/services/dormitory';
import Loop from '@/utils/Loop';

const Editor: React.FC<APIDormitoryBasicRoom.Props> = (props) => {
  const [former] = Form.useForm<APIDormitoryBasicRoom.Former>();
  const [loading, setLoading] = useState<APIDormitoryBasicRoom.Loading>({});
  const [types, setTypes] = useState<APIData.Online[]>([]);
  const [positions, setPositions] = useState<APIData.Tree[]>([]);
  const isPublic = Form.useWatch('is_public', former);

  const toFloorsByOnline = (id?: number) => {
    doDormitoryFloorByOnline(id, { is_public: 2 }).then(
      (response: APIResponse.Response<APIData.Online[]>) => {
        const data = [...positions];
        Loop.ById(
          data,
          id,
          (item: APIData.Tree) => {
            item.children = [];
            if (response.code == Constants.Success) {
              response.data.forEach((value) =>
                item.children?.push({ id: value.id, name: value.name }),
              );
            }
          },
          'building',
        );
        if (data !== positions) setPositions(data);
      },
    );
  };

  const toTypesByOnline = () => {
    setLoading({ ...loading, type: true });
    doDormitoryTypeByOnline()
      .then((response: APIResponse.Response<APIData.Online[]>) => {
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

  const onSubmit = (values: APIDormitoryBasicRoom.Former) => {
    const params: APIDormitoryBasicRoom.Editor = {
      name: values.name,
      order: values.order,
      is_furnish: values.is_furnish,
      is_enable: values.is_enable,
      is_public: values.is_public,
    };

    if (!props.params && values.positions && values.positions.length > 0)
      params.floor = values.positions[values.positions.length - 1];
    if (values.is_public !== 1) params.type = values.type;

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const onPositions = (values: APIData.Tree[]) => {
    const value = values[values.length - 1];

    if (value.children == undefined || value.children.length <= 0) {
      if (value.object === 'building') toFloorsByOnline(value.id);
    }
  };

  const toInit = () => {
    const data: APIDormitoryBasicRoom.Former = {
      name: '',
      positions: undefined,
      type: undefined,
      order: 50,
      is_furnish: 2,
      is_enable: 1,
      is_public: 2,
    };

    if (props.params) {
      data.name = props.params.name;
      data.positions = [0, 0];
      data.order = props.params.order;
      data.type = props.params.type_id;
      data.is_furnish = props.params.is_furnish;
      data.is_enable = props.params.is_enable;
      data.is_public = props.params.is_public;
    }

    former.setFieldsValue(data);
  };

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
    if (props.visible) {
      toInit();
      if (types.length <= 0) toTypesByOnline();
    }
  }, [props.visible]);

  return (
    <Modal
      title={props.params ? '修改' : '创建'}
      open={props.visible}
      closable={false}
      centered
      onOk={() => former.submit()}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Form form={former} onFinish={onSubmit}>
        <Form.Item label="名称" name="name" rules={[{ required: true }, { max: 20 }]}>
          <Input />
        </Form.Item>
        {props.params ? (
          <Form.Item label="位置" name="positions" required>
            <Cascader
              options={[
                {
                  id: 0,
                  name: props.params.building,
                  children: [{ id: 0, name: props.params.floor }],
                },
              ]}
              fieldNames={{ label: 'name', value: 'id' }}
              disabled
            />
          </Form.Item>
        ) : (
          <Form.Item label="位置" name="positions" rules={[{ required: true }]}>
            <Cascader
              options={positions}
              loadData={onPositions}
              fieldNames={{ label: 'name', value: 'id' }}
            />
          </Form.Item>
        )}
        {isPublic !== 1 ? (
          <Form.Item label="房型" name="type" rules={[{ required: true }]}>
            <Select loading={loading.type}>
              {types.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <></>
        )}
        <Form.Item label="排序" name="order" rules={[{ required: true }, { type: 'number' }]}>
          <Slider min={1} max={99} />
        </Form.Item>
        {isPublic !== 1 ? (
          <Form.Item label="装修" name="is_furnish" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={1}>是</Select.Option>
              <Select.Option value={2}>否</Select.Option>
            </Select>
          </Form.Item>
        ) : (
          <></>
        )}
        <Form.Item label="启用" name="is_enable" rules={[{ required: true }]}>
          <Select>
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={2}>否</Select.Option>
          </Select>
        </Form.Item>
        {!props.params ? (
          <Form.Item label="公共" name="is_public" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={1}>公共区域</Select.Option>
              <Select.Option value={2}>非公共区域</Select.Option>
            </Select>
          </Form.Item>
        ) : (
          <></>
        )}
      </Form>
    </Modal>
  );
};

export default Editor;
