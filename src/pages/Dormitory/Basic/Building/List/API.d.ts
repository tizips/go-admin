declare namespace APIBasicBuildings {

  type Data = {
    id?: number;
    name?: string;
    order?: number;
    is_enable?: number;
    created_at?: string | moment.Moment;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  }

  type Visible = {
    editor?: boolean;
  }

}