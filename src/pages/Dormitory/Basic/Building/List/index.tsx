import React, { useEffect, useState } from 'react';
import { Button, Card, Col, notification, Popconfirm, Row, Switch, Table, Tag, Tooltip } from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import Editor from '@/pages/Dormitory/Basic/Building/Editor';
import { doDelete, doEnable, doList } from './service';
import Loop from '@/utils/Loop';

const List: React.FC = () => {

  const { initialState } = useModel('@@initialState');

  const [editor, setEditor] = useState<APIBasicBuildings.Data | undefined>();
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIBasicBuildings.Visible>({});
  const [data, setData] = useState<APIBasicBuildings.Data[]>();

  const toPaginate = () => {
    setLoadingPaginate(true);
    doList()
      .then((response: APIResponse.Response<APIBasicBuildings.Data[]>) => {
        if (response.code === Constants.Success) {
          if (response.data) response.data.forEach(item => item.created_at = moment(item.created_at));
          setData(response.data || []);
        }
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onDelete = (record: APIBasicBuildings.Data) => {
    if (data) {
      const temp: APIBasicBuildings.Data[] = [...data];
      Loop.byId(temp, record.id, (item: APIBasicBuildings.Data) => item.loading_deleted = true);
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '楼栋删除成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        if (data) {
          const temp: APIBasicBuildings.Data[] = [...data];
          Loop.byId(temp, record.id, (item: APIBasicBuildings.Data) => item.loading_deleted = false);
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIBasicBuildings.Data) => {
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

  const onEnable = (record: APIBasicBuildings.Data) => {
    if (data) {
      const temp: APIBasicBuildings.Data[] = [...data];
      Loop.byId(temp, record.id, (item: APIBasicBuildings.Data) => item.loading_enable = true);
      setData(temp);
    }

    const enable: APIRequest.Enable = { id: record.id, is_enable: record.is_enable === 1 ? 0 : 1 };

    doEnable(enable)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: `楼栋${enable.is_enable === 1 ? '启用' : '禁用'}成功！` });
          if (data) {
            const temp = [...data];
            Loop.byId(temp, record.id, (item: APIBasicBuildings.Data) => item.is_enable = enable.is_enable);
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          Loop.byId(temp, record.id, (item: APIBasicBuildings.Data) => item.loading_enable = false);
          setData(temp);
        }
      });
  };

  useEffect(() => {
    toPaginate();
  }, []);

  return (
    <>
      <Card title='楼栋列表' extra={<Row gutter={10}>
        <Col>
          <Tooltip title='刷新'>
            <Button type='primary' icon={<RedoOutlined />} onClick={toPaginate} loading={loadingPaginate} />
          </Tooltip>
        </Col>
        {
          initialState?.permissions && initialState?.permissions?.indexOf('dormitory.basic.building.create') >= 0 ?
            <Col>
              <Tooltip title='创建'>
                <Button type='primary' icon={<FormOutlined />} onClick={onCreate} />
              </Tooltip>
            </Col> : <></>
        }
      </Row>}>
        <Table dataSource={data} rowKey='id' loading={loadingPaginate} pagination={false}>
          <Table.Column title='名称' dataIndex='name' />
          <Table.Column title='序号' render={(record: APIBasicBuildings.Data) => (
            <Tag color={initialState?.settings?.primaryColor}>{record.order}</Tag>
          )} />
          <Table.Column title='启用' align='center' render={(record: APIBasicBuildings.Data) => (
            <Switch size='small' checked={record.is_enable === 1} onClick={() => onEnable(record)}
                    disabled={initialState?.permissions && initialState?.permissions?.indexOf('dormitory.basic.building.enable') < 0}
                    loading={record.loading_enable} />
          )} />
          <Table.Column title='创建时间' render={(record: APIBasicBuildings.Data) => (
            moment.isMoment(record.created_at) && record.created_at.format('YYYY/MM/DD')
          )} />
          <Table.Column align='center' width={100} render={(record: APIBasicBuildings.Data) => (
            <>
              {
                initialState?.permissions && initialState?.permissions?.indexOf('dormitory.basic.building.update') >= 0 ?
                  <Button type='link' onClick={() => onUpdate(record)}>编辑</Button> : <></>
              }
              {
                initialState?.permissions && initialState?.permissions?.indexOf('dormitory.basic.building.delete') >= 0 ?
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

export default List;