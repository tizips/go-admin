import site from '../routes/site';
import dormitory from '../routes/dormitory';

export default [
  { path: '/login', layout: false, component: './Basic/Login' },
  { path: '/account', component: './Basic/Account' },
  { path: '/dashboard', name: '仪盘', icon: 'DotChartOutlined', component: './Basic/Dashboard' },
  /** 站点路由 **/
  ...site,
  /** 宿舍路由 **/
  ...dormitory,
  { path: '/', redirect: '/dashboard' },
  { path: '/403', component: './Errors/403' },
  { component: './Errors/404' },
];
