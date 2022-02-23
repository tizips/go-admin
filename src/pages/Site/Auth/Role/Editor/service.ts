import { request } from 'umi';

export async function doPermissionBySelf() {
  return request<APIResponse.Response<any>>('/api/admin/site/auth/permission/self');
}

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/site/auth/role', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: any) {
  return request<APIResponse.Response<any>>(`/api/admin/site/auth/roles/${id}`, {
    method: 'PUT',
    data: params,
  });
}

