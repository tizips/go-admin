declare namespace APIDormitoryAssetDevices {
  type Data = {
    id?: number;
    category?: string;
    category_id?: number;
    name?: string;
    no?: string;
    specification?: string;
    price: number;
    unit?: string;
    indemnity: number;
    stock_total: number;
    stock_used: number;
    remark?: string;
    created_at?: string;
    loading_deleted?: boolean;
  };

  type Visible = {
    create?: boolean;
  };

  type Filter = {
    type?: 'name' | 'no';
  };

  type Search = {
    page?: number;
    type?: string;
    keyword?: string;
  };
}
