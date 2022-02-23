declare namespace APIAuthPermissions {

  export type Data = {
    id?: number;
    parents?: number[];
    name?: string;
    slug?: string;
    method?: string;
    path?: string;
    children?: Data[];
    created_at?: string | moment.Moment;
    loading_deleted?: boolean;
  }

  export type Visible = {
    editor?: boolean;
  }

  type Loading = {
    module?: boolean;
    tree?: boolean;
  }

  type Active = {
    module?: number;
  }

}