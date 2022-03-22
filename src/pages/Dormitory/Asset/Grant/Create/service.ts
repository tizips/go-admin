import { request } from 'umi';

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/asset/grant', {
    method: 'POST',
    data: params,
  });
}
