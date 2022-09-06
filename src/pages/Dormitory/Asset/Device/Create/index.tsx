import { Col, Form, Input, InputNumber, Modal, notification, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';
import { doDormitoryAssetCategoryByOnline } from '@/services/dormitory';

import styles from './index.less';

const Create: React.FC<APIDormitoryAssetDevice.Props> = (props) => {
  const [former] = Form.useForm<APIDormitoryAssetDevice.Former>();
  const [loading, setLoading] = useState<APIDormitoryAssetDevice.Loading>({});
  const [categories, setCategories] = useState<APIData.Online[]>([]);

  const toCategoriesByOnline = () => {
    setLoading({ ...loading, category: true });
    doDormitoryAssetCategoryByOnline()
      .then((response: APIResponse.Response<APIData.Online[]>) => {
        if (response.code == Constants.Success) setCategories(response.data);
      })
      .finally(() => setLoading({ ...loading, category: false }));
  };

  const toCreate = (params: any) => {
    setLoading({ ...loading, confirmed: true });
    doCreate(params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '添加成功' });

          if (props.onCreate) props.onCreate();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  const toUpdate = (params: any) => {
    setLoading({ ...loading, confirmed: true });
    doUpdate(props.params?.id, params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '修改成功' });

          if (props.onCreate) props.onCreate();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  const onSubmit = (values: APIDormitoryAssetDevice.Former) => {
    const params: APIDormitoryAssetDevice.Editor = {
      category: values.category,
      no: values.no,
      name: values.name,
      specification: values.specification,
      stock: values.stock,
      price: 0,
      unit: values.unit,
      indemnity: 0,
      remark: values.remark,
    };

    if (values.price) params.price = parseFloat(values.price) * 100;
    if (values.indemnity) params.indemnity = parseFloat(values.indemnity) * 100;

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const toInit = () => {
    const data: APIDormitoryAssetDevice.Former = {
      category: undefined,
      no: '',
      name: '',
      specification: '',
      stock: 0,
      price: '',
      unit: '',
      indemnity: '',
      remark: '',
    };

    if (props.params) {
      data.category = props.params.category_id;
      data.no = props.params.no;
      data.name = props.params.name;
      data.specification = props.params.specification;
      data.stock = props.params.stock_total;
      data.price = `${props.params.price / 100}`;
      data.unit = props.params.unit;
      data.indemnity = `${props.params.indemnity / 100}`;
      data.remark = props.params.remark;
    }

    former.setFieldsValue(data);
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
      if (categories.length <= 0) toCategoriesByOnline();
    }
  }, [props.visible]);

  return (
    <Modal
      title="办理入住"
      open={props.visible}
      closable={false}
      centered
      onOk={() => former.submit()}
      width={660}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Form form={former} onFinish={onSubmit} labelCol={{ span: 5 }}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item label="类型" name="category" rules={[{ required: true }]}>
              <Select loading={loading.category}>
                {categories.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="编号" name="no" rules={[{ required: true }, { max: 20 }]}>
              <Input />
            </Form.Item>
            <Form.Item label="名称" name="name" rules={[{ required: true }, { max: 20 }]}>
              <Input />
            </Form.Item>
            <Form.Item label="规格" name="specification" rules={[{ max: 60 }]}>
              <Input />
            </Form.Item>
            <Form.Item label="库存" name="stock" rules={[{ required: true }]}>
              <InputNumber min={0} className={styles.stock} />
            </Form.Item>
          </Col>
          <Col span={13}>
            <Form.Item label="单价" name="price" rules={[{ required: true }]}>
              <Input prefix="¥" suffix="元" placeholder="0.00" />
            </Form.Item>
            <Form.Item label="单位" name="unit" rules={[{ required: true }, { max: 60 }]}>
              <Input />
            </Form.Item>
            <Form.Item label="赔偿" name="indemnity">
              <Input prefix="¥" suffix="元" placeholder="0.00" />
            </Form.Item>
            <Form.Item label="备注" name="remark" rules={[{ max: 255 }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Create;
