declare namespace APIBasicRoom {
  type Props = {
    visible?: boolean;
    params?: APIBasicRooms.Data;
    buildings?: APIResponse.Online[];
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    name?: string;
    floor?: number;
    type?: number;
    order?: number;
    is_furnish?: number;
    is_enable?: number;
    is_public?: number;
  };

  type Former = {
    name?: string;
    positions?: number[];
    type?: number;
    order?: number;
    is_furnish?: number;
    is_enable?: number;
    is_public?: number;
  };

  type Loading = {
    confirmed?: boolean;
    floor?: boolean;
    type?: boolean;
  };

  type Filter = {
    building?: number;
  };
}
