declare namespace APIStayPeoples {

  type Data = {
    id?: number;
    category?: string;
    name?: string;
    mobile?: string;
    building?: string;
    floor?: string;
    room?: string;
    bed?: string;
    status_staff?: string;
    status_department?: string;
    status_titles?: string;
    is_temp?: number;
    created_at?: string | moment.Moment;
    loading_deleted?: boolean;
  }

  type Visible = {
    create?: boolean;
  }

  type Filter = {
    type?: 'name' | 'mobile' | 'room';
  }

  type Search = {
    page?: number;
    type?: string;
    keyword?: string;
    building?: number;
    floor?: number;
    room?: number;
    bed?: number;
  }

  type Loading = {
    floor?: boolean;
    bed?: boolean;
  }

}