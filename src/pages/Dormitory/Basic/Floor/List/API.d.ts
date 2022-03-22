declare namespace APIBasicFloors {
  type Data = {
    id?: number;
    name?: string;
    building?: string;
    order?: number;
    is_enable?: number;
    is_public?: number;
    created_at?: string | moment.Moment;
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
