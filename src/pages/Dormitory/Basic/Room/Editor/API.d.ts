declare namespace APIBasicRoom {

  type Props = {
    visible?: boolean;
    params?: APIBasicRooms.Data;
    building?: number | string;
    buildings?: APIResponse.Online[];
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  }

  type Editor = {
    name?: string;
    floor?: number;
    type?: number;
    order?: number;
    is_furnish?: number;
    is_enable?: number;
  }

  type Former = {
    name?: string;
    building?: number;
    floor?: number;
    type?: number;
    order?: number;
    is_furnish?: number;
    is_enable?: number;
  }

  type Loading = {
    confirmed?: boolean;
    floor?: boolean;
    type?: boolean;
  }

  type Filter = {
    building?: number;
  }

}