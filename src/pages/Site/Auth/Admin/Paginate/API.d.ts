declare namespace APISiteAuthAdmins {
  type Data = {
    id?: number;
    username?: string;
    nickname?: string;
    mobile?: string;
    is_enable?: number;
    roles?: { id: number; name: string }[];
    created_at?: string;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    page?: number;
  };
}
