import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/site/manage/roles', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/site/manage/roles/${id}`, {
    method: 'DELETE',
  });
}
