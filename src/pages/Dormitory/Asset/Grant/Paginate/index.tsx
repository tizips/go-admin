import React, { useEffect, useState } from 'react';
import { Button, Card, Col, notification, Popconfirm, Row, Table, Tag, Tooltip } from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { DeploymentUnitOutlined, RedoOutlined } from '@ant-design/icons';
import Create from '@/pages/Dormitory/Asset/Grant/Create';
import { doPaginate, doRevoke } from './service';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Basic/Authorize';

const Paginate: React.FC = () => {
  const [editor, setEditor] = useState<APIDormitoryAssetGrants.Data | undefined>();
  const [search, setSearch] = useState<APIDormitoryAssetGrants.Search>({});
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIDormitoryAssetGrants.Visible>({});
  const [data, setData] = useState<APIDormitoryAssetGrants.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});

  const toPaginate = () => {
    setLoadingPaginate(true);
    doPaginate(search)
      .then((response: APIResponse.Paginate<APIDormitoryAssetGrants.Data[]>) => {
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

  const onRevoke = (record: APIDormitoryAssetGrants.Data) => {
    if (data) {
      const temp: APIDormitoryAssetGrants.Data[] = [...data];
      Loop.ById(temp, record.id, (item) => (item.loading_revoke = true));
      setData(temp);
    }

    doRevoke(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '发放设备回撤成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        if (data) {
          const temp: APIDormitoryAssetGrants.Data[] = [...data];
          Loop.ById(temp, record.id, (item) => (item.loading_revoke = false));
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, create: true });
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

  return (
    <>
      <Card
        title="发放记录"
        extra={
          <Row gutter={[10, 10]} justify="end">
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
            <Authorize permission="dormitory.asset.grant.create">
              <Col>
                <Tooltip title="派发">
                  <Button type="primary" icon={<DeploymentUnitOutlined />} onClick={onCreate} />
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
          pagination={{
            pageSize: paginate.size,
            current: paginate.page,
            total: paginate.total,
            showSizeChanger: false,
            onChange: (page) => setSearch({ ...search, page }),
          }}
        >
          <Table.Column
            title="设备"
            render={(record: APIDormitoryAssetGrants.Data) =>
              record.devices?.map((item) => (
                <Tag key={item.name} color="green">
                  {item.name} * {item.number}
                </Tag>
              ))
            }
          />
          <Table.Column
            title="打包"
            render={(record: APIDormitoryAssetGrants.Data) => (
              <Tag color={record.package ? '#2db7f5' : '#f50'}>
                {record.package ? record.package : '无'}
              </Tag>
            )}
          />
          <Table.Column title="备注" dataIndex="remark" />
          <Table.Column
            title="创建时间"
            render={(record: APIDormitoryAssetGrants.Data) =>
              record.created_at && moment(record.created_at).format('YYYY/MM/DD')
            }
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APIDormitoryAssetGrants.Data) => (
              <Authorize permission="dormitory.asset.grant.cancel">
                {moment(record.created_at).diff(moment(), 'second') >= -86400 && (
                  <Popconfirm
                    title="确定要回撤该设备的发放?"
                    placement="leftTop"
                    onConfirm={() => onRevoke(record)}
                  >
                    <Button type="link" danger loading={record.loading_revoke}>
                      撤销
                    </Button>
                  </Popconfirm>
                )}
              </Authorize>
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
