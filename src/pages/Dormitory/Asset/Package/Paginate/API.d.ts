declare namespace APIDormitoryAssetPackages {
  type Data = {
    id?: number;
    name?: string;
    devices?: { category?: number; number?: number; id?: number; name?: string }[];
    created_at?: string;
    loading_deleted?: boolean;
  };

  type Visible = {
    create?: boolean;
  };

  type Search = {
    page?: number;
    keyword?: string;
  };
}
