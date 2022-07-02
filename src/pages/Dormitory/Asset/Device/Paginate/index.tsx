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
  Tooltip,
} from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined, VerticalLeftOutlined } from '@ant-design/icons';
import Create from '@/pages/Dormitory/Asset/Device/Create';
import { doDelete, doPaginate } from './service';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Basic/Authorize';

const Paginate: React.FC = () => {
  const [editor, setEditor] = useState<APIDormitoryAssetDevices.Data | undefined>();
  const [filter, setFilter] = useState<APIDormitoryAssetDevices.Filter>({});
  const [search, setSearch] = useState<APIDormitoryAssetDevices.Search>({});
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIDormitoryAssetDevices.Visible>({});
  const [data, setData] = useState<APIDormitoryAssetDevices.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});
  const [expands, setExpands] = useState<any[]>([]);

  const toPaginate = () => {
    setLoadingPaginate(true);
    doPaginate(search)
      .then((response: APIResponse.Paginate<APIDormitoryAssetDevices.Data[]>) => {
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

  const onDelete = (record: APIDormitoryAssetDevices.Data) => {
    if (data) {
      const temp: APIDormitoryAssetDevices.Data[] = [...data];
      Loop.ById(temp, record.id, (item) => (item.loading_deleted = true));
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
          const temp: APIDormitoryAssetDevices.Data[] = [...data];
          Loop.ById(temp, record.id, (item) => (item.loading_deleted = false));
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setVisible({ ...visible, create: true });
  };

  const onUpdate = (record: APIDormitoryAssetDevices.Data) => {
    setVisible({ ...visible, create: true });

    setEditor(record);
  };

  const onSuccess = () => {
    setVisible({ ...visible, create: false });
    setSearch({ ...search, page: undefined });
  };

  const onCancel = () => {
    setVisible({ ...visible, create: false });
  };

  useEffect(() => {
    toPaginate();
  }, [search]);

  const toRenderExpandable = (record: APIDormitoryAssetDevices.Data) => {
    return (
      <Descriptions>
        <Descriptions.Item label="进价">
          {record.price ? `${(record.price / 100).toFixed(2)} / ${record.unit}` : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="赔偿">
          {record.indemnity ? `${(record.indemnity / 100).toFixed(2)} / ${record.unit}` : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="规格">{record.specification}</Descriptions.Item>
        <Descriptions.Item label="库存">{record.stock_total}</Descriptions.Item>
        <Descriptions.Item label="已用">{record.stock_used}</Descriptions.Item>
        <Descriptions.Item label="剩余">{record.stock_total - record.stock_used}</Descriptions.Item>
        {record.remark ? (
          <Descriptions.Item label="备注" span={3}>
            {record.remark}
          </Descriptions.Item>
        ) : (
          <></>
        )}
      </Descriptions>
    );
  };

  return (
    <>
      <Card
        title="设备列表"
        extra={
          <Row gutter={[10, 10]} justify="end">
            <Col>
              <Input.Group compact>
                <Select
                  value={filter.type || 'name'}
                  style={{ width: '30%' }}
                  onChange={(type) => setFilter({ ...filter, type })}
                >
                  <Select.Option value="name">名称</Select.Option>
                  <Select.Option value="no">编号</Select.Option>
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
              <Tooltip title="刷新">
                <Button
                  type="primary"
                  icon={<RedoOutlined />}
                  onClick={toPaginate}
                  loading={loadingPaginate}
                />
              </Tooltip>
            </Col>
            <Authorize permission="dormitory.asset.device.create">
              <Col>
                <Tooltip title="创建">
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
          <Table.Column title="名称" dataIndex="name" />
          <Table.Column title="类型" dataIndex="category" />
          <Table.Column title="编号" dataIndex="no" />
          <Table.Column
            title="创建时间"
            render={(record: APIDormitoryAssetDevices.Data) =>
              record.created_at && moment(record.created_at).format('YYYY/MM/DD')
            }
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APIDormitoryAssetDevices.Data) => (
              <>
                <Authorize permission="dormitory.asset.device.update">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    修改
                  </Button>
                </Authorize>
                <Authorize permission="dormitory.asset.device.delete">
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
        <Create visible={visible.create} params={editor} onCreate={onSuccess} onCancel={onCancel} />
      )}
    </>
  );
};

export default Paginate;
