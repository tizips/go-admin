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
import { useModel } from '@@/plugin-model/useModel';
import Editor from '@/pages/Dormitory/Asset/Category/Editor';
import { doDelete, doEnable, doList } from './service';
import Loop from '@/utils/Loop';

const List: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [editor, setEditor] = useState<APIAssetCategories.Data | undefined>();
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIAssetCategories.Visible>({});
  const [data, setData] = useState<APIAssetCategories.Data[]>();

  const toPaginate = () => {
    setLoadingPaginate(true);
    doList()
      .then((response: APIResponse.Response<APIAssetCategories.Data[]>) => {
        if (response.code === Constants.Success) setData(response.data || []);
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onDelete = (record: APIAssetCategories.Data) => {
    if (data) {
      const temp: APIAssetCategories.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIAssetCategories.Data) => (item.loading_deleted = true));
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
          const temp: APIAssetCategories.Data[] = [...data];
          Loop.ById(
            temp,
            record.id,
            (item: APIAssetCategories.Data) => (item.loading_deleted = false),
          );
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIAssetCategories.Data) => {
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

  const onEnable = (record: APIAssetCategories.Data) => {
    if (data) {
      const temp: APIAssetCategories.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIAssetCategories.Data) => (item.loading_enable = true));
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
            Loop.ById(
              temp,
              record.id,
              (item: APIAssetCategories.Data) => (item.is_enable = enable.is_enable),
            );
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          Loop.ById(
            temp,
            record.id,
            (item: APIAssetCategories.Data) => (item.loading_enable = false),
          );
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
          <Row gutter={10}>
            <Col>
              <Tooltip title="刷新">
                <Button
                  type="primary"
                  icon={<RedoOutlined />}
                  onClick={toPaginate}
                  loading={loadingPaginate}
                />
              </Tooltip>
            </Col>
            {initialState?.permissions &&
            initialState?.permissions?.indexOf('dormitory.stay.category.create') >= 0 ? (
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
        <Table dataSource={data} rowKey="id" loading={loadingPaginate} pagination={false}>
          <Table.Column title="名称" dataIndex="name" />
          <Table.Column
            title="序号"
            render={(record: APIAssetCategories.Data) => (
              <Tag color={initialState?.settings?.primaryColor}>{record.order}</Tag>
            )}
          />
          <Table.Column
            title="启用"
            align="center"
            render={(record: APIAssetCategories.Data) => (
              <Switch
                size="small"
                checked={record.is_enable === 1}
                onClick={() => onEnable(record)}
                disabled={
                  initialState?.permissions &&
                  initialState?.permissions?.indexOf('dormitory.stay.category.enable') < 0
                }
                loading={record.loading_enable}
              />
            )}
          />
          <Table.Column
            title="创建时间"
            render={(record: APIAssetCategories.Data) =>
              record.created_at && moment(record.created_at).format('YYYY/MM/DD')
            }
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APIAssetCategories.Data) => (
              <>
                {initialState?.permissions &&
                initialState?.permissions?.indexOf('dormitory.stay.category.update') >= 0 ? (
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                ) : (
                  <></>
                )}
                {initialState?.permissions &&
                initialState?.permissions?.indexOf('dormitory.stay.category.delete') >= 0 ? (
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
        <Editor visible={visible.editor} params={editor} onSave={onSuccess} onCancel={onCancel} />
      ) : (
        <></>
      )}
    </>
  );
};

export default List;
