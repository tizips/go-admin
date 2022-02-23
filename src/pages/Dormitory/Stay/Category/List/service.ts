import { request } from 'umi';

export async function doList(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/stay/categories', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/dormitory/stay/categories/${id}`, { method: 'DELETE' });
}

export async function doEnable(data: APIRequest.Enable) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/stay/category/enable', { method: 'PUT', data: data });
}