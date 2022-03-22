declare namespace APIAssetCategories {
  type Data = {
    id?: number;
    name?: string;
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
