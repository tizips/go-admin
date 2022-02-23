export default [
  {
    name: '基础',
    icon: 'BankOutlined',
    path: '/dormitory/basic',
    routes: [
      {
        name: '房型',
        path: '/dormitory/basic/type',
        access: 'routes',
        permission: 'dormitory.basic.type.list',
        component: './Dormitory/Basic/Type/List',
      },
      {
        name: '楼栋',
        path: '/dormitory/basic/building',
        access: 'routes',
        permission: 'dormitory.basic.building.list',
        component: './Dormitory/Basic/Building/List',
      },
      {
        name: '楼层',
        path: '/dormitory/basic/floor',
        access: 'routes',
        permission: 'dormitory.basic.floor.list',
        component: './Dormitory/Basic/Floor/List',
      },
      {
        name: '房间',
        path: '/dormitory/basic/room',
        access: 'routes',
        permission: 'dormitory.basic.room.paginate',
        component: './Dormitory/Basic/Room/Paginate',
      },
      {
        name: '床位',
        path: '/dormitory/basic/bed',
        access: 'routes',
        permission: 'dormitory.basic.bed.paginate',
        component: './Dormitory/Basic/Bed/Paginate',
      },
    ],
  },
  {
    name: '住宿',
    icon: 'HomeOutlined',
    path: '/dormitory/stay',
    routes: [
      {
        name: '类型',
        path: '/dormitory/stay/category',
        access: 'routes',
        permission: 'dormitory.stay.category.list',
        component: './Dormitory/Stay/Category/List',
      },
      {
        name: '人员',
        path: '/dormitory/stay/people',
        access: 'routes',
        permission: 'dormitory.stay.people.paginate',
        component: './Dormitory/Stay/People/Paginate',
      },
    ],
  },
];