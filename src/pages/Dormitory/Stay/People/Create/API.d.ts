declare namespace APIStayPeople {

  type Props = {
    visible?: boolean;
    buildings?: APIResponse.Online[];
    onCreate?: () => void;
    onCancel?: () => void;
  }

  type Editor = {
    category?: number;
    bed?: number;
    name?: string;
    mobile?: string;
    start?: string;
    end?: string;
    remark?: string;
  }

  type Former = {
    category?: number;
    building?: number;
    floor?: number;
    room?: number;
    bed?: number;
    is_temp?: number;
    name?: string;
    mobile?: string;
    date?: any;
    remark?: string;
  }

  type Loading = {
    confirmed?: boolean;
    floor?: boolean;
    room?: boolean;
    bed?: boolean;
    category?: boolean;
  }

  type Filter = {
    building?: number;
    floor?: number;
    room?: number;
    bed?: number;
  }

}