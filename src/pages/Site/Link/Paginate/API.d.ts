declare namespace APISiteLinks {
  export type Data = {
    id?: number;
    name?: string;
    uri?: string;
    admin?: string;
    email?: string;
    logo?: string;
    summary?: string;
    no?: number;
    position?: number;
    is_enable?: number;
    created_at?: string | moment.Moment;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  }

  export type Visible = {
    editor?: boolean;
  }
}