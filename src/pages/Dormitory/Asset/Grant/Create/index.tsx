import { Cascader, Form, Input, Modal, notification, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate } from './service';
import Constants from '@/utils/Constants';
import {
  doAssetCategoryByOnline,
  doAssetDeviceByOnline,
  doAssetPackageByOnline,
  doBedByOnline,
  doBuildingByOnline,
  doFloorByOnline,
  doRoomByOnline,
  doTypeByOnline,
} from '@/services/dormitory';
import Loop from '@/utils/Loop';
import Pattern from '@/utils/Pattern';

const Create: React.FC<APIDormitoryAssetGrant.Props> = (props) => {
  const [former] = Form.useForm<APIDormitoryAssetGrant.Former>();
  const [loading, setLoading] = useState<APIDormitoryAssetGrant.Loading>({});
  const [devices, setDevices] = useState<APIData.Tree[]>([]);
  const [packages, setPackages] = useState<APIData.Online[]>([]);
  const [positions, setPositions] = useState<APIData.Tree[]>([]);
  const [types, setTypes] = useState<APIData.Tree[]>([]);

  const position = Form.useWatch('position', former);
  const object = Form.useWatch('object', former);

  const toTypesByOnline = () => {
    setLoading({ ...loading, buildings: true });
    doTypeByOnline({ with_bed: true, must_bed: true })
      .then((response: APIResponse.Response<APIDormitory.TypeOnline[]>) => {
        if (response.code == Constants.Success) {
          const data: APIData.Tree[] = response.data.map((item) => ({
            id: item.id,
            object: 'type',
            name: item.name,
            children: item.beds,
          }));
          setTypes(data);
        }
      })
      .finally(() => setLoading({ ...loading, buildings: false }));
  };

  const toCategoriesByOnline = () => {
    setLoading({ ...loading, category: true });
    doAssetCategoryByOnline()
      .then((response: APIResponse.Response<APIData.Online[]>) => {
        if (response.code == Constants.Success) {
          const data: APIData.Tree[] = [];
          response.data.forEach((item) =>
            data.push({ id: item.id, name: item.name, object: 'category', isLeaf: false }),
          );
          setDevices(data);
        }
      })
      .finally(() => setLoading({ ...loading, category: false }));
  };

  const toPackagesByOnline = () => {
    setLoading({ ...loading, packages: true });
    doAssetPackageByOnline()
      .then((response: APIResponse.Response<APIData.Online[]>) => {
        if (response.code == Constants.Success) setPackages(response.data);
      })
      .finally(() => setLoading({ ...loading, packages: false }));
  };

  const toBuildingsByOnline = () => {
    setLoading({ ...loading, buildings: true });
    doBuildingByOnline({ with_public: true })
      .then((response: APIResponse.Response<APIDormitory.BuildingOnline[]>) => {
        if (response.code == Constants.Success) {
          const data: APIData.Tree[] = [];
          response.data.forEach((item) =>
            data.push({
              id: item.id,
              object: 'building',
              name: item.name,
              isLeaf: item.is_public !== 2,
            }),
          );
          setPositions(data);
        }
      })
      .finally(() => setLoading({ ...loading, buildings: false }));
  };

  const toDevices = (id?: number) => {
    doAssetDeviceByOnline(id).then((response: APIResponse.Response<APIData.Online[]>) => {
      if (response.code == Constants.Success) {
        const data = [...devices];
        Loop.ById(data, id, (item: APIData.Tree) => (item.children = response.data), 'category');
        setDevices(data);
      }
    });
  };

  const toFloorsByOnline = (id?: number) => {
    doFloorByOnline(id, { with_public: true }).then(
      (response: APIResponse.Response<APIDormitory.FloorOnline[]>) => {
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
                  isLeaf: value.is_public !== 2,
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
    doRoomByOnline(id, { with_public: true }).then(
      (response: APIResponse.Response<APIDormitory.RoomOnline[]>) => {
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
                  isLeaf: value.is_public !== 2,
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
    doBedByOnline(id, { with_public: true }).then(
      (response: APIResponse.Response<APIData.Online[]>) => {
        const data = [...positions];
        Loop.ById(
          data,
          id,
          (item: APIData.Tree) => {
            item.children = [];
            if (response.code == Constants.Success) item.children = response.data;
          },
          'room',
        );
        setPositions(data);
      },
    );
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

  const onSubmit = (values: APIDormitoryAssetGrant.Former) => {
    const params: APIDormitoryAssetGrant.Editor = {
      object: values.object,
      package: values.package,
      position: values.position,
      remark: values.remark,
    };

    if (values.device && values.device.length >= 2)
      params.device = values.device[values.device.length - 1];
    if (values.number) params.number = parseInt(values.number, 10);

    if (values.types && values.types.length > 0) {
      values.positions = [];
      values.types.forEach((item) => {
        if (item.length >= 2) params.types?.push({ object: 'bed', id: item[1] });
        else if (item.length >= 1) params.types?.push({ object: 'type', id: item[0] });
      });
    }

    if (values.positions) {
      params.positions = [];
      values.positions.forEach((item) => {
        if (item.length >= 4) params.positions?.push({ object: 'bed', id: item[3] });
        else if (item.length >= 3) params.positions?.push({ object: 'room', id: item[2] });
        else if (item.length >= 2) params.positions?.push({ object: 'floor', id: item[1] });
        else if (item.length >= 1) params.positions?.push({ object: 'building', id: item[0] });
      });
    }

    console.info(params);
    toCreate(params);
  };

  const onDevices = (values: APIData.Tree[]) => {
    const value = values[values.length - 1];

    if (value.children == undefined || value.children.length <= 0) toDevices(value.id);
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
    former.setFieldsValue({
      object: 'package',
      package: undefined,
      device: undefined,
      position: 'positions',
      positions: undefined,
      types: [],
      number: undefined,
      remark: '',
    });
  };

  useEffect(() => {
    if (props.visible) toInit();
  }, [props.visible]);

  useEffect(() => {
    if (props.visible && position == 'positions' && positions.length <= 0) toBuildingsByOnline();
    else if (props.visible && position == 'types' && types.length <= 0) toTypesByOnline();
  }, [props.visible, position]);

  useEffect(() => {
    if (props.visible && object == 'device' && devices.length <= 0) toCategoriesByOnline();
    else if (props.visible && object == 'package' && packages.length <= 0) toPackagesByOnline();
  }, [props.visible, object]);

  return (
    <Modal
      title="设备派发"
      visible={props.visible}
      closable={false}
      centered
      onOk={() => former.submit()}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Form form={former} onFinish={onSubmit}>
        <Form.Item label="类型" name="object" required>
          <Select>
            <Select.Option value="package">套餐</Select.Option>
            <Select.Option value="device">设备</Select.Option>
          </Select>
        </Form.Item>
        {object === 'package' ? (
          <Form.Item label="打包" name="package" rules={[{ required: true }]}>
            <Select loading={loading.packages} placeholder="请选择打包设备">
              {packages.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <Form.Item label="设备" required>
            <Input.Group compact>
              <Form.Item label="设备" noStyle name="device" rules={[{ required: true }]}>
                <Cascader
                  options={devices}
                  loadData={onDevices}
                  fieldNames={{ label: 'name', value: 'id' }}
                  style={{ width: '60%' }}
                  placeholder="请选择设备"
                />
              </Form.Item>
              <Form.Item
                label="数量"
                noStyle
                name="number"
                rules={[
                  { required: true },
                  { pattern: RegExp(Pattern.INTEGER), message: '数量输入错误' },
                ]}
              >
                <Input style={{ width: '40%' }} placeholder="请输入数量" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        )}
        <Form.Item label="位置" required>
          <Input.Group compact>
            <Form.Item noStyle name="position">
              <Select style={{ width: position == 'live' ? '100%' : '40%' }}>
                <Select.Option value="positions">位置</Select.Option>
                <Select.Option value="types">房型</Select.Option>
                <Select.Option value="live">在住人员</Select.Option>
              </Select>
            </Form.Item>
            {position !== 'live' &&
              (position === 'positions' ? (
                <Form.Item label="位置" noStyle name="positions" rules={[{ required: true }]}>
                  <Cascader
                    options={positions}
                    multiple
                    maxTagCount="responsive"
                    loadData={onPositions}
                    fieldNames={{ label: 'name', value: 'id' }}
                    placeholder="请选择分发楼栋"
                    style={{ width: '60%' }}
                  />
                </Form.Item>
              ) : (
                <Form.Item label="房型" noStyle name="types" rules={[{ required: true }]}>
                  <Cascader
                    options={types}
                    multiple
                    fieldNames={{ label: 'name', value: 'id' }}
                    placeholder="请选择分发房型位置"
                    style={{ width: '60%' }}
                  />
                </Form.Item>
              ))}
          </Input.Group>
        </Form.Item>
        <Form.Item label="备注" name="remark" rules={[{ required: true }, { max: 255 }]}>
          <Input.TextArea placeholder="请输入备注" maxLength={255} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Create;
