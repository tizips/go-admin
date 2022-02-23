import React, { useEffect, useState } from 'react';
import { Button, Card, Col, notification, Popconfirm, Row, Switch, Table, Tag, Tooltip } from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import Editor from '@/pages/Site/Auth/Admin/Editor';
import { doDelete, doEnable, doPaginate } from './service';
import Loop from '@/utils/Loop';

const Paginate: React.FC = () => {

  const { initialState } = useModel('@@initialState');

  const [search, setSearch] = useState<APIAuthAdmins.Search>({});
  const [editor, setEditor] = useState<APIAuthAdmins.Data | undefined>();
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIAuthAdmins.Visible>({});
  const [data, setData] = useState<APIAuthAdmins.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});

  const toPaginate = () => {
    setLoadingPaginate(true);
    doPaginate(search)
      .then((response: APIResponse.Paginate<APIAuthAdmins.Data[]>) => {
        if (response.code === Constants.Success) {
          setPaginate({ size: response.data.size, page: response.data.page, total: response.data.total });
          if (response.data.data) response.data.data.forEach(item => item.created_at = moment(item.created_at));
          setData(response.data.data);
        }
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onEnable = (record: APIAuthAdmins.Data) => {
    if (data) {
      const temp: APIAuthAdmins.Data[] = [...data];
      Loop.byId(temp, record.id, (item: APIAuthAdmins.Data) => item.loading_enable = true);
      setData(temp);
    }

    const enable: APIRequest.Enable = { id: record.id, is_enable: record.is_enable === 1 ? 0 : 1 };

    doEnable(enable)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: `账号${enable.is_enable === 1 ? '启用' : '禁用'}成功！` });
          if (data) {
            const temp = [...data];
            Loop.byId(temp, record.id, (item: APIAuthAdmins.Data) => item.is_enable = enable.is_enable);
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          Loop.byId(temp, record.id, (item: APIAuthAdmins.Data) => item.loading_enable = false);
          setData(temp);
        }
      });
  };

  const onDelete = (record: APIAuthAdmins.Data) => {
    // @ts-ignore
    let temp: APIAuthAdmins.Data[] = [...data];
    Loop.byId(temp, record.id, (item: APIAuthAdmins.Data) => item.loading_deleted = true);
    setData(temp);

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '账号删除成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        temp = [...data];
        Loop.byId(temp, record.id, (item: APIAuthAdmins.Data) => item.loading_deleted = false);
        setData(temp);
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIAuthAdmins.Data) => {
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
      <Card title='账号列表' extra={<Row gutter={10}>
        <Col>
          <Tooltip title='刷新'>
            <Button type='primary' icon={<RedoOutlined />} onClick={toPaginate} loading={loadingPaginate} />
          </Tooltip>
        </Col>
        {
          initialState?.permissions && initialState?.permissions?.indexOf('site.auth.admin.create') >= 0 ?
            <Col>
              <Tooltip title='创建'>
                <Button type='primary' icon={<FormOutlined />} onClick={onCreate} />
              </Tooltip>
            </Col> : <></>
        }
      </Row>}>
        <Table dataSource={data} rowKey='id'
               loading={loadingPaginate}
               pagination={{
                 current: paginate.page,
                 pageSize: paginate.size,
                 total: paginate.total,
                 onChange: (page: number) => setSearch({ ...search, page }),
               }}>
          <Table.Column title='名称' dataIndex='nickname' />
          <Table.Column title='登陆名' render={(record: APIAuthAdmins.Data) => (
            <span style={{ color: initialState?.settings?.primaryColor }}>
              {record.username}
            </span>
          )} />
          <Table.Column title='角色' render={(record: APIAuthAdmins.Data) => (
            record.roles?.map(item => <Tag key={item.id} color={initialState?.settings?.primaryColor}>{item.name}</Tag>)
          )} />
          <Table.Column title='启用' align='center' render={(record: APIAuthAdmins.Data) => (
            <Switch size='small' checked={record.is_enable === 1} onClick={() => onEnable(record)}
                    disabled={initialState?.permissions && initialState?.permissions?.indexOf('site.auth.admin.enable') < 0}
                    loading={record.loading_enable} />
          )} />
          <Table.Column title='创建时间' render={(record: APIAuthAdmins.Data) => (
            moment.isMoment(record.created_at) && record.created_at.format('YYYY/MM/DD HH:mm')
          )} />
          <Table.Column align='center' width={100} render={(record: APIAuthAdmins.Data) => (
            <>
              {
                initialState?.permissions && initialState?.permissions?.indexOf('site.auth.admin.update') >= 0 ?
                  <Button type='link' onClick={() => onUpdate(record)}>编辑</Button>
                  : <></>
              }
              {
                initialState?.permissions && initialState?.permissions?.indexOf('site.auth.admin.delete') >= 0 ?
                  <Popconfirm
                    title='确定要删除该数据?'
                    placement='leftTop'
                    onConfirm={() => onDelete(record)}
                  >
                    <Button type='link' danger loading={record.loading_deleted}>删除</Button>
                  </Popconfirm> : <></>
              }
            </>
          )} />
        </Table>
      </Card>
      {
        visible.editor != undefined ?
          <Editor visible={visible.editor} params={editor} onSave={onSuccess} onCancel={onCancel} /> : <></>
      }
    </>
  );
};

export default Paginate;