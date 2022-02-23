declare namespace APIAuthRole {
  export type Props = {
    visible?: boolean;
    params?: APIAuthRoles.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  }

  export type Editor = {
    name?: string;
    summary?: string;
    permissions?: number[];
  }

  export type Former = {
    name?: string;
    summary?: string;
    permissions?: any[];
  }

  export type Permission = {
    id?: number;
    name?: string;
    slug?: string;
    children?: Permission;
  }

  export type Loading = {
    confirmed?: boolean;
    permission?: boolean;
  }
}