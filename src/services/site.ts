import { request } from 'umi';

export async function doSiteModuleByOnline() {
  return request<APIResponse.Response<any>>('/api/admin/site/architecture/module/online');
}

export async function doSiteApis(module?: number) {
  return request<APIResponse.Response<any>>('/api/admin/site/helper/apis', { params: { module } });
}

export async function doSiteRoleByEnable() {
  return request<APIResponse.Response<any>>('/api/admin/site/manage/role/online');
}
