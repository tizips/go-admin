declare namespace APIDormitoryStayPeople {
  type Props = {
    visible?: boolean;
    buildings?: APIData.Online[];
    onCreate?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    category?: number;
    bed?: number;
    name?: string;
    mobile?: string;
    start?: string;
    end?: string;
    remark?: string;
  };

  type Former = {
    category?: number;
    positions?: number[];
    is_temp?: number;
    name?: string;
    mobile?: string;
    date?: any;
    remark?: string;
  };

  type Loading = {
    confirmed?: boolean;
    category?: boolean;
  };

  type Filter = {
    building?: number;
    floor?: number;
    room?: number;
    bed?: number;
  };
}
