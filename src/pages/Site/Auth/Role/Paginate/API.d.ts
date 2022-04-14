declare namespace APIAuthRoles {
  type Data = {
    id?: number;
    name?: string;
    summary?: string;
    permissions?: any[];
    created_at?: string;
    loading_deleted?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    page?: number;
  };
}
