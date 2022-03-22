declare namespace APIBasicBuilding {
  type Props = {
    visible?: boolean;
    params?: APIBasicBuildings.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    name?: string;
    order?: number;
    is_enable?: number;
    is_public?: number;
  };

  type Former = {
    name?: string;
    order?: number;
    is_enable?: number;
    is_public?: number;
  };

  type Loading = {
    confirmed?: boolean;
  };
}
