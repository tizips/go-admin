import { request } from 'umi';

export async function doLogin(body: APILogin.Login) {
  return request<APIResponse.Response<any>>('/api/admin/login/account', {
    method: 'POST',
    data: body,
  });
}