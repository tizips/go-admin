import React, { useCallback } from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Modal, notification, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { doLogout } from '@/services/account';
import Constants from '@/utils/Constants';

import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const toLogout = async () => {
  const { query = {}, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/login' && !redirect) {
    history.replace({
      pathname: '/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({}) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        Modal.confirm({
          title: '登出',
          content: '确定要推出该账号吗？',
          centered: true,
          onOk: () => {
            doLogout()
              .then((response: APIResponse.Response<any>) => {
                if (response.code !== Constants.Success) {
                  notification.error({ message: response.message });
                } else {
                  setInitialState((s) => ({ ...s, account: undefined }));
                  toLogout();
                  localStorage.clear();
                }
              });
          },
        });
      } else {
        history.push(`/${key}`);
      }
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size='small'
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { account } = initialState;

  if (!account || !account.nickname) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {account && (
        <Menu.Item key='account'>
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {account && <Menu.Divider />}
      <Menu.Item key='logout'>
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size='small' className={styles.avatar} src={account.avatar}
                style={{ color: '#fff', backgroundColor: initialState?.settings?.primaryColor }}
                alt={account.nickname}>{account.nickname.slice(0, 1)}</Avatar>
        <span className={`${styles.name} anticon`}>{account.nickname}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
