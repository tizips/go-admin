declare namespace APIBasicBed {

  type Props = {
    visible?: boolean;
    params?: APIBasicBeds.Data;
    building?: number | string;
    buildings?: APIResponse.Online[];
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  }

  type Editor = {
    name?: string;
    room?: number;
    order?: number;
    is_enable?: number;
  }

  type Former = {
    name?: string;
    building?: number;
    floor?: number;
    room?: number;
    order?: number;
    is_enable?: number;
  }

  type Loading = {
    confirmed?: boolean;
    floor?: boolean;
    room?: boolean;
  }

  type Filter = {
    building?: number;
    floor?: number;
  }

}