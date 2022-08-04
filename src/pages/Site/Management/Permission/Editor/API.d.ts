declare namespace APISiteManagementPermission {
  type Props = {
    visible?: boolean;
    params?: APISiteManagementPermissions.Data;
    methods?: any;
    module?: number;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    module?: number;
    parent?: number;
    name?: string;
    slug?: string;
    method?: string;
    path?: string;
  };

  type Former = {
    parent?: number[];
    name?: string;
    slug?: string;
    uri?: string;
  };

  type Api = {
    method?: string;
    path?: string;
    action?: string;
  };

  type Parent = {
    id?: number;
    name?: string;
    slug?: string;
    children?: Parent;
  };

  type Loading = {
    confirmed?: boolean;
    api?: boolean;
    parent?: boolean;
  };
}
