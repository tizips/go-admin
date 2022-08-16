import React, { useEffect, useState } from 'react';
import { Button, Card, notification, Popconfirm, Space, Table, Tooltip } from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import Editor from '@/pages/Site/Manage/Role/Editor';
import { doDelete, doPaginate } from './service';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Basic/Authorize';

const Paginate: React.FC = () => {
  const [search, setSearch] = useState<APISiteManageRoles.Search>({});
  const [editor, setEditor] = useState<APISiteManageRoles.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APISiteManageRoles.Visible>({});
  const [data, setData] = useState<APISiteManageRoles.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});

  const toPaginate = () => {
    setLoad(true);
    doPaginate(search)
      .then((response: APIResponse.Paginate<APISiteManageRoles.Data[]>) => {
        if (response.code === Constants.Success) {
          setPaginate({
            size: response.data.size,
            page: response.data.page,
            total: response.data.total,
          });
          setData(response.data.data);
        }
      })
      .finally(() => setLoad(false));
  };

  const onDelete = (record: APISiteManageRoles.Data) => {
    if (data) {
      const temp: APISiteManageRoles.Data[] = [...data];
      Loop.ById(temp, record.id, (item) => (item.loading_deleted = true));
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '角色删除成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          Loop.ById(temp, record.id, (item) => (item.loading_deleted = false));
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APISiteManageRoles.Data) => {
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

  useEffect(() => {
    toPaginate();
  }, [search]);

  return (
    <>
      <Card
        title="角色列表"
        extra={
          <Space size={[10, 10]} wrap>
            <Tooltip title="刷新">
              <Button type="primary" icon={<RedoOutlined />} onClick={toPaginate} loading={load} />
            </Tooltip>
            <Authorize permission="site.manage.role.create">
              <Tooltip title="创建">
                <Button type="primary" icon={<FormOutlined />} onClick={onCreate} />
              </Tooltip>
            </Authorize>
          </Space>
        }
      >
        <Table
          dataSource={data}
          rowKey="id"
          loading={load}
          pagination={{
            current: paginate.page,
            pageSize: paginate.size,
            total: paginate.total,
            onChange: (page: number) => setSearch({ ...search, page }),
          }}
        >
          <Table.Column title="名称" dataIndex="name" />
          <Table.Column title="简介" dataIndex="summary" />
          <Table.Column
            title="创建时间"
            render={(record: APISiteManageRoles.Data) =>
              record.created_at && moment(record.created_at).format('YYYY/MM/DD')
            }
          />
          <Table.Column
            title="操作"
            align="center"
            width={100}
            render={(record: APISiteManageRoles.Data) => (
              <>
                <Authorize permission="site.manage.role.update">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                </Authorize>
                <Authorize permission="site.manage.role.delete">
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
      {visible.editor != undefined && (
        <Editor visible={visible.editor} params={editor} onSave={onSuccess} onCancel={onCancel} />
      )}
    </>
  );
};

export default Paginate;
