import { request } from 'umi';

export async function doTree(module?: number) {
  return request<APIResponse.Response<any>>('/api/admin/site/auth/permissions', { params: { module } });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/site/auth/permissions/${id}`, { method: 'DELETE' });
}