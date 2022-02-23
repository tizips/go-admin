import { request } from 'umi';

export async function doList(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/floors', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/dormitory/basic/floors/${id}`, { method: 'DELETE' });
}

export async function doEnable(data: APIRequest.Enable) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/floor/enable', { method: 'PUT', data: data });
}