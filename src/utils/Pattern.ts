export default {
  ADMIN_USERNAME: /^[a-zA-Z\d-_]{4,20}$/,
  ADMIN_PASSWORD: /^[a-zA-Z\d-_@$&%!]{4,20}$/,

  CONFIG_CATEGORY_CODE: /^[a-zA-Z]([a-zA-Z\d]*:?)+[a-zA-Z]$/,
  CONFIG_KEY: /^[a-zA-Z]([a-zA-Z\d]*:?)+[a-zA-Z]$/,

  MODULE_KEY: /^[a-z]{2,20}$/,
  MENU_ROUTE: /^[a-zA-Z\d-_\/]+\/?[a-zA-Z]+$/,

  ROLE_SLUG: /^[a-zA-Z][a-zA-Z\d]{1,31}$/,

  PERMISSION_CODE: /^([a-z][a-z\d]*(\.)?)*[a-z\d]*[a-z]$/,
  PERMISSION_ROUTE: /^[a-zA-Z\d/{}]+$/,

  CATEGORY_GROUP_CODE: /^([a-zA-Z]([a-zA-Z\d]*:?)+)?[a-zA-Z]$/,

  FACILITY_CATEGORY_CODE: /^[a-zA-Z]([a-zA-Z\d]*:?)+[a-zA-Z]$/,

  PRODUCT_SPU: /^[a-z-A-Z\d]{16,64}$/,

  MOBILE: /^1[2-9]\d{9}$/,

  COST: /^[1-9]\d*(\.\d{1,2})*$/,

  INTEGER: /^[1-9]\d*$/,

  FRACTION: /^\d+$/,

  ID_CARD: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[\dXx]$/,
};
