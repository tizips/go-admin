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
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import Editor from '@/pages/Dormitory/Basic/Floor/Editor';
import { doDelete, doEnable, doList } from './service';
import { doBuildingByOnline } from '@/services/dormitory';
import Loop from '@/utils/Loop';

const List: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [editor, setEditor] = useState<APIBasicFloors.Data | undefined>();
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIBasicFloors.Visible>({});
  const [buildings, setBuildings] = useState<APIResponse.Online[]>([]);
  const [filter, setFilter] = useState<APIBasicFloors.Filter>({});
  const [data, setData] = useState<APIBasicFloors.Data[]>();

  const toBuildingsByOnline = () => {
    doBuildingByOnline({ is_public: 2 }).then(
      (response: APIResponse.Response<APIResponse.Online[]>) => {
        if (response.code == Constants.Success) {
          setBuildings(response.data || []);
          if (response.data) setFilter({ ...filter, building: response.data[0].id });
        }
      },
    );
  };

  const toList = () => {
    setLoadingPaginate(true);
    doList({ building: filter.building })
      .then((response: APIResponse.Response<APIBasicFloors.Data[]>) => {
        if (response.code === Constants.Success) {
          if (response.data)
            response.data.forEach((item) => (item.created_at = moment(item.created_at)));
          setData(response.data || []);
        }
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onDelete = (record: APIBasicFloors.Data) => {
    if (data) {
      const temp: APIBasicFloors.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIBasicFloors.Data) => (item.loading_deleted = true));
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '楼层删除成功！' });
          toList();
        }
      })
      .finally(() => {
        if (data) {
          const temp: APIBasicFloors.Data[] = [...data];
          Loop.ById(temp, record.id, (item: APIBasicFloors.Data) => (item.loading_deleted = false));
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIBasicFloors.Data) => {
    setEditor(record);
    setVisible({ ...visible, editor: true });
  };

  const onSuccess = () => {
    setVisible({ ...visible, editor: false });
    toList();
  };

  const onCancel = () => {
    setVisible({ ...visible, editor: false });
  };

  const onEnable = (record: APIBasicFloors.Data) => {
    if (data) {
      const temp: APIBasicFloors.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIBasicFloors.Data) => (item.loading_enable = true));
      setData(temp);
    }

    const enable: APIRequest.Enable = { id: record.id, is_enable: record.is_enable === 1 ? 2 : 1 };

    doEnable(enable)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({
            message: `楼层${enable.is_enable === 1 ? '启用' : '禁用'}成功！`,
          });
          if (data) {
            const temp = [...data];
            Loop.ById(
              temp,
              record.id,
              (item: APIBasicFloors.Data) => (item.is_enable = enable.is_enable),
            );
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          Loop.ById(temp, record.id, (item: APIBasicFloors.Data) => (item.loading_enable = false));
          setData(temp);
        }
      });
  };

  useEffect(() => {
    toList();
  }, [filter]);

  useEffect(() => {
    if (buildings.length <= 0) toBuildingsByOnline();
  }, []);

  return (
    <>
      <Card>
        <Tabs
          activeKey={`${filter.building}`}
          onChange={(building: any) => setFilter({ ...filter, building })}
          tabBarExtraContent={
            <Row gutter={10}>
              <Col>
                <Tooltip title="刷新">
                  <Button
                    type="primary"
                    icon={<RedoOutlined />}
                    onClick={toList}
                    loading={loadingPaginate}
                  />
                </Tooltip>
              </Col>
              {initialState?.permissions &&
              initialState?.permissions?.indexOf('dormitory.basic.floor.create') >= 0 ? (
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
          {buildings.map((item) => (
            <Tabs.TabPane key={item.id} tab={item.name} />
          ))}
        </Tabs>
        <Table dataSource={data} rowKey="id" loading={loadingPaginate} pagination={false}>
          <Table.Column title="名称" dataIndex="name" />
          <Table.Column title="楼栋" dataIndex="building" />
          <Table.Column
            title="公共区域"
            align="center"
            render={(record: APIBasicRooms.Data) => (
              <Tag color={record.is_public === 1 ? '#87d068' : '#f50'}>
                {record.is_public === 1 ? '是' : '否'}
              </Tag>
            )}
          />
          <Table.Column
            title="序号"
            align="center"
            render={(record: APIBasicFloors.Data) => (
              <Tag color={initialState?.settings?.primaryColor}>{record.order}</Tag>
            )}
          />
          <Table.Column
            title="启用"
            align="center"
            render={(record: APIBasicFloors.Data) => (
              <Switch
                size="small"
                checked={record.is_enable === 1}
                onClick={() => onEnable(record)}
                disabled={
                  initialState?.permissions &&
                  initialState?.permissions?.indexOf('dormitory.basic.floor.enable') < 0
                }
                loading={record.loading_enable}
              />
            )}
          />
          <Table.Column
            title="创建时间"
            align="center"
            render={(record: APIBasicFloors.Data) =>
              moment.isMoment(record.created_at) && record.created_at.format('YYYY/MM/DD')
            }
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APIBasicFloors.Data) => (
              <>
                {initialState?.permissions &&
                initialState?.permissions?.indexOf('dormitory.basic.floor.update') >= 0 ? (
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                ) : (
                  <></>
                )}
                {initialState?.permissions &&
                initialState?.permissions?.indexOf('dormitory.basic.floor.delete') >= 0 ? (
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
          building={filter.building}
          buildings={buildings}
          params={editor}
          onSave={onSuccess}
          onCancel={onCancel}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default List;
