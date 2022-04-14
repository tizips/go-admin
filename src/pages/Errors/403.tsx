import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="对不起，您没有权限访问该页面."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        回到主页
      </Button>
    }
  />
);

export default NoFoundPage;
