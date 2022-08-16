import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  notification,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import Editor from '@/pages/Dormitory/Basic/Floor/Editor';
import { doDelete, doEnable, doList } from './service';
import { doBuildingByOnline } from '@/services/dormitory';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Basic/Authorize';
import Enable from '@/components/Basic/Enable';

const List: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [editor, setEditor] = useState<APIDormitoryBasicFloors.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APIDormitoryBasicFloors.Visible>({});
  const [buildings, setBuildings] = useState<APIData.Online[]>([]);
  const [filter, setFilter] = useState<APIDormitoryBasicFloors.Filter>({});
  const [data, setData] = useState<APIDormitoryBasicFloors.Data[]>();

  const toBuildingsByOnline = () => {
    doBuildingByOnline({ is_public: 2 }).then(
      (response: APIResponse.Response<APIData.Online[]>) => {
        if (response.code == Constants.Success) {
          setBuildings(response.data || []);
          if (response.data) setFilter({ ...filter, building: response.data[0].id });
        }
      },
    );
  };

  const toList = () => {
    setLoad(true);
    doList({ building: filter.building })
      .then((response: APIResponse.Response<APIDormitoryBasicFloors.Data[]>) => {
        if (response.code === Constants.Success) setData(response.data || []);
      })
      .finally(() => setLoad(false));
  };

  const onDelete = (record: APIDormitoryBasicFloors.Data) => {
    if (data) {
      const temp: APIDormitoryBasicFloors.Data[] = [...data];
      Loop.ById(temp, record.id, (item) => (item.loading_deleted = true));
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '删除成功！' });
          toList();
        }
      })
      .finally(() => {
        if (data) {
          const temp: APIDormitoryBasicFloors.Data[] = [...data];
          Loop.ById(temp, record.id, (item) => (item.loading_deleted = false));
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIDormitoryBasicFloors.Data) => {
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

  const onEnable = (record: APIDormitoryBasicFloors.Data) => {
    if (data) {
      const temp: APIDormitoryBasicFloors.Data[] = [...data];
      Loop.ById(temp, record.id, (item) => (item.loading_enable = true));
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
            <Space size={[10, 10]} wrap>
              <Tooltip title="刷新">
                <Button type="primary" icon={<RedoOutlined />} onClick={toList} loading={load} />
              </Tooltip>
              <Authorize permission="dormitory.basic.floor.create">
                <Tooltip title="创建">
                  <Button type="primary" icon={<FormOutlined />} onClick={onCreate} />
                </Tooltip>
              </Authorize>
            </Space>
          }
        >
          {buildings.map((item) => (
            <Tabs.TabPane key={item.id} tab={item.name} />
          ))}
        </Tabs>
        <Table dataSource={data} rowKey="id" loading={load} pagination={false}>
          <Table.Column title="名称" dataIndex="name" />
          <Table.Column title="楼栋" dataIndex="building" />
          <Table.Column
            title="公共区域"
            align="center"
            render={(record: APIDormitoryBasicRooms.Data) => (
              <Tag color={record.is_public === 1 ? '#87d068' : '#f50'}>
                {record.is_public === 1 ? '是' : '否'}
              </Tag>
            )}
          />
          <Table.Column
            title="序号"
            align="center"
            render={(record: APIDormitoryBasicFloors.Data) => (
              <Tag color={initialState?.settings?.primaryColor}>{record.order}</Tag>
            )}
          />
          <Table.Column
            title="启用"
            align="center"
            render={(record: APIDormitoryBasicFloors.Data) => (
              <Authorize
                permission="dormitory.basic.floor.enable"
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
            align="center"
            render={(record: APIDormitoryBasicFloors.Data) =>
              record.created_at && moment(record.created_at).format('YYYY/MM/DD')
            }
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APIDormitoryBasicFloors.Data) => (
              <>
                <Authorize permission="dormitory.basic.floor.update">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                </Authorize>
                <Authorize permission="dormitory.basic.floor.delete">
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
          building={filter.building}
          buildings={buildings}
          params={editor}
          onSave={onSuccess}
          onCancel={onCancel}
        />
      )}
    </>
  );
};

export default List;
