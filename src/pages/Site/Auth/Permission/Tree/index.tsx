import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
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
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import Editor from '@/pages/Site/Auth/Permission/Editor';
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

  const [editor, setEditor] = useState<APIAuthPermissions.Data | undefined>();
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIAuthPermissions.Visible>({});
  const [data, setData] = useState<APIAuthPermissions.Data[]>();
  const [modules, setModules] = useState<APISite.Module[]>([]);
  const [loading, setLoading] = useState<APIAuthPermissions.Loading>({});
  const [active, setActive] = useState<APIAuthPermissions.Active>({});

  const doLoop = (
    items: APIAuthPermissions.Data[],
    callback: (item: APIAuthPermissions.Data) => void,
  ) => {
    for (const temp of items) {
      callback(temp);
      if (temp.children) doLoop(temp.children, callback);
    }
  };

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
    setLoadingPaginate(true);
    doTree(active.module)
      .then((response: APIResponse.Response<APIAuthPermissions.Data[]>) => {
        if (response.code === Constants.Success) {
          const temp: APIAuthPermissions.Data[] = response.data;
          doLoop(temp, (item) => (item.created_at = moment(item.created_at)));
          setData(temp);
        }
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onDelete = (record: APIAuthPermissions.Data) => {
    // @ts-ignore
    let temp: APIAuthPermissions.Data[] = [...data];
    Loop.ById(temp, record.id, (item: APIAuthPermissions.Data) => (item.loading_deleted = true));
    setData(temp);

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '权限删除成功！' });
          toTree();
        }
      })
      .finally(() => {
        temp = [...data];
        Loop.ById(
          temp,
          record.id,
          (item: APIAuthPermissions.Data) => (item.loading_deleted = false),
        );
        setData(temp);
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIAuthPermissions.Data) => {
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
          <Row gutter={10}>
            <Col>
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
            </Col>
            <Col>
              <Tooltip title="刷新">
                <Button
                  type="primary"
                  icon={<RedoOutlined />}
                  onClick={toTree}
                  loading={loadingPaginate}
                />
              </Tooltip>
            </Col>
            {initialState?.permissions &&
            initialState?.permissions?.indexOf('site.auth.permission.create') >= 0 ? (
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
          size="small"
          loading={loadingPaginate}
          pagination={false}
        >
          <Table.Column title="名称" dataIndex="name" />
          <Table.Column
            title="标识"
            render={(record: APIAuthPermissions.Data) => (
              <span className={styles.slug} style={{ color: initialState?.settings?.primaryColor }}>
                {record.slug}
              </span>
            )}
          />
          <Table.Column
            title="接口"
            align="right"
            render={(record: APIAuthPermissions.Data) =>
              record.method ? (
                <Tag color={record.method && methods ? methods[record.method] : '#2db7f5'}>
                  {record.method?.toUpperCase()}
                </Tag>
              ) : (
                <></>
              )
            }
          />
          <Table.Column
            render={(record: APIAuthPermissions.Data) =>
              record.path ? (
                <Tag
                  className={styles.path}
                  style={{ color: initialState?.settings?.primaryColor }}
                >
                  {record.path}
                </Tag>
              ) : (
                <></>
              )
            }
          />
          <Table.Column
            title="操作"
            align="center"
            width={100}
            render={(record: APIAuthPermissions.Data) => (
              <>
                {initialState?.permissions &&
                initialState?.permissions?.indexOf('site.auth.permission.update') >= 0 ? (
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                ) : (
                  <></>
                )}
                {initialState?.permissions &&
                initialState?.permissions?.indexOf('site.auth.permission.delete') >= 0 &&
                !record.children ? (
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
      {visible.editor != undefined ? (
        <Editor
          visible={visible.editor}
          params={editor}
          methods={methods}
          module={active.module}
          onSave={onSuccess}
          onCancel={onCancel}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Tree;
