import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/site/manage/admins', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/site/manage/admins/${id}`, {
    method: 'DELETE',
  });
}

export async function doEnable(data: APIRequest.Enable) {
  return request<APIResponse.Response<any>>('/api/admin/site/manage/admin/enable', {
    method: 'PUT',
    data: data,
  });
}
