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
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import Authorize from '@/components/Basic/Authorize';
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

  const [editor, setEditor] = useState<APISiteAuthPermissions.Data | undefined>();
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APISiteAuthPermissions.Visible>({});
  const [data, setData] = useState<APISiteAuthPermissions.Data[]>();
  const [modules, setModules] = useState<APISite.Module[]>([]);
  const [loading, setLoading] = useState<APISiteAuthPermissions.Loading>({});
  const [active, setActive] = useState<APISiteAuthPermissions.Active>({});

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
      .then((response: APIResponse.Response<APISiteAuthPermissions.Data[]>) => {
        if (response.code === Constants.Success) setData(response.data);
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onDelete = (record: APISiteAuthPermissions.Data) => {
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
          notification.success({ message: '???????????????' });
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

  const onUpdate = (record: APISiteAuthPermissions.Data) => {
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
        title="????????????"
        extra={
          <Row gutter={10}>
            <Col>
              <Select
                value={active.module}
                placeholder="??????"
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
              <Tooltip title="??????">
                <Button
                  type="primary"
                  icon={<RedoOutlined />}
                  onClick={toTree}
                  loading={loadingPaginate}
                />
              </Tooltip>
            </Col>
            <Authorize permission="site.auth.permission.create">
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
          size="small"
          loading={loadingPaginate}
          pagination={false}
        >
          <Table.Column title="??????" dataIndex="name" />
          <Table.Column
            title="??????"
            render={(record: APISiteAuthPermissions.Data) => (
              <span style={{ color: initialState?.settings?.primaryColor }}>{record.slug}</span>
            )}
          />
          <Table.Column
            title="??????"
            align="right"
            render={(record: APISiteAuthPermissions.Data) =>
              record.method && (
                <Tag color={record.method && methods ? methods[record.method] : '#2db7f5'}>
                  {record.method?.toUpperCase()}
                </Tag>
              )
            }
          />
          <Table.Column
            render={(record: APISiteAuthPermissions.Data) =>
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
            title="??????"
            align="center"
            width={100}
            render={(record: APISiteAuthPermissions.Data) => (
              <>
                <Authorize permission="site.auth.permission.update">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    ??????
                  </Button>
                </Authorize>
                <Authorize permission="site.auth.permission.delete">
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
