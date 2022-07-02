import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/rooms', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/dormitory/basic/rooms/${id}`, {
    method: 'DELETE',
  });
}

export async function doEnable(data: APIRequest.Enable) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/room/enable', {
    method: 'PUT',
    data: data,
  });
}

export async function doFurnish(data: APIDormitoryBasicRooms.Furnish) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/room/furnish', {
    method: 'PUT',
    data: data,
  });
}
