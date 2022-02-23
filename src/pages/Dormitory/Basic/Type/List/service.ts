import { request } from 'umi';

export async function doList(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/types', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/dormitory/basic/types/${id}`, { method: 'DELETE' });
}

export async function doEnable(data: APIRequest.Enable) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/type/enable', { method: 'PUT', data: data });
}