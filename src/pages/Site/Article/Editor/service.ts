import { request } from 'umi';

export async function doUsed() {
  return request<APIResponse.Response<any>>('/api/admin/category/used');
}

export async function doInformation(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/articles/${id}`);
}

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/article', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: any) {
  return request<APIResponse.Response<any>>(`/api/admin/articles/${id}`, {
    method: 'PUT',
    data: params,
  });
}

