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
    name: '授权',
    icon: 'IdcardOutlined',
    path: '/site/auth',
    routes: [
      {
        name: '账号',
        path: '/site/auth/admin',
        access: 'routes',
        permission: 'site.auth.admin.paginate',
        component: './Site/Auth/Admin/Paginate',
      },
      {
        name: '角色',
        path: '/site/auth/role',
        access: 'routes',
        permission: 'site.auth.role.paginate',
        component: './Site/Auth/Role/Paginate',
      },
      {
        name: '权限',
        path: '/site/auth/permission',
        access: 'routes',
        permission: 'site.auth.permission.tree',
        component: './Site/Auth/Permission/Tree',
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