import React, { useEffect, useState } from 'react';
import { Button, Card, notification, Popconfirm, Space, Switch, Table, Tag, Tooltip } from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import Editor from '@/pages/Site/Manage/Admin/Editor';
import { doDelete, doEnable, doPaginate } from './service';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Basic/Authorize';
import Enable from '@/components/Basic/Enable';

const Paginate: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [search, setSearch] = useState<APISiteManageAdmins.Search>({});
  const [editor, setEditor] = useState<APISiteManageAdmins.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APISiteManageAdmins.Visible>({});
  const [data, setData] = useState<APISiteManageAdmins.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});

  const toPaginate = () => {
    setLoad(true);
    doPaginate(search)
      .then((response: APIResponse.Paginate<APISiteManageAdmins.Data[]>) => {
        if (response.code === Constants.Success) {
          setPaginate({
            size: response.data.size,
            page: response.data.page,
            total: response.data.total,
          });
          setData(response.data.data || []);
        }
      })
      .finally(() => setLoad(false));
  };

  const onEnable = (record: APISiteManageAdmins.Data) => {
    if (data) {
      const temp: APISiteManageAdmins.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APISiteManageAdmins.Data) => (item.loading_enable = true));
      setData(temp);
    }

    const enable: APIRequest.Enable = { id: record.id, is_enable: record.is_enable === 1 ? 2 : 1 };

    doEnable(enable)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({
            message: `${enable.is_enable === 1 ? '启用' : '禁用'}成功！`,
          });
          if (data) {
            const temp = [...data];
            Loop.ById(temp, record.id, (item) => (item.is_enable = enable.is_enable));
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          Loop.ById(temp, record.id, (item) => (item.loading_enable = false));
          setData(temp);
        }
      });
  };

  const onDelete = (record: APISiteManageAdmins.Data) => {
    if (data) {
      const temp = [...data];
      Loop.ById(temp, record.id, (item: APISiteManageAdmins.Data) => (item.loading_deleted = true));
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

  const onUpdate = (record: APISiteManageAdmins.Data) => {
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
        title="账号列表"
        extra={
          <Space size={[10, 10]} wrap>
            <Tooltip title="刷新">
              <Button type="primary" icon={<RedoOutlined />} onClick={toPaginate} loading={load} />
            </Tooltip>
            <Authorize permission="site.manage.admin.create">
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
          <Table.Column title="名称" dataIndex="nickname" />
          <Table.Column
            title="登陆名"
            render={(record: APISiteManageAdmins.Data) => (
              <span style={{ color: initialState?.settings?.primaryColor }}>{record.username}</span>
            )}
          />
          <Table.Column
            title="角色"
            render={(record: APISiteManageAdmins.Data) =>
              record.roles?.map((item) => (
                <Tag key={item.id} color={initialState?.settings?.primaryColor}>
                  {item.name}
                </Tag>
              ))
            }
          />
          <Table.Column
            title="启用"
            align="center"
            render={(record: APISiteManageAdmins.Data) => (
              <Authorize
                permission="site.manage.admin.enable"
                fallback={<Enable is_enable={record.is_enable} />}
              >
                <Switch
                  size="small"
                  checked={record.is_enable === 1}
                  onClick={() => onEnable(record)}
                  loading={record.loading_enable}
                />
              </Authorize>
            )}
          />
          <Table.Column
            title="创建时间"
            render={(record: APISiteManageAdmins.Data) =>
              record.created_at && moment(record.created_at).format('YYYY/MM/DD')
            }
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APISiteManageAdmins.Data) => (
              <>
                <Authorize permission="site.manage.admin.update">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                </Authorize>
                <Authorize permission="site.manage.admin.delete">
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
