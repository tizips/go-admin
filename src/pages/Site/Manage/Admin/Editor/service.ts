import { request } from 'umi';

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/site/manage/admin', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: any) {
  return request<APIResponse.Response<any>>(`/api/admin/site/manage/admins/${id}`, {
    method: 'PUT',
    data: params,
  });
}
