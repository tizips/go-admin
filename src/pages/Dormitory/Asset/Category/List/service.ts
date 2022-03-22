import { request } from 'umi';

export async function doList(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/asset/categories', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/dormitory/asset/categories/${id}`, {
    method: 'DELETE',
  });
}

export async function doEnable(data: APIRequest.Enable) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/asset/category/enable', {
    method: 'PUT',
    data: data,
  });
}
