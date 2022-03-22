import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Input, notification, Popconfirm, Row, Table, Tag, Tooltip } from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import Create from '@/pages/Dormitory/Asset/Package/Create';
import { doDelete, doPaginate } from './service';
import Loop from '@/utils/Loop';

const Paginate: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [editor, setEditor] = useState<APIAssetPackages.Data | undefined>();
  const [search, setSearch] = useState<APIAssetPackages.Search>({});
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIAssetPackages.Visible>({});
  const [data, setData] = useState<APIAssetPackages.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});

  const toPaginate = () => {
    setLoadingPaginate(true);
    doPaginate(search)
      .then((response: APIResponse.Paginate<APIAssetPackages.Data[]>) => {
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

  const onDelete = (record: APIAssetPackages.Data) => {
    if (data) {
      const temp: APIAssetPackages.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIAssetPackages.Data) => (item.loading_deleted = true));
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
          const temp: APIAssetPackages.Data[] = [...data];
          Loop.ById(
            temp,
            record.id,
            (item: APIAssetPackages.Data) => (item.loading_deleted = false),
          );
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, create: true });
  };

  const onUpdate = (record: APIAssetPackages.Data) => {
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
            {initialState?.permissions &&
            initialState?.permissions?.indexOf('dormitory.asset.package.create') >= 0 ? (
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
          <Table.Column
            title="设备"
            render={(record: APIAssetPackages.Data) => (
              <>
                {record.devices?.map((item) => (
                  <Tag key={item.id} color="green">
                    {item.name} * {item.number}
                  </Tag>
                ))}
              </>
            )}
          />
          <Table.Column
            title="创建时间"
            render={(record: APIAssetPackages.Data) =>
              record.created_at && moment(record.created_at).format('YYYY/MM/DD')
            }
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APIAssetPackages.Data) => (
              <>
                {initialState?.permissions &&
                initialState?.permissions?.indexOf('dormitory.asset.package.update') >= 0 ? (
                  <Button type="link" onClick={() => onUpdate(record)}>
                    修改
                  </Button>
                ) : (
                  <></>
                )}
                {initialState?.permissions &&
                initialState?.permissions?.indexOf('dormitory.asset.package.delete') >= 0 ? (
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
      {visible.create != undefined ? (
        <Create visible={visible.create} params={editor} onCreate={onSuccess} onCancel={onCancel} />
      ) : (
        <></>
      )}
    </>
  );
};

export default Paginate;
