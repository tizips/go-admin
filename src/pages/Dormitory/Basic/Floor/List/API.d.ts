declare namespace APIDormitoryBasicFloors {
  type Data = {
    id?: number;
    name?: string;
    building?: string;
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

  type Filter = {
    building?: number;
  };
}
