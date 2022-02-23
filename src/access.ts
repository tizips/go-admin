export default function access(initialState: { account?: API.Account, permissions?: string[] }) {
  const { account, permissions } = initialState || {};
  return {
    login: !!account,
    permissions,
    routes: (route: any) => {
      const { permission } = route;
      return permission && permissions && permissions.indexOf(permission) >= 0;
    },
  };
}
