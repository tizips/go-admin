import { request } from 'umi';

export async function doModuleByOnline() {
  return request<APIResponse.Response<any>>('/api/admin/site/architecture/module/online');
}

export async function doApis(module?: number) {
  return request<APIResponse.Response<any>>('/api/admin/site/helper/apis', { params: { module } });
}

export async function doRoleByEnable() {
  return request<APIResponse.Response<any>>('/api/admin/site/auth/role/enable');
}
