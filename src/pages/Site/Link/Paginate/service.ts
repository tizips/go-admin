import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/links', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/links/${id}`, { method: 'DELETE' });
}

export async function doEnable(data: APIRequest.Enable) {
  return request<APIResponse.Response<any>>('/api/admin/link/enable', { method: 'PUT', data: data });
}