import { request } from 'umi';

export async function doAccount() {
  return request<APIResponse.Response<any>>('/api/admin/account/information');
}

/** 退出登录接口 POST /api/logout */
export async function doLogout() {
  return request<APIResponse.Response<any>>('/api/admin/account/logout', {
    method: 'POST',
  });
}

export async function doModule() {
  return request<APIResponse.Response<any>>('/api/admin/account/module');
}

export async function doPermission(module: number) {
  return request<APIResponse.Response<any>>('/api/admin/account/permission', { params: { module } });
}