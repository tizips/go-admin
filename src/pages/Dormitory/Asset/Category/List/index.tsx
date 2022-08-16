import React, { useEffect, useState } from 'react';
import { Button, Card, notification, Popconfirm, Space, Switch, Table, Tag, Tooltip } from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import Editor from '@/pages/Dormitory/Asset/Category/Editor';
import { doDelete, doEnable, doList } from './service';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Basic/Authorize';
import Enable from '@/components/Basic/Enable';

const List: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [editor, setEditor] = useState<APIDormitoryAssetCategories.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APIDormitoryAssetCategories.Visible>({});
  const [data, setData] = useState<APIDormitoryAssetCategories.Data[]>();

  const toPaginate = () => {
    setLoad(true);
    doList()
      .then((response: APIResponse.Response<APIDormitoryAssetCategories.Data[]>) => {
        if (response.code === Constants.Success) setData(response.data || []);
      })
      .finally(() => setLoad(false));
  };

  const onDelete = (record: APIDormitoryAssetCategories.Data) => {
    if (data) {
      const temp: APIDormitoryAssetCategories.Data[] = [...data];
      Loop.ById(
        temp,
        record.id,
        (item: APIDormitoryAssetCategories.Data) => (item.loading_deleted = true),
      );
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '类型删除成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        if (data) {
          const temp: APIDormitoryAssetCategories.Data[] = [...data];
          Loop.ById(
            temp,
            record.id,
            (item: APIDormitoryAssetCategories.Data) => (item.loading_deleted = false),
          );
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIDormitoryAssetCategories.Data) => {
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

  const onEnable = (record: APIDormitoryAssetCategories.Data) => {
    if (data) {
      const temp: APIDormitoryAssetCategories.Data[] = [...data];
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
            message: `类型${enable.is_enable === 1 ? '启用' : '禁用'}成功！`,
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
    toPaginate();
  }, []);

  return (
    <>
      <Card
        title="类型列表"
        extra={
          <Space size={[10, 10]} wrap>
            <Tooltip title="刷新">
              <Button type="primary" icon={<RedoOutlined />} onClick={toPaginate} loading={load} />
            </Tooltip>
            <Authorize permission="dormitory.asset.category.create">
              <Tooltip title="创建">
                <Button type="primary" icon={<FormOutlined />} onClick={onCreate} />
              </Tooltip>
            </Authorize>
          </Space>
        }
      >
        <Table dataSource={data} rowKey="id" loading={load} pagination={false}>
          <Table.Column title="名称" dataIndex="name" />
          <Table.Column
            title="序号"
            render={(record: APIDormitoryAssetCategories.Data) => (
              <Tag color={initialState?.settings?.primaryColor}>{record.order}</Tag>
            )}
          />
          <Table.Column
            title="启用"
            align="center"
            render={(record: APIDormitoryAssetCategories.Data) => (
              <Authorize
                permission="dormitory.asset.category.enable"
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
            render={(record: APIDormitoryAssetCategories.Data) =>
              record.created_at && moment(record.created_at).format('YYYY/MM/DD')
            }
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APIDormitoryAssetCategories.Data) => (
              <>
                <Authorize permission="dormitory.asset.category.update">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                </Authorize>
                <Authorize permission="dormitory.asset.category.delete">
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

export default List;
