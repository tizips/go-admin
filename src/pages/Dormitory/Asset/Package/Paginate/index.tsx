import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Input, notification, Popconfirm, Row, Table, Tag, Tooltip } from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import Create from '@/pages/Dormitory/Asset/Package/Create';
import { doDelete, doPaginate } from './service';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Basic/Authorize';

const Paginate: React.FC = () => {
  const [editor, setEditor] = useState<APIDormitoryAssetPackages.Data | undefined>();
  const [search, setSearch] = useState<APIDormitoryAssetPackages.Search>({});
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIDormitoryAssetPackages.Visible>({});
  const [data, setData] = useState<APIDormitoryAssetPackages.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});

  const toPaginate = () => {
    setLoadingPaginate(true);
    doPaginate(search)
      .then((response: APIResponse.Paginate<APIDormitoryAssetPackages.Data[]>) => {
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

  const onDelete = (record: APIDormitoryAssetPackages.Data) => {
    if (data) {
      const temp: APIDormitoryAssetPackages.Data[] = [...data];
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
          const temp: APIDormitoryAssetPackages.Data[] = [...data];
          Loop.ById(temp, record.id, (item) => (item.loading_deleted = false));
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, create: true });
  };

  const onUpdate = (record: APIDormitoryAssetPackages.Data) => {
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

  return (
    <>
      <Card
        title="打包列表"
        extra={
          <Row gutter={[10, 10]} justify="end">
            <Col>
              <Input.Search
                allowClear
                enterButton
                onSearch={(keyword) => setSearch({ ...search, keyword, page: undefined })}
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
            <Authorize permission="dormitory.asset.package.create">
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
          pagination={{
            pageSize: paginate.size,
            current: paginate.page,
            total: paginate.total,
            showSizeChanger: false,
            onChange: (page) => setSearch({ ...search, page }),
          }}
        >
          <Table.Column title="名称" dataIndex="name" />
          <Table.Column
            title="设备"
            render={(record: APIDormitoryAssetPackages.Data) =>
              record.devices?.map((item) => (
                <Tag key={item.id} color="green">
                  {item.name} * {item.number}
                </Tag>
              ))
            }
          />
          <Table.Column
            title="创建时间"
            render={(record: APIDormitoryAssetPackages.Data) =>
              record.created_at && moment(record.created_at).format('YYYY/MM/DD')
            }
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APIDormitoryAssetPackages.Data) => (
              <>
                <Authorize permission="dormitory.asset.package.update">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    修改
                  </Button>
                </Authorize>
                <Authorize permission="dormitory.asset.package.delete">
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
