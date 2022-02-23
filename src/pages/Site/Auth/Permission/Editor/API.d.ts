declare namespace APIAuthPermission {

  export type Props = {
    visible?: boolean;
    params?: APIAuthPermissions.Data;
    methods?: any;
    module?: number;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  }

  export type Editor = {
    module?: number;
    parent?: number;
    name?: string;
    slug?: string;
    method?: string;
    path?: string;
  }

  export type Former = {
    parent?: number[];
    name?: string;
    slug?: string;
    uri?: string;
  }

  export type Api = {
    method?: string;
    path?: string;
    action?: string;
  }

  export type Parent = {
    id?: number;
    name?: string;
    slug?: string;
    children?: Parent;
  }

  export type Loading = {
    confirmed?: boolean;
    api?: boolean;
    parent?: boolean;
  }

}