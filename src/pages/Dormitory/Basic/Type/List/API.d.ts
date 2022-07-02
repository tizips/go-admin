declare namespace APIDormitoryBasicTypes {
  type Data = {
    id?: number;
    name?: string;
    beds?: { name: ?string; is_public?: number }[];
    order?: number;
    is_enable?: number;
    created_at?: string;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };
}
