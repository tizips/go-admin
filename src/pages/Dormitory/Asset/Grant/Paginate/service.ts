import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/asset/grants', { params });
}

export async function doRevoke(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/dormitory/asset/grant/revoke`, {
    method: 'POST',
    data: { id },
  });
}
