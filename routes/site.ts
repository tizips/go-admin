export default [
  {
    name: '架构',
    icon: 'AppstoreOutlined',
    path: '/site/architecture',
    routes: [
      {
        name: '模块',
        path: '/site/architecture/module',
        access: 'routes',
        permission: 'site.architecture.module.list',
        component: './Site/Architecture/Module/List',
      },
    ],
  },
  {
    name: '管理',
    icon: 'IdcardOutlined',
    path: '/site/management',
    routes: [
      {
        name: '账号',
        path: '/site/management/admin',
        access: 'routes',
        permission: 'site.management.admin.paginate',
        component: './Site/Management/Admin/Paginate',
      },
      {
        name: '角色',
        path: '/site/management/role',
        access: 'routes',
        permission: 'site.management.role.paginate',
        component: './Site/Management/Role/Paginate',
      },
      {
        name: '权限',
        path: '/site/management/permission',
        access: 'routes',
        permission: 'site.management.permission.tree',
        component: './Site/Management/Permission/Tree',
      },
    ],
  },
  {
    name: '系统',
    icon: 'SettingOutlined',
    path: '/site/system',
    routes: [
      {
        name: '配置',
        path: '/site/system/config',
        access: 'routes',
        permission: 'site.site.system.list',
        component: './Site/System/Config',
      },
    ],
  },
];
