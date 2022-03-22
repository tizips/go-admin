import { request } from 'umi';

export async function doBuildingByOnline(options?: { is_public?: number; with_public?: boolean }) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/building/online', {
    params: options,
  });
}

export async function doFloorByOnline(
  building?: number,
  options?: { is_public?: number; with_public?: boolean },
) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/floor/online', {
    params: { building, ...options },
  });
}

export async function doRoomByOnline(
  floor?: number,
  options?: { is_public?: number; with_public?: boolean },
) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/room/online', {
    params: { floor, ...options },
  });
}

export async function doBedByOnline(
  room?: number,
  options?: { is_public?: number; with_public?: boolean },
) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/bed/online', {
    params: { room, ...options },
  });
}

export async function doStayCategoryByOnline(room?: number) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/stay/category/online', {
    params: { room },
  });
}

export async function doTypeByOnline(options?: { with_bed?: boolean; must_bed?: boolean }) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/type/online', {
    params: options,
  });
}

export async function doAssetCategoryByOnline() {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/asset/category/online');
}

export async function doAssetDeviceByOnline(category?: number) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/asset/device/online', {
    params: { category },
  });
}

export async function doAssetPackageByOnline() {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/asset/package/online');
}
