import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Input, notification, Popconfirm, Row, Select, Switch, Table, Tag, Tooltip } from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import Editor from '@/pages/Dormitory/Basic/Room/Editor';
import { doDelete, doEnable, doFurnish, doPaginate } from './service';
import { doBuildingByOnline, doFloorByOnline } from '@/services/dormitory';
import Loop from '@/utils/Loop';

const Paginate: React.FC = () => {

  const { initialState } = useModel('@@initialState');

  const [search, setSearch] = useState<APIBasicRooms.Search>({});
  const [editor, setEditor] = useState<APIBasicRooms.Data | undefined>();
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIBasicRooms.Visible>({});
  const [buildings, setBuildings] = useState<APIResponse.Online[]>([]);
  const [floors, setFloors] = useState<APIResponse.Online[]>([]);
  const [data, setData] = useState<APIBasicRooms.Data[]>();
  const [loading, setLoading] = useState<APIBasicRooms.Loading>({});
  const [paginate, setPaginate] = useState<APIData.Paginate>({});

  const toBuildingsByOnline = () => {
    doBuildingByOnline()
      .then((response: APIResponse.Response<APIResponse.Online[]>) => {
        if (response.code == Constants.Success) {
          setBuildings(response.data || []);
        }
      });
  };

  const toFloorsByOnline = () => {
    setLoading({ ...loading, floor: true });
    doFloorByOnline(search.building)
      .then((response: APIResponse.Response<APIResponse.Online[]>) => {
        if (response.code == Constants.Success) {
          setFloors(response.data || []);
        }
      })
      .finally(() => setLoading({ ...loading, floor: false }));
  };

  const toPaginate = () => {
    setLoadingPaginate(true);
    doPaginate(search)
      .then((response: APIResponse.Paginate<APIBasicRooms.Data[]>) => {
        if (response.code === Constants.Success) {
          setPaginate({ page: response.data.page, total: response.data.total, size: response.data.size });
          setData(response.data.data || []);
        }
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onDelete = (record: APIBasicRooms.Data) => {
    if (data) {
      const temp: APIBasicRooms.Data[] = [...data];
      Loop.byId(temp, record.id, (item: APIBasicRooms.Data) => item.loading_deleted = true);
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
          const temp: APIBasicRooms.Data[] = [...data];
          Loop.byId(temp, record.id, (item: APIBasicRooms.Data) => item.loading_deleted = false);
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIBasicRooms.Data) => {
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

  const onEnable = (record: APIBasicRooms.Data) => {
    if (data) {
      const temp: APIBasicRooms.Data[] = [...data];
      Loop.byId(temp, record.id, (item: APIBasicRooms.Data) => item.loading_enable = true);
      setData(temp);
    }

    const enable: APIRequest.Enable = { id: record.id, is_enable: record.is_enable === 1 ? 0 : 1 };

    doEnable(enable)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: `房间${enable.is_enable === 1 ? '启用' : '禁用'}成功！` });
          if (data) {
            const temp = [...data];
            Loop.byId(temp, record.id, (item: APIBasicRooms.Data) => item.is_enable = enable.is_enable);
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          Loop.byId(temp, record.id, (item: APIBasicRooms.Data) => item.loading_enable = false);
          setData(temp);
        }
      });
  };

  const onFurnish = (record: APIBasicRooms.Data) => {
    if (data) {
      const temp: APIBasicRooms.Data[] = [...data];
      Loop.byId(temp, record.id, (item: APIBasicRooms.Data) => item.loading_furnish = true);
      setData(temp);
    }

    const furnish: APIBasicRooms.Furnish = { id: record.id, is_furnish: record.is_furnish === 1 ? 0 : 1 };

    doFurnish(furnish)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: `房间${furnish.is_furnish === 1 ? '开启' : '关闭'}装修成功！` });
          if (data) {
            const temp = [...data];
            Loop.byId(temp, record.id, (item: APIBasicRooms.Data) => item.is_furnish = furnish.is_furnish);
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          Loop.byId(temp, record.id, (item: APIBasicRooms.Data) => item.loading_furnish = false);
          setData(temp);
        }
      });
  };

  useEffect(() => {
    toPaginate();
  }, [search]);

  useEffect(() => {
    if (search.building) toFloorsByOnline();
    else setFloors([]);
  }, [search.building]);

  useEffect(() => {
    if (buildings.length <= 0) toBuildingsByOnline();
  }, []);

  return (
    <>
      <Card title='房间列表' extra={<Row gutter={10}>
        {
          floors && floors.length > 0 ?
            <Col>
              <Select onChange={floor => setSearch({ ...search, floor })} allowClear loading={loading.floor}
                      placeholder='楼层筛选'>
                {
                  floors.map(item => (
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Col> : <></>
        }
        {
          buildings &&
          <Col>
            <Select onChange={building => setSearch({ ...search, building })} allowClear placeholder='楼栋筛选'>
              {
                buildings.map(item => (
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                ))
              }
            </Select>
          </Col>
        }
        <Col>
          <Input.Search onSearch={room => setSearch({ ...search, room })} allowClear enterButton placeholder='房间号' />
        </Col>
        <Col>
          <Tooltip title='刷新'>
            <Button type='primary' icon={<RedoOutlined />} onClick={toPaginate} loading={loadingPaginate} />
          </Tooltip>
        </Col>
        {
          initialState?.permissions && initialState?.permissions?.indexOf('dormitory.basic.room.create') >= 0 ?
            <Col>
              <Tooltip title='创建'>
                <Button type='primary' icon={<FormOutlined />} onClick={onCreate} />
              </Tooltip>
            </Col> : <></>
        }
      </Row>}>
        <Table dataSource={data} rowKey='id' loading={loadingPaginate} pagination={{
          pageSize: paginate.size,
          current: paginate.page,
          total: paginate.total,
          onChange: page => setSearch({ ...search, page }),
        }}>
          <Table.Column title='名称' dataIndex='name' />
          <Table.Column title='楼栋' dataIndex='building' />
          <Table.Column title='楼层' dataIndex='floor' />
          <Table.Column title='房型' dataIndex='type' />
          <Table.Column title='序号' render={(record: APIBasicRooms.Data) => (
            <Tag color={initialState?.settings?.primaryColor}>{record.order}</Tag>
          )} />
          <Table.Column title='装修' align='center' render={(record: APIBasicRooms.Data) => (
            <Switch size='small' checked={record.is_furnish === 1} onClick={() => onFurnish(record)}
                    disabled={initialState?.permissions && initialState?.permissions?.indexOf('dormitory.basic.room.furnish') < 0}
                    loading={record.loading_furnish} />
          )} />
          <Table.Column title='启用' align='center' render={(record: APIBasicRooms.Data) => (
            <Switch size='small' checked={record.is_enable === 1} onClick={() => onEnable(record)}
                    disabled={initialState?.permissions && initialState?.permissions?.indexOf('dormitory.basic.room.enable') < 0}
                    loading={record.loading_enable} />
          )} />
          <Table.Column title='创建时间' align='center' render={(record: APIBasicRooms.Data) => (
            record.created_at && moment(record.created_at).format('YYYY/MM/DD')
          )} />
          <Table.Column align='center' width={100} render={(record: APIBasicRooms.Data) => (
            <>
              {
                initialState?.permissions && initialState?.permissions?.indexOf('dormitory.basic.room.update') >= 0 ?
                  <Button type='link' onClick={() => onUpdate(record)}>编辑</Button> : <></>
              }
              {
                initialState?.permissions && initialState?.permissions?.indexOf('dormitory.basic.room.delete') >= 0 ?
                  <Popconfirm
                    title='确定要删除该数据?'
                    placement='leftTop'
                    onConfirm={() => onDelete(record)}
                  >
                    <Button type='link' danger loading={record.loading_deleted}>删除</Button>
                  </Popconfirm> : <></>
              }
            </>
          )} />
        </Table>
      </Card>
      {
        visible.editor != undefined ?
          <Editor visible={visible.editor} buildings={buildings} params={editor}
                  onSave={onSuccess} onCancel={onCancel} /> : <></>
      }
    </>
  );
};

export default Paginate;