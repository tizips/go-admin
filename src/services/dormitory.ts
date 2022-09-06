import { request } from 'umi';

export async function doDormitoryBuildingByOnline(options?: {
  is_public?: number;
  with_public?: boolean;
}) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/building/online', {
    params: options,
  });
}

export async function doDormitoryFloorByOnline(
  building?: number,
  options?: { is_public?: number; with_public?: boolean },
) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/floor/online', {
    params: { building, ...options },
  });
}

export async function doDormitoryRoomByOnline(
  floor?: number,
  options?: { is_public?: number; with_public?: boolean },
) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/room/online', {
    params: { floor, ...options },
  });
}

export async function doDormitoryBedByOnline(
  room?: number,
  options?: { is_public?: number; with_public?: boolean },
) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/bed/online', {
    params: { room, ...options },
  });
}

export async function doDormitoryStayCategoryByOnline(room?: number) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/stay/category/online', {
    params: { room },
  });
}

export async function doDormitoryTypeByOnline(options?: {
  with_bed?: boolean;
  must_bed?: boolean;
}) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/basic/type/online', {
    params: options,
  });
}

export async function doDormitoryAssetCategoryByOnline() {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/asset/category/online');
}

export async function doDormitoryAssetDeviceByOnline(category?: number) {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/asset/device/online', {
    params: { category },
  });
}

export async function doDormitoryAssetPackageByOnline() {
  return request<APIResponse.Response<any>>('/api/admin/dormitory/asset/package/online');
}
