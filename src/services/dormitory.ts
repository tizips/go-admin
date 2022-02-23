import { request } from 'umi';

export async function doBuildingByOnline() {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/building/online');
}

export async function doFloorByOnline(building?: number) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/floor/online', { params: { building } });
}

export async function doRoomByOnline(floor?: number) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/room/online', { params: { floor } });
}

export async function doTypeByOnline() {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/type/online');
}
