import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  notification,
  Popconfirm,
  Row,
  Select,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined, VerticalLeftOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import Create from '@/pages/Dormitory/Stay/People/Create';
import { doDelete, doPaginate } from './service';
import { doBuildingByOnline, doFloorByOnline } from '@/services/dormitory';
import Loop from '@/utils/Loop';

const Paginate: React.FC = () => {

  const { initialState } = useModel('@@initialState');

  const [filter, setFilter] = useState<APIStayPeoples.Filter>({});
  const [search, setSearch] = useState<APIStayPeoples.Search>({ status: 'live' });
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIStayPeoples.Visible>({});
  const [buildings, setBuildings] = useState<APIResponse.Online[]>([]);
  const [floors, setFloors] = useState<APIResponse.Online[]>([]);
  const [data, setData] = useState<APIStayPeoples.Data[]>();
  const [loading, setLoading] = useState<APIStayPeoples.Loading>({});
  const [paginate, setPaginate] = useState<APIData.Paginate>({});
  const [expands, setExpands] = useState<any[]>([]);

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
      .then((response: APIResponse.Paginate<APIStayPeoples.Data[]>) => {
        if (response.code === Constants.Success) {
          setPaginate({ page: response.data.page, total: response.data.total, size: response.data.size });
          setData(response.data.data || []);
          const ids: any[] = [];
          if (response.data.data) response.data.data.forEach(item => ids.push(item.id));
          setExpands(ids);
        }
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onDelete = (record: APIStayPeoples.Data) => {
    if (data) {
      const temp: APIStayPeoples.Data[] = [...data];
      Loop.byId(temp, record.id, (item: APIStayPeoples.Data) => item.loading_deleted = true);
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
          const temp: APIStayPeoples.Data[] = [...data];
          Loop.byId(temp, record.id, (item: APIStayPeoples.Data) => item.loading_deleted = false);
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setVisible({ ...visible, create: true });
  };

  const onSuccess = () => {
    setVisible({ ...visible, create: false });
    setSearch({ ...search, page: undefined });
  };

  const onCancel = () => {
    setVisible({ ...visible, create: false });
  };
  //
  // const onEnable = (record: APIStayPeoples.Data) => {
  //   if (data) {
  //     const temp: APIStayPeoples.Data[] = [...data];
  //     Loop.byId(temp, record.id, (item: APIStayPeoples.Data) => item.loading_enable = true);
  //     setData(temp);
  //   }
  //
  //   const enable: APIRequest.Enable = { id: record.id, is_enable: record.is_enable === 1 ? 0 : 1 };
  //
  //   doEnable(enable)
  //     .then((response: APIResponse.Response<any>) => {
  //       if (response.code !== Constants.Success) {
  //         notification.error({ message: response.message });
  //       } else {
  //         notification.success({ message: `房间${enable.is_enable === 1 ? '启用' : '禁用'}成功！` });
  //         if (data) {
  //           const temp = [...data];
  //           Loop.byId(temp, record.id, (item: APIStayPeoples.Data) => item.is_enable = enable.is_enable);
  //           setData(temp);
  //         }
  //       }
  //     })
  //     .finally(() => {
  //       if (data) {
  //         const temp = [...data];
  //         Loop.byId(temp, record.id, (item: APIStayPeoples.Data) => item.loading_enable = false);
  //         setData(temp);
  //       }
  //     });
  // };

  useEffect(() => {
    if (search.status) toPaginate();
  }, [search]);

  useEffect(() => {
    if (search.building) toFloorsByOnline();
    else setFloors([]);
  }, [search.building]);

  useEffect(() => {
    if (buildings.length <= 0) toBuildingsByOnline();
  }, []);

  const toRenderExpandable = (record: APIStayPeoples.Data) => {
    return (
      <Descriptions>
        <Descriptions.Item label='办理时间'>
          {record.created_at && moment(record.created_at).format('YYYY/MM/DD')}
        </Descriptions.Item>
        <Descriptions.Item label='入住时间'>
          {record.start ? moment(record.start).format('YYYY/MM/DD') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label='预离时间'>
          {record.end ? moment(record.end).format('YYYY/MM/DD') : '-'}
        </Descriptions.Item>
        {record.manager || record.titles || record.departments && record.departments.length > 0 ?
          <>
            <Descriptions.Item label='直系领导'>
              {record.manager ? `${record.manager.name}「${record.manager.mobile}」` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label='职位名称'>{record.titles || '-'}</Descriptions.Item>
            <Descriptions.Item label='所属部门'>
              {record.departments && record.departments.length > 0 ?
                record.departments.map((item, idx) => (
                  <Tag key={idx} color='green'>
                    {item}
                  </Tag>
                )) : <>-</>
              }
            </Descriptions.Item>
          </> : <></>
        }
        {record.certification ?
          <>
            <Descriptions.Item label='证件号码'>{record.certification?.no}</Descriptions.Item>
            <Descriptions.Item label='证件住址' span={2}>
              {record.certification?.address}
            </Descriptions.Item>
          </> : <></>
        }
      </Descriptions>
    );
  };

  return (
    <>
      <Card title='人员列表' extra={<Row gutter={[10, 10]}>
        {
          floors && floors.length > 0 ?
            <Col>
              <Select onChange={floor => setSearch({ ...search, floor, page: undefined })}
                      allowClear loading={loading.floor} placeholder='楼层筛选'>
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
            <Select onChange={building => setSearch({ ...search, building, page: undefined })} allowClear
                    placeholder='楼栋筛选'>
              {
                buildings.map(item => (
                  <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                ))
              }
            </Select>
          </Col>
        }
        <Col>
          <Select placeholder='临时' allowClear
                  onChange={is_temp => setSearch({ ...search, is_temp, page: undefined })}>
            <Select.Option value={0}>否</Select.Option>
            <Select.Option value={1}>是</Select.Option>
          </Select>
        </Col>
        <Col>
          <Select value={search.status} placeholder='状态'
                  onChange={status => setSearch({ ...search, status, page: undefined })}>
            <Select.Option value='live'>在住</Select.Option>
            <Select.Option value='leave'>离宿</Select.Option>
          </Select>
        </Col>
        <Col>
          <Input.Group compact>
            <Select value={filter.type || 'name'} style={{ width: '30%' }}
                    onChange={type => setFilter({ ...filter, type })}>
              <Select.Option value='name'>姓名</Select.Option>
              <Select.Option value='mobile'>电话</Select.Option>
              <Select.Option value='room'>房号</Select.Option>
            </Select>
            <Input.Search allowClear enterButton style={{ width: '70%' }}
                          onSearch={keyword => setSearch({ ...search, type: filter.type, keyword, page: undefined })} />
          </Input.Group>
        </Col>
        <Col>
          <Tooltip title='刷新'>
            <Button type='primary' icon={<RedoOutlined />} onClick={toPaginate} loading={loadingPaginate} />
          </Tooltip>
        </Col>
        {
          initialState?.permissions && initialState?.permissions?.indexOf('dormitory.basic.bed.create') >= 0 ?
            <Col>
              <Tooltip title='创建'>
                <Button type='primary' icon={<FormOutlined />} onClick={onCreate} />
              </Tooltip>
            </Col> : <></>
        }
      </Row>}>
        <Table dataSource={data} rowKey='id' loading={loadingPaginate}
               expandable={{
                 expandIcon: () => <VerticalLeftOutlined style={{ color: '#1890ff' }} />,
                 expandedRowKeys: expands,
                 expandedRowRender: toRenderExpandable,
               }}
               pagination={{
                 pageSize: paginate.size,
                 current: paginate.page,
                 total: paginate.total,
                 onChange: page => setSearch({ ...search, page }),
               }}>
          <Table.Column title='姓名' dataIndex='name' />
          <Table.Column title='房间' key='building' render={(record: APIStayPeoples.Data) =>
            `${record.building}-${record.floor}-${record.room}-${record.bed}`
          } />
          <Table.Column title='类型' dataIndex='category' />
          <Table.Column title='手机号' dataIndex='mobile' />
          <Table.Column title='临时' align='center' render={(record: APIStayPeoples.Data) => (
            <Tag color={record.is_temp === 0 ? '#87d068' : '#f50'}>{record.is_temp === 0 ? '正式' : '临时'}</Tag>
          )} />
          <Table.Column align='center' width={100} render={(record: APIStayPeoples.Data) => (
            <>
              {
                initialState?.permissions && initialState?.permissions?.indexOf('dormitory.live.live.leave') >= 0 ?
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
        visible.create != undefined ?
          <Create visible={visible.create} buildings={buildings} onCreate={onSuccess} onCancel={onCancel} /> : <></>
      }
    </>
  );
};

export default Paginate;