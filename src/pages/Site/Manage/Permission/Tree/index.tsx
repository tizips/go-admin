import React, { useEffect, useState } from 'react';
import { Button, Card, notification, Popconfirm, Select, Space, Table, Tag, Tooltip } from 'antd';
import Constants from '@/utils/Constants';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import Authorize from '@/components/Basic/Authorize';
import Editor from '@/pages/Site/Manage/Permission/Editor';
import { doDelete, doTree } from './service';
import Loop from '@/utils/Loop';
import { doModuleByOnline } from '@/services/site';

import styles from './index.less';

const methods = {
  GET: '#87d068',
  POST: '#2db7f5',
  PUT: '#6F2CF2',
  DELETE: '#f50',
};

const Tree: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [editor, setEditor] = useState<APISiteManagePermissions.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APISiteManagePermissions.Visible>({});
  const [data, setData] = useState<APISiteManagePermissions.Data[]>();
  const [modules, setModules] = useState<APISite.Module[]>([]);
  const [loading, setLoading] = useState<APISiteManagePermissions.Loading>({});
  const [active, setActive] = useState<APISiteManagePermissions.Active>({});

  const toModules = () => {
    setLoading({ ...loading, module: true });
    doModuleByOnline()
      .then((response: APIResponse.Response<any[]>) => {
        if (response.code === Constants.Success) {
          setModules(response.data);
          if (response.data.length > 0) setActive({ ...active, module: response.data[0].id });
        }
      })
      .finally(() => setLoading({ ...loading, module: false }));
  };

  const toTree = () => {
    setLoad(true);
    doTree(active.module)
      .then((response: APIResponse.Response<APISiteManagePermissions.Data[]>) => {
        if (response.code === Constants.Success) setData(response.data);
      })
      .finally(() => setLoad(false));
  };

  const onDelete = (record: APISiteManagePermissions.Data) => {
    if (data) {
      const temp = [...data];
      Loop.ById(temp, record.id, (item) => (item.loading_deleted = true));
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '删除成功！' });
          toTree();
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

  const onUpdate = (record: APISiteManagePermissions.Data) => {
    setEditor(record);
    setVisible({ ...visible, editor: true });
  };

  const onSuccess = () => {
    setVisible({ ...visible, editor: false });
    toTree();
  };

  const onCancel = () => {
    setVisible({ ...visible, editor: false });
  };

  useEffect(() => {
    if (active.module) toTree();
  }, [active.module]);

  useEffect(() => {
    if (modules.length <= 0) toModules();
  }, []);

  return (
    <>
      <Card
        title="权限列表"
        extra={
          <Space size={[10, 10]} wrap>
            <Select
              value={active.module}
              placeholder="模块"
              onChange={(value: number) => setActive({ ...active, module: value })}
            >
              {modules.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
            <Tooltip title="刷新">
              <Button type="primary" icon={<RedoOutlined />} onClick={toTree} loading={load} />
            </Tooltip>
            <Authorize permission="site.manage.permission.create">
              <Tooltip title="创建">
                <Button type="primary" icon={<FormOutlined />} onClick={onCreate} />
              </Tooltip>
            </Authorize>
          </Space>
        }
      >
        <Table dataSource={data} rowKey="id" size="small" loading={load} pagination={false}>
          <Table.Column title="名称" dataIndex="name" />
          <Table.Column
            title="标识"
            render={(record: APISiteManagePermissions.Data) => (
              <span style={{ color: initialState?.settings?.primaryColor }}>{record.slug}</span>
            )}
          />
          <Table.Column
            title="接口"
            align="right"
            render={(record: APISiteManagePermissions.Data) =>
              record.method && (
                <Tag color={record.method && methods ? methods[record.method] : '#2db7f5'}>
                  {record.method?.toUpperCase()}
                </Tag>
              )
            }
          />
          <Table.Column
            render={(record: APISiteManagePermissions.Data) =>
              record.path && (
                <Tag
                  className={styles.path}
                  style={{ color: initialState?.settings?.primaryColor }}
                >
                  {record.path}
                </Tag>
              )
            }
          />
          <Table.Column
            title="操作"
            align="center"
            width={100}
            render={(record: APISiteManagePermissions.Data) => (
              <>
                <Authorize permission="site.manage.permission.update">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                </Authorize>
                <Authorize permission="site.manage.permission.delete">
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
        <Editor
          visible={visible.editor}
          params={editor}
          methods={methods}
          module={active.module}
          onSave={onSuccess}
          onCancel={onCancel}
        />
      )}
    </>
  );
};

export default Tree;
