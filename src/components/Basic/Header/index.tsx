import { useEffect, useState } from 'react';
import { history } from 'umi';
import { Menu, Spin } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import { doModule, doPermission } from '@/services/account';
import Constants from '@/utils/Constants';

const Header = () => {

  const { initialState, setInitialState } = useModel('@@initialState');

  const [loading, setLoading] = useState<boolean>();
  const [modules, setModels] = useState<API.Module[]>([]);

  const toModules = () => {
    setLoading(true);
    doModule()
      .then((response: APIResponse.Response<API.Module[]>) => {
        if (response.code == Constants.Success) {
          setModels(response.data);
          if (response.data.length > 0) {

            const paths = history.location.pathname.split('/');

            let slug = response.data[0].slug;
            let id = response.data[0].id;

            if (paths.length >= 2) {
              response.data.forEach(item => {
                if (item.slug === paths[1]) {
                  slug = item.slug;
                  id = item.id;
                }
              });
            }

            setInitialState({ ...initialState, module: id, module_key: slug });
          }
        }
      })
      .finally(() => setLoading(false));
  };

  const onClick = (event: any) => {
    const { key } = event;
    if (key != initialState?.module && modules) {
      modules.forEach(item => {
        if (item.id == key) setInitialState({ ...initialState, module: item.id, module_key: item.slug });
      });
    }
  };

  useEffect(() => {
    if (initialState?.module) {
      doPermission(initialState?.module)
        .then((response: APIResponse.Response<string[]>) => {
          if (response.code === Constants.Success) {
            const permissions: string[] = [];
            if (response.data) {
              response.data.forEach(item => permissions.push(`${initialState.module_key}.${item}`));
            }
            setInitialState({ ...initialState, permissions });
          }
        });
    }
  }, [initialState?.module]);

  useEffect(() => {
    if (modules.length <= 0) toModules();
  }, []);

  return (
    loading ? <Spin /> :
      <Menu mode='horizontal' activeKey={`${initialState?.module}`} onClick={onClick}
            theme={initialState?.settings?.headerTheme || 'light'}>
        {
          modules.map(item => (
            <Menu.Item key={`${item.id}`}>{item.name}</Menu.Item>
          ))
        }
      </Menu>
  );
};

export default Header;