import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Cascader,
  Col,
  Input,
  notification,
  Popconfirm,
  Row,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import Editor from '@/pages/Dormitory/Basic/Bed/Editor';
import { doDelete, doEnable, doPaginate } from './service';
import { doBuildingByOnline, doFloorByOnline } from '@/services/dormitory';
import Loop from '@/utils/Loop';

const Paginate: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [search, setSearch] = useState<APIBasicBeds.Search>({});
  const [editor, setEditor] = useState<APIBasicBeds.Data | undefined>();
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIBasicBeds.Visible>({});
  const [buildings, setBuildings] = useState<APIResponse.Online[]>([]);
  const [positions, setPositions] = useState<APIData.Tree[]>([]);
  const [data, setData] = useState<APIBasicBeds.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});

  const toBuildingsByOnline = () => {
    doBuildingByOnline({ is_public: 2 }).then(
      (response: APIResponse.Response<APIResponse.Online[]>) => {
        if (response.code == Constants.Success) {
          setBuildings(response.data || []);
        }
      },
    );
  };

  const toFloorsByOnline = (id?: number) => {
    doFloorByOnline(id, { is_public: 2 }).then(
      (response: APIResponse.Response<APIResponse.Online[]>) => {
        const temp = [...positions];
        Loop.ById(
          temp,
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
        if (data !== positions) setPositions(temp);
      },
    );
  };

  const toPaginate = () => {
    setLoadingPaginate(true);
    doPaginate(search)
      .then((response: APIResponse.Paginate<APIBasicBeds.Data[]>) => {
        if (response.code === Constants.Success) {
          setPaginate({
            page: response.data.page,
            total: response.data.total,
            size: response.data.size,
          });
          setData(response.data.data || []);
        }
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onDelete = (record: APIBasicBeds.Data) => {
    if (data) {
      const temp: APIBasicBeds.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIBasicBeds.Data) => (item.loading_deleted = true));
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '房间删除成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        if (data) {
          const temp: APIBasicBeds.Data[] = [...data];
          Loop.ById(temp, record.id, (item: APIBasicBeds.Data) => (item.loading_deleted = false));
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIBasicBeds.Data) => {
    setEditor(record);
    setVisible({ ...visible, editor: true });
  };

  const onSuccess = () => {
    setVisible({ ...visible, editor: false });
    toPaginate();
  };

  const onCancel = () => {
    setVisible({ ...visible, editor: false });
  };

  const onEnable = (record: APIBasicBeds.Data) => {
    if (data) {
      const temp: APIBasicBeds.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIBasicBeds.Data) => (item.loading_enable = true));
      setData(temp);
    }

    const enable: APIRequest.Enable = { id: record.id, is_enable: record.is_enable === 1 ? 2 : 1 };

    doEnable(enable)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({
            message: `房间${enable.is_enable === 1 ? '启用' : '禁用'}成功！`,
          });
          if (data) {
            const temp = [...data];
            Loop.ById(
              temp,
              record.id,
              (item: APIBasicBeds.Data) => (item.is_enable = enable.is_enable),
            );
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          Loop.ById(temp, record.id, (item: APIBasicBeds.Data) => (item.loading_enable = false));
          setData(temp);
        }
      });
  };

  const onPositions = (values: APIData.Tree[]) => {
    const value = values[values.length - 1];
    if (value.children == undefined || value.children.length <= 0) {
      if (value.object === 'building') toFloorsByOnline(value.id);
    }
  };

  const onChangePosition = (values: any[]) => {
    if (!values || values.length <= 0)
      setSearch({ ...search, building: undefined, floor: undefined, page: undefined });
    else if (values.length >= 2)
      setSearch({ ...search, building: undefined, floor: values[1], page: undefined });
    else if (values.length >= 1)
      setSearch({ ...search, building: values[0], floor: undefined, page: undefined });
  };

  useEffect(() => {
    if (buildings && buildings.length > 0 && positions.length <= 0) {
      const temp: APIData.Tree[] = [];
      buildings.forEach((item) =>
        temp.push({ id: item.id, object: 'building', name: item.name, isLeaf: false }),
      );
      setPositions(temp);
    }
  }, [buildings]);

  useEffect(() => {
    toPaginate();
  }, [search]);

  useEffect(() => {
    if (buildings.length <= 0) toBuildingsByOnline();
  }, []);

  return (
    <>
      <Card
        title="床位列表"
        extra={
          <Row gutter={[10, 10]} justify="end">
            <Col>
              <Cascader
                options={positions}
                loadData={onPositions}
                onChange={onChangePosition}
                fieldNames={{ label: 'name', value: 'id' }}
                changeOnSelect
                placeholder="位置选择"
              />
            </Col>
            <Col>
              <Input.Search
                onSearch={(bed) => setSearch({ ...search, bed })}
                allowClear
                enterButton
                placeholder="床位号"
              />
            </Col>
            <Col>
              <Tooltip title="刷新">
                <Button
                  type="primary"
                  icon={<RedoOutlined />}
                  onClick={toPaginate}
                  loading={loadingPaginate}
                />
              </Tooltip>
            </Col>
            {initialState?.permissions &&
            initialState?.permissions?.indexOf('dormitory.basic.bed.create') >= 0 ? (
              <Col>
                <Tooltip title="创建">
                  <Button type="primary" icon={<FormOutlined />} onClick={onCreate} />
                </Tooltip>
              </Col>
            ) : (
              <></>
            )}
          </Row>
        }
      >
        <Table
          dataSource={data}
          rowKey="id"
          loading={loadingPaginate}
          pagination={{
            pageSize: paginate.size,
            current: paginate.page,
            total: paginate.total,
            showSizeChanger: false,
            onChange: (page) => setSearch({ ...search, page }),
          }}
        >
          <Table.Column title="名称" dataIndex="name" />
          <Table.Column title="楼栋" dataIndex="building" />
          <Table.Column title="楼层" dataIndex="floor" />
          <Table.Column title="房间" dataIndex="room" />
          <Table.Column
            title="公共区域"
            align="center"
            render={(record: APIBasicRooms.Data) => (
              <Tag color={record.is_public === 1 ? '#87d068' : '#f50'}>
                {record.is_public === 1 ? '是' : '否'}
              </Tag>
            )}
          />
          <Table.Column
            title="序号"
            align="center"
            render={(record: APIBasicBeds.Data) => (
              <Tag color={initialState?.settings?.primaryColor}>{record.order}</Tag>
            )}
          />
          <Table.Column
            title="启用"
            align="center"
            render={(record: APIBasicBeds.Data) => (
              <Switch
                size="small"
                checked={record.is_enable === 1}
                onClick={() => onEnable(record)}
                disabled={
                  initialState?.permissions &&
                  initialState?.permissions?.indexOf('dormitory.basic.bed.enable') < 0
                }
                loading={record.loading_enable}
              />
            )}
          />
          <Table.Column
            title="创建时间"
            align="center"
            render={(record: APIBasicBeds.Data) =>
              record.created_at && moment(record.created_at).format('YYYY/MM/DD')
            }
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APIBasicBeds.Data) => (
              <>
                {initialState?.permissions &&
                initialState?.permissions?.indexOf('dormitory.basic.room.update') >= 0 ? (
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                ) : (
                  <></>
                )}
                {initialState?.permissions &&
                initialState?.permissions?.indexOf('dormitory.basic.bed.delete') >= 0 ? (
                  <Popconfirm
                    title="确定要删除该数据?"
                    placement="leftTop"
                    onConfirm={() => onDelete(record)}
                  >
                    <Button type="link" danger loading={record.loading_deleted}>
                      删除
                    </Button>
                  </Popconfirm>
                ) : (
                  <></>
                )}
              </>
            )}
          />
        </Table>
      </Card>
      {visible.editor != undefined ? (
        <Editor
          visible={visible.editor}
          buildings={buildings}
          params={editor}
          onSave={onSuccess}
          onCancel={onCancel}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Paginate;
