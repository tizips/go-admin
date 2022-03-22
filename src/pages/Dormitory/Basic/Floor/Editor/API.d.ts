declare namespace APIBasicFloor {
  type Props = {
    visible?: boolean;
    params?: APIBasicFloors.Data;
    building?: number | string;
    buildings?: APIResponse.Online[];
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    name?: string;
    building?: number;
    order?: number;
    is_enable?: number;
    is_public?: number;
  };

  type Former = {
    name?: string;
    building?: number;
    order?: number;
    is_enable?: number;
    is_public?: number;
  };

  type Loading = {
    confirmed?: boolean;
  };
}
