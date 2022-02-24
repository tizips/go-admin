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

export async function doBedByOnline(room?: number) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/bed/online', { params: { room } });
}

export async function doStayCategoryByOnline(room?: number) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/stay/category/online', { params: { room } });
}

export async function doTypeByOnline() {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/type/online');
}
