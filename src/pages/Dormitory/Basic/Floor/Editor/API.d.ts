declare namespace APIDormitoryBasicFloor {
  type Props = {
    visible?: boolean;
    params?: APIDormitoryBasicFloors.Data;
    building?: number | string;
    buildings?: APIData.Online[];
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
