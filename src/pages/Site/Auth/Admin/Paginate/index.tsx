import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  notification,
  Popconfirm,
  Row,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import Editor from '@/pages/Site/Auth/Admin/Editor';
import { doDelete, doEnable, doPaginate } from './service';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Basic/Authorize';
import Enable from '@/components/Basic/Enable';

const Paginate: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [search, setSearch] = useState<APISiteAuthAdmins.Search>({});
  const [editor, setEditor] = useState<APISiteAuthAdmins.Data | undefined>();
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APISiteAuthAdmins.Visible>({});
  const [data, setData] = useState<APISiteAuthAdmins.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});

  const toPaginate = () => {
    setLoadingPaginate(true);
    doPaginate(search)
      .then((response: APIResponse.Paginate<APISiteAuthAdmins.Data[]>) => {
        if (response.code === Constants.Success) {
          setPaginate({
            size: response.data.size,
            page: response.data.page,
            total: response.data.total,
          });
          setData(response.data.data || []);
        }
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onEnable = (record: APISiteAuthAdmins.Data) => {
    if (data) {
      const temp: APISiteAuthAdmins.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APISiteAuthAdmins.Data) => (item.loading_enable = true));
      setData(temp);
    }

    const enable: APIRequest.Enable = { id: record.id, is_enable: record.is_enable === 1 ? 2 : 1 };

    doEnable(enable)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({
            message: `${enable.is_enable === 1 ? '??????' : '??????'}?????????`,
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

  const onDelete = (record: APISiteAuthAdmins.Data) => {
    if (data) {
      const temp = [...data];
      Loop.ById(temp, record.id, (item: APISiteAuthAdmins.Data) => (item.loading_deleted = true));
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

  const onUpdate = (record: APISiteAuthAdmins.Data) => {
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
        title="????????????"
        extra={
          <Row gutter={10}>
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
            <Authorize permission="site.auth.admin.create">
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
          pagination={{
            current: paginate.page,
            pageSize: paginate.size,
            total: paginate.total,
            onChange: (page: number) => setSearch({ ...search, page }),
          }}
        >
          <Table.Column title="??????" dataIndex="nickname" />
          <Table.Column
            title="?????????"
            render={(record: APISiteAuthAdmins.Data) => (
              <span style={{ color: initialState?.settings?.primaryColor }}>{record.username}</span>
            )}
          />
          <Table.Column
            title="??????"
            render={(record: APISiteAuthAdmins.Data) =>
              record.roles?.map((item) => (
                <Tag key={item.id} color={initialState?.settings?.primaryColor}>
                  {item.name}
                </Tag>
              ))
            }
          />
          <Table.Column
            title="??????"
            align="center"
            render={(record: APISiteAuthAdmins.Data) => (
              <Authorize
                permission="site.auth.admin.enable"
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
            title="????????????"
            render={(record: APISiteAuthAdmins.Data) =>
              record.created_at && moment(record.created_at).format('YYYY/MM/DD')
            }
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APISiteAuthAdmins.Data) => (
              <>
                <Authorize permission="site.auth.admin.update">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    ??????
                  </Button>
                </Authorize>
                <Authorize permission="site.auth.admin.delete">
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
        <Editor visible={visible.editor} params={editor} onSave={onSuccess} onCancel={onCancel} />
      )}
    </>
  );
};

export default Paginate;
