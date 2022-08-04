declare namespace APISiteManagementRole {
  type Props = {
    visible?: boolean;
    params?: APISiteManagementRoles.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    name?: string;
    summary?: string;
    permissions?: number[];
  };

  type Former = {
    name?: string;
    summary?: string;
    permissions?: any[];
  };

  type Permission = {
    id?: number;
    name?: string;
    slug?: string;
    children?: Permission;
  };

  type Loading = {
    confirmed?: boolean;
    permission?: boolean;
  };
}
