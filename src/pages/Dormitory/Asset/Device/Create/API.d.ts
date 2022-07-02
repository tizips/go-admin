declare namespace APIDormitoryAssetDevice {
  type Props = {
    visible?: boolean;
    params?: APIDormitoryAssetDevices.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    category?: number;
    no?: string;
    name?: string;
    specification?: string;
    stock?: number;
    price?: number;
    unit?: string;
    indemnity?: number;
    remark?: string;
  };

  type Former = {
    category?: number;
    no?: string;
    name?: string;
    specification?: string;
    stock?: number;
    price?: string;
    unit?: string;
    indemnity?: string;
    remark?: string;
  };

  type Loading = {
    category?: boolean;
    confirmed?: boolean;
  };
}
