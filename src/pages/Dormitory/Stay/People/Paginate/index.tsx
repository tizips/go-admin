import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Cascader,
  Col,
  Descriptions,
  Input,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined, VerticalLeftOutlined } from '@ant-design/icons';
import Create from '@/pages/Dormitory/Stay/People/Create';
import { doDelete, doPaginate } from './service';
import { doDormitoryBuildingByOnline, doDormitoryFloorByOnline } from '@/services/dormitory';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Basic/Authorize';

const Paginate: React.FC = () => {
  const [filter, setFilter] = useState<APIDormitoryStayPeoples.Filter>({});
  const [search, setSearch] = useState<APIDormitoryStayPeoples.Search>({ status: 'live' });
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APIDormitoryStayPeoples.Visible>({});
  const [buildings, setBuildings] = useState<APIData.Online[]>([]);
  const [positions, setPositions] = useState<APIData.Tree[]>([]);
  const [data, setData] = useState<APIDormitoryStayPeoples.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});
  const [expands, setExpands] = useState<any[]>([]);

  const toBuildingsByOnline = () => {
    doDormitoryBuildingByOnline({ is_public: 2 }).then(
      (response: APIResponse.Response<APIData.Online[]>) => {
        if (response.code == Constants.Success) {
          setBuildings(response.data || []);
        }
      },
    );
  };

  const toFloorsByOnline = (id?: number) => {
    doDormitoryFloorByOnline(id, { is_public: 2 }).then(
      (response: APIResponse.Response<APIData.Online[]>) => {
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
        if (temp !== positions) setPositions(temp);
      },
    );
  };

  const toPaginate = () => {
    setLoad(true);
    doPaginate(search)
      .then((response: APIResponse.Paginate<APIDormitoryStayPeoples.Data[]>) => {
        if (response.code === Constants.Success) {
          setPaginate({
            page: response.data.page,
            total: response.data.total,
            size: response.data.size,
          });
          setData(response.data.data || []);
          const ids: any[] = [];
          if (response.data.data) response.data.data.forEach((item) => ids.push(item.id));
          setExpands(ids);
        }
      })
      .finally(() => setLoad(false));
  };

  const onDelete = (record: APIDormitoryStayPeoples.Data) => {
    if (data) {
      const temp: APIDormitoryStayPeoples.Data[] = [...data];
      Loop.ById(temp, record.id, (item) => (item.loading_deleted = true));
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '删除成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        if (data) {
          const temp: APIDormitoryStayPeoples.Data[] = [...data];
          Loop.ById(temp, record.id, (item) => (item.loading_deleted = false));
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
    if (search.status) toPaginate();
  }, [search]);

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
    if (buildings.length <= 0) toBuildingsByOnline();
  }, []);

  const toRenderExpandable = (record: APIDormitoryStayPeoples.Data) => {
    return (
      <Descriptions>
        <Descriptions.Item label="办理时间">
          {record.created_at && moment(record.created_at).format('YYYY/MM/DD')}
        </Descriptions.Item>
        <Descriptions.Item label="入住时间">
          {record.start ? moment(record.start).format('YYYY/MM/DD') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="预离时间">
          {record.end ? moment(record.end).format('YYYY/MM/DD') : '-'}
        </Descriptions.Item>
        {(record.manager ||
          record.titles ||
          (record.departments && record.departments.length > 0)) && (
          <>
            <Descriptions.Item label="直系领导">
              {record.manager ? `${record.manager.name}「${record.manager.mobile}」` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="职位名称">{record.titles || '-'}</Descriptions.Item>
            <Descriptions.Item label="所属部门">
              {record.departments?.map((item, idx) => (
                <Tag key={idx} color="green">
                  {item}
                </Tag>
              ))}
            </Descriptions.Item>
          </>
        )}
        {record.certification && (
          <>
            <Descriptions.Item label="证件号码">{record.certification?.no}</Descriptions.Item>
            <Descriptions.Item label="证件住址" span={2}>
              {record.certification?.address}
            </Descriptions.Item>
          </>
        )}
        {record.remark && (
          <Descriptions.Item label="备注" span={3}>
            {record.remark}
          </Descriptions.Item>
        )}
      </Descriptions>
    );
  };

  return (
    <>
      <Card
        title="人员列表"
        extra={
          <Space size={[10, 10]} wrap>
            <Cascader
              options={positions}
              loadData={onPositions}
              onChange={onChangePosition}
              fieldNames={{ label: 'name', value: 'id' }}
              changeOnSelect
              placeholder="位置选择"
            />
            <Select
              placeholder="临时"
              allowClear
              onChange={(is_temp) => setSearch({ ...search, is_temp, page: undefined })}
            >
              <Select.Option value={1}>是</Select.Option>
              <Select.Option value={2}>否</Select.Option>
            </Select>
            <Select
              value={search.status}
              placeholder="状态"
              onChange={(status) => setSearch({ ...search, status, page: undefined })}
            >
              <Select.Option value="live">在住</Select.Option>
              <Select.Option value="leave">离宿</Select.Option>
            </Select>
            <Input.Group compact>
              <Select
                value={filter.type || 'name'}
                style={{ width: '30%' }}
                onChange={(type) => setFilter({ ...filter, type })}
              >
                <Select.Option value="name">姓名</Select.Option>
                <Select.Option value="mobile">电话</Select.Option>
                <Select.Option value="room">房号</Select.Option>
              </Select>
              <Input.Search
                allowClear
                enterButton
                style={{ width: '70%' }}
                onSearch={(keyword) =>
                  setSearch({ ...search, type: filter.type, keyword, page: undefined })
                }
              />
            </Input.Group>
            <Tooltip title="刷新">
              <Button type="primary" icon={<RedoOutlined />} onClick={toPaginate} loading={load} />
            </Tooltip>
            <Authorize permission="dormitory.basic.bed.create">
              <Col>
                <Tooltip title="创建">
                  <Button type="primary" icon={<FormOutlined />} onClick={onCreate} />
                </Tooltip>
              </Col>
            </Authorize>
          </Space>
        }
      >
        <Table
          dataSource={data}
          rowKey="id"
          loading={load}
          expandable={{
            expandIcon: () => <VerticalLeftOutlined style={{ color: '#1890ff' }} />,
            expandedRowKeys: expands,
            expandedRowRender: toRenderExpandable,
          }}
          pagination={{
            pageSize: paginate.size,
            current: paginate.page,
            total: paginate.total,
            showSizeChanger: false,
            onChange: (page) => setSearch({ ...search, page }),
          }}
        >
          <Table.Column title="姓名" dataIndex="name" />
          <Table.Column
            title="房间"
            key="building"
            render={(record: APIDormitoryStayPeoples.Data) =>
              `${record.building}-${record.floor}-${record.room}-${record.bed}`
            }
          />
          <Table.Column title="类型" dataIndex="category" />
          <Table.Column title="手机号" dataIndex="mobile" />
          <Table.Column
            title="临时"
            align="center"
            render={(record: APIDormitoryStayPeoples.Data) => (
              <Tag color={record.is_temp === 2 ? '#87d068' : '#f50'}>
                {record.is_temp === 2 ? '正式' : '临时'}
              </Tag>
            )}
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APIDormitoryStayPeoples.Data) => (
              <>
                <Authorize permission="dormitory.live.live.leave">
                  <Popconfirm
                    title="确定要删除该数据?"
                    placement="leftTop"
                    onConfirm={() => onDelete(record)}
                  >
                    <Button type="link" danger loading={record.loading_deleted}>
                      删除
                    </Button>
                  </Popconfirm>
                </Authorize>
              </>
            )}
          />
        </Table>
      </Card>
      {visible.create != undefined && (
        <Create
          visible={visible.create}
          buildings={buildings}
          onCreate={onSuccess}
          onCancel={onCancel}
        />
      )}
    </>
  );
};

export default Paginate;
