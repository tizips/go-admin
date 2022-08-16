import { request } from 'umi';

export async function doParents(module?: number) {
  return request<APIResponse.Response<any>>('/api/admin/site/manage/permission/parents', {
    params: { module },
  });
}

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/site/manage/permission', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: any) {
  return request<APIResponse.Response<any>>(`/api/admin/site/manage/permissions/${id}`, {
    method: 'PUT',
    data: params,
  });
}
