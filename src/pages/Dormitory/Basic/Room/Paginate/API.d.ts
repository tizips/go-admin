declare namespace APIBasicRooms {

  type Data = {
    id?: number;
    name?: string;
    building?: string;
    floor?: string;
    type?: string;
    type_id?: number;
    order?: number;
    is_furnish?: number;
    is_enable?: number;
    created_at?: string | moment.Moment;
    loading_deleted?: boolean;
    loading_enable?: boolean;
    loading_furnish?: boolean;
  }

  type Visible = {
    editor?: boolean;
  }

  type Search = {
    page?: number;
    building?: number;
    floor?: number;
    room?: string;
  }

  type Loading = {
    floor?: boolean;
  }

  type Furnish = {
    id?: number;
    is_furnish?: number;
  }

}