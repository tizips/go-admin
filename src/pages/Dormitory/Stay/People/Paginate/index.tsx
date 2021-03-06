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
  Row,
  Select,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined, VerticalLeftOutlined } from '@ant-design/icons';
import Create from '@/pages/Dormitory/Stay/People/Create';
import { doDelete, doPaginate } from './service';
import { doBuildingByOnline, doFloorByOnline } from '@/services/dormitory';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Basic/Authorize';

const Paginate: React.FC = () => {
  const [filter, setFilter] = useState<APIDormitoryStayPeoples.Filter>({});
  const [search, setSearch] = useState<APIDormitoryStayPeoples.Search>({ status: 'live' });
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIDormitoryStayPeoples.Visible>({});
  const [buildings, setBuildings] = useState<APIData.Online[]>([]);
  const [positions, setPositions] = useState<APIData.Tree[]>([]);
  const [data, setData] = useState<APIDormitoryStayPeoples.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});
  const [expands, setExpands] = useState<any[]>([]);

  const toBuildingsByOnline = () => {
    doBuildingByOnline({ is_public: 2 }).then(
      (response: APIResponse.Response<APIData.Online[]>) => {
        if (response.code == Constants.Success) {
          setBuildings(response.data || []);
        }
      },
    );
  };

  const toFloorsByOnline = (id?: number) => {
    doFloorByOnline(id, { is_public: 2 }).then(
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
    setLoadingPaginate(true);
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
      .finally(() => setLoadingPaginate(false));
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
          notification.success({ message: '???????????????' });
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
        <Descriptions.Item label="????????????">
          {record.created_at && moment(record.created_at).format('YYYY/MM/DD')}
        </Descriptions.Item>
        <Descriptions.Item label="????????????">
          {record.start ? moment(record.start).format('YYYY/MM/DD') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="????????????">
          {record.end ? moment(record.end).format('YYYY/MM/DD') : '-'}
        </Descriptions.Item>
        {(record.manager ||
          record.titles ||
          (record.departments && record.departments.length > 0)) && (
          <>
            <Descriptions.Item label="????????????">
              {record.manager ? `${record.manager.name}???${record.manager.mobile}???` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="????????????">{record.titles || '-'}</Descriptions.Item>
            <Descriptions.Item label="????????????">
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
            <Descriptions.Item label="????????????">{record.certification?.no}</Descriptions.Item>
            <Descriptions.Item label="????????????" span={2}>
              {record.certification?.address}
            </Descriptions.Item>
          </>
        )}
        {record.remark && (
          <Descriptions.Item label="??????" span={3}>
            {record.remark}
          </Descriptions.Item>
        )}
      </Descriptions>
    );
  };

  return (
    <>
      <Card
        title="????????????"
        extra={
          <Row gutter={[10, 10]} justify="end">
            <Col>
              <Cascader
                options={positions}
                loadData={onPositions}
                onChange={onChangePosition}
                fieldNames={{ label: 'name', value: 'id' }}
                changeOnSelect
                placeholder="????????????"
              />
            </Col>
            <Col>
              <Select
                placeholder="??????"
                allowClear
                onChange={(is_temp) => setSearch({ ...search, is_temp, page: undefined })}
              >
                <Select.Option value={1}>???</Select.Option>
                <Select.Option value={2}>???</Select.Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={search.status}
                placeholder="??????"
                onChange={(status) => setSearch({ ...search, status, page: undefined })}
              >
                <Select.Option value="live">??????</Select.Option>
                <Select.Option value="leave">??????</Select.Option>
              </Select>
            </Col>
            <Col>
              <Input.Group compact>
                <Select
                  value={filter.type || 'name'}
                  style={{ width: '30%' }}
                  onChange={(type) => setFilter({ ...filter, type })}
                >
                  <Select.Option value="name">??????</Select.Option>
                  <Select.Option value="mobile">??????</Select.Option>
                  <Select.Option value="room">??????</Select.Option>
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
            </Col>
            <Col>
              <Tooltip title="??????">
                <Button
                  type="primary"
                  icon={<RedoOutlined />}
                  onClick={toPaginate}
                  loading={loadingPaginate}
                />
              </Tooltip>
            </Col>
            <Authorize permission="dormitory.basic.bed.create">
              <Col>
                <Tooltip title="??????">
                  <Button type="primary" icon={<FormOutlined />} onClick={onCreate} />
                </Tooltip>
              </Col>
            </Authorize>
          </Row>
        }
      >
        <Table
          dataSource={data}
          rowKey="id"
          loading={loadingPaginate}
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
          <Table.Column title="??????" dataIndex="name" />
          <Table.Column
            title="??????"
            key="building"
            render={(record: APIDormitoryStayPeoples.Data) =>
              `${record.building}-${record.floor}-${record.room}-${record.bed}`
            }
          />
          <Table.Column title="??????" dataIndex="category" />
          <Table.Column title="?????????" dataIndex="mobile" />
          <Table.Column
            title="??????"
            align="center"
            render={(record: APIDormitoryStayPeoples.Data) => (
              <Tag color={record.is_temp === 2 ? '#87d068' : '#f50'}>
                {record.is_temp === 2 ? '??????' : '??????'}
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
                    title="?????????????????????????"
                    placement="leftTop"
                    onConfirm={() => onDelete(record)}
                  >
                    <Button type="link" danger loading={record.loading_deleted}>
                      ??????
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
