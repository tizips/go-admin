export default {
  ADMIN_USERNAME: /^[a-zA-Z0-9-_]{4,20}$/,
  ADMIN_PASSWORD: /^[a-zA-Z0-9-_@$&%!]{4,20}$/,

  CONFIG_CATEGORY_CODE: /^[a-zA-Z]([a-zA-Z0-9]*:?)+[a-zA-Z]$/,
  CONFIG_KEY: /^[a-zA-Z]([a-zA-Z0-9]*:?)+[a-zA-Z]$/,

  MODULE_KEY: /^[a-z]{2,20}$/,
  MENU_ROUTE: /^[a-zA-Z0-9-_\/]+\/?[a-zA-Z]+$/,

  ROLE_SLUG: /^[a-zA-Z][a-zA-Z0-9]{1,31}$/,

  PERMISSION_CODE: /^([a-z][a-z0-9]*(\.)?)*[a-z0-9]*[a-z]$/,
  PERMISSION_ROUTE: /^[a-zA-Z0-9/{}]+$/,

  CATEGORY_GROUP_CODE: /^([a-zA-Z]([a-zA-Z0-9]*:?)+)?[a-zA-Z]$/,

  FACILITY_CATEGORY_CODE: /^[a-zA-Z]([a-zA-Z0-9]*:?)+[a-zA-Z]$/,

  PRODUCT_SPU: /^[a-z-A-Z0-9]{16,64}$/,

  MOBILE: /^1[2-9][0-9]{9}$/,

  COST: /^\d+(\.\d{1,2})*$/,

  FRACTION: /^\d+$/,

  ID_CARD: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
};
