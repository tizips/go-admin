declare namespace APIDormitoryAssetGrants {
  type Data = {
    id?: number;
    package?: string;
    devices?: { name?: string; number?: number }[];
    remark?: string;
    created_at?: string;
    loading_revoke?: boolean;
  };

  type Visible = {
    create?: boolean;
  };

  type Search = {
    page?: number;
  };
}
