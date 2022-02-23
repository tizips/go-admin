import { request } from 'umi';

export async function doList() {
  return request<APIResponse.Response<any>>('/api/admin/system');
}

export async function doUpdate(type?: string, data?: any) {
  return request<APIResponse.Response<any>>('/api/admin/system', {
    method: 'PUT',
    data: { type, data },
  });
}
