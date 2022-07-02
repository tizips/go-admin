declare namespace APIDormitoryStayPeoples {
  type Data = {
    id?: number;
    category?: string;
    name?: string;
    mobile?: string;
    building?: string;
    floor?: string;
    room?: string;
    bed?: string;
    manager?: { name: string; mobile: string };
    certification?: { no: string; address: string };
    staff?: string;
    departments?: string[];
    titles?: string;
    start?: string;
    end?: string;
    is_temp?: number;
    remark?: string;
    created_at?: string;
    loading_deleted?: boolean;
  };

  type Visible = {
    create?: boolean;
  };

  type Filter = {
    type?: 'name' | 'mobile' | 'room';
  };

  type Search = {
    page?: number;
    type?: string;
    keyword?: string;
    building?: number;
    floor?: number;
    room?: number;
    bed?: number;
    is_temp?: number;
    status?: 'live' | 'leave';
  };

  type Loading = {
    floor?: boolean;
    bed?: boolean;
  };
}
