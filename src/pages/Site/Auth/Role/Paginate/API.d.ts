declare namespace APIAuthRoles {

  type Data = {
    id?: number;
    name?: string;
    summary?: string;
    permissions?: any[];
    created_at?: string | moment.Moment;
    loading_deleted?: boolean;
  }

  type Visible = {
    editor?: boolean;
  }

  type Search = {
    page?: number;
  }

}