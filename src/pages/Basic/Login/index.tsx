import { Alert, Button, Col, Form, Input, notification, Row } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import Constants from '@/utils/Constants';
import { doLogin } from './service';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Pattern from '@/utils/Pattern';
import leftImage from '@/static/img/bg-login.png';
import bgImage from '@/static/img/background-login.jpg';

import styles from './index.less';

const Login: React.FC = () => {
  const initBasicFormer: APILogin.Login = {};

  const { initialState, setInitialState } = useModel('@@initialState');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);

  const toUserInfo = async () => {
    const userInfo = await initialState?.toAccount?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, account: userInfo }));
    }
  };

  const onSubmit = async (values: APILogin.Login) => {
    localStorage.clear();
    setLoading(true);
    doLogin(values)
      .then(async (response: APIResponse.Response<APILogin.Response>) => {
        if (response.code != Constants.Success) {
          setErrors(response.message);
        } else {
          notification.success({ message: '登陆成功！等待跳转' });
          setErrors('');
          localStorage.setItem(Constants.Authorization, response.data.token);
          await toUserInfo();
          /** 此方法会跳转到 redirect 参数所在的位置 */

          if (!history) return;

          const { query } = history.location;
          const { redirect } = query as { redirect: string };
          history.push(redirect || '/');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.container} style={{ background: `url(${bgImage}) no-repeat 50%` }}>
      <Row justify="center">
        <Col md={18} sm={16} xs={20} className={styles.loginBox}>
          <Row className={styles.loginContent}>
            <Col sm={0} md={0} lg={14} className={styles.leftLogin}>
              <img src={leftImage} className={styles.leftImage} alt="" width="100%" />
            </Col>
            <Col lg={10} md={24} sm={24} className={styles.rightLogin}>
              <Row>
                <Col xs={24}>
                  <h2 className={styles.title}>登录</h2>
                  {errors ? (
                    <Alert className={styles.error} type="error" message={errors} showIcon />
                  ) : (
                    <p className={styles.summary}>一站式服务</p>
                  )}
                </Col>
                <Col xs={24}>
                  <Form initialValues={initBasicFormer} onFinish={onSubmit} labelCol={{ span: 0 }}>
                    <Form.Item
                      name="username"
                      validateFirst
                      rules={[
                        { required: true, message: '请输入您的用户名！' },
                        {
                          pattern: new RegExp(Pattern.ADMIN_USERNAME),
                          message: '用户名输入错误！',
                        },
                      ]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      validateFirst
                      rules={[
                        { required: true, message: '请输入您的登录密码！' },
                        {
                          pattern: new RegExp(Pattern.ADMIN_PASSWORD),
                          message: '密码输入错误！',
                        },
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                      立即登录
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
