import { request } from 'umi';

export async function doUpload(file: any, dir?: string) {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('dir', dir || '/file');

  return request<APIResponse.Response<any>>('/api/admin/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}
