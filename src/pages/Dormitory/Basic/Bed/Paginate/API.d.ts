declare namespace APIBasicBeds {
  type Data = {
    id?: number;
    name?: string;
    building?: string;
    floor?: string;
    room?: string;
    order?: number;
    is_enable?: number;
    is_public?: number;
    created_at?: string | moment.Moment;
    loading_deleted?: boolean;
    loading_enable?: boolean;
    loading_furnish?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    page?: number;
    building?: number;
    floor?: number;
    room?: number;
    bed?: string;
  };

  type Loading = {
    floor?: boolean;
    bed?: boolean;
  };
}
