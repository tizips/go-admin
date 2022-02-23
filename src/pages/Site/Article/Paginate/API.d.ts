declare namespace APISiteArticles {
  export type Data = {
    id?: number;
    name?: string;
    category?: string;
    author?: string;
    is_enable?: number;
    created_at?: string | moment.Moment;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  }

  export type Visible = {
    editor?: boolean;
  }
}