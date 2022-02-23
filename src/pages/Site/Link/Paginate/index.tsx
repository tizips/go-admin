import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Dropdown, Menu, notification, Popconfirm, Row, Switch, Table, Tag, Tooltip } from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, MoreOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import Editor from '@/pages/Site/Link/Editor';
import { doDelete, doEnable, doPaginate } from './service';
import Loop from '@/utils/Loop';

const Paginate: React.FC = () => {

  const { initialState } = useModel('@@initialState');

  const [editor, setEditor] = useState<APISiteLinks.Data | undefined>();
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APISiteLinks.Visible>({});
  const [data, setData] = useState<APISiteLinks.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});

  const toPaginate = () => {
    setLoadingPaginate(true);
    doPaginate()
      .then((response: APIResponse.Paginate<APISiteLinks.Data[]>) => {
        if (response.code === Constants.Success) {
          setPaginate({ size: response.data.size, page: response.data.page, total: response.data.total });
          if (response.data.data) response.data.data.forEach(item => item.created_at = moment(item.created_at));
          setData(response.data.data);
        }
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onDelete = (record: APISiteLinks.Data) => {
    if (data) {
      const temp: APISiteLinks.Data[] = [...data];
      Loop.byId(temp, record.id, (item: APISiteLinks.Data) => item.loading_deleted = true);
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '文章删除成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        if (data) {
          const temp: APISiteLinks.Data[] = [...data];
          Loop.byId(temp, record.id, (item: APISiteLinks.Data) => item.loading_deleted = false);
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APISiteLinks.Data) => {
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

  const onEnable = (record: APISiteLinks.Data) => {
    if (data) {
      const temp: APISiteLinks.Data[] = [...data];
      Loop.byId(temp, record.id, (item: APISiteLinks.Data) => item.loading_enable = true);
      setData(temp);
    }

    const enable: APIRequest.Enable = { id: record.id, enable: record.is_enable === 1 ? 0 : 1 };

    doEnable(enable)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: `文章${enable.enable === 1 ? '启用' : '禁用'}成功！` });
          if (data) {
            const temp = [...data];
            Loop.byId(temp, record.id, (item: APISiteLinks.Data) => item.is_enable = enable.enable);
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          Loop.byId(temp, record.id, (item: APISiteLinks.Data) => item.loading_enable = false);
          setData(temp);
        }
      });
  };

  useEffect(() => {
    toPaginate();
  }, []);

  return (
    <>
      <Card title='友链列表' extra={<Row gutter={10}>
        <Col>
          <Tooltip title='刷新'>
            <Button type='primary' icon={<RedoOutlined />} onClick={toPaginate} loading={loadingPaginate} />
          </Tooltip>
        </Col>
        {
          initialState?.permissions && initialState?.permissions?.indexOf('site.link.create') >= 0 ?
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
               }}>
          <Table.Column title='名称' render={(record: APISiteLinks.Data) => (
            <Button type='link' target='_blank' href={record.uri}>{record.name}</Button>
          )} />
          <Table.Column title='简介' dataIndex='summary' ellipsis />
          <Table.Column title='序号' render={(record: APISiteLinks.Data) => (
            <Tag color={initialState?.settings?.primaryColor}>{record.no}</Tag>
          )} />
          <Table.Column title='启用' align='center' render={(record: APISiteLinks.Data) => (
            <Switch size='small' checked={record.is_enable === 1} onClick={() => onEnable(record)}
                    disabled={initialState?.permissions && initialState?.permissions?.indexOf('site.link.enable') < 0}
                    loading={record.loading_enable} />
          )} />
          <Table.Column title='创建时间' render={(record: APISiteLinks.Data) => (
            moment.isMoment(record.created_at) && record.created_at.format('YYYY/MM/DD')
          )} />
          {
            initialState?.permissions && initialState?.permissions?.indexOf('site.link.update') >= 0 ||
            initialState?.permissions && initialState?.permissions?.indexOf('site.link.delete') >= 0 ?
              <Table.Column title='操作' align='center' width={100} render={(record: APISiteLinks.Data) => (
                <Dropdown overlay={<Menu>
                  {
                    initialState?.permissions && initialState?.permissions?.indexOf('site.link.update') >= 0 ?
                      <Menu.Item key='update'>
                        <Button type='link' onClick={() => onUpdate(record)}>编辑</Button>
                      </Menu.Item> : <></>
                  }
                  {
                    initialState?.permissions && initialState?.permissions?.indexOf('site.link.delete') >= 0 ?
                      <Menu.Item key='create'>
                        <Popconfirm
                          title='确定要删除该数据?'
                          placement='leftTop'
                          onConfirm={() => onDelete(record)}
                        >
                          <Button type='link' danger loading={record.loading_deleted}>删除</Button>
                        </Popconfirm>
                      </Menu.Item> : <></>
                  }
                </Menu>}>
                  <Button type='link' icon={<MoreOutlined />} />
                </Dropdown>
              )} /> : <></>
          }
        </Table>
      </Card>
      {
        initialState?.permissions && initialState?.permissions?.indexOf('site.link.create') >= 0 ||
        initialState?.permissions && initialState?.permissions?.indexOf('site.link.update') >= 0 ?
          <Editor visible={visible.editor} params={editor} onSave={onSuccess}
                  onCancel={onCancel} /> : <></>
      }
    </>
  );
};

export default Paginate;