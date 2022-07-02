declare namespace APIDormitoryBasicType {
  type Props = {
    visible?: boolean;
    params?: APIDormitoryBasicTypes.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    name?: string;
    beds?: { name?: string; is_public?: number }[];
    order?: number;
    is_enable?: number;
  };

  type Former = {
    name?: string;
    beds?: { name?: string; is_public?: number }[];
    order?: number;
    is_enable?: number;
  };

  type Loading = {
    confirmed?: boolean;
  };
}
