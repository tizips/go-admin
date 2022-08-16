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
    icon: 'ScheduleOutlined',
    path: '/site/manage',
    routes: [
      {
        name: '账号',
        path: '/site/manage/admin',
        access: 'routes',
        permission: 'site.manage.admin.paginate',
        component: './Site/Manage/Admin/Paginate',
      },
      {
        name: '角色',
        path: '/site/manage/role',
        access: 'routes',
        permission: 'site.manage.role.paginate',
        component: './Site/Manage/Role/Paginate',
      },
      {
        name: '权限',
        path: '/site/manage/permission',
        access: 'routes',
        permission: 'site.manage.permission.tree',
        component: './Site/Manage/Permission/Tree',
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
