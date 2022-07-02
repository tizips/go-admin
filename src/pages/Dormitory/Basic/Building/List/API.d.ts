declare namespace APIDormitoryBasicBuildings {
  type Data = {
    id?: number;
    name?: string;
    order?: number;
    is_enable?: number;
    is_public?: number;
    created_at?: string;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };
}
