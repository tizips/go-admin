import { request } from 'umi';

export async function doUpdate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/account', {
    method: 'PUT',
    data: params,
  });
}
