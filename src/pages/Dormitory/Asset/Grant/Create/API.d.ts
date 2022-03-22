declare namespace APIAssetGrant {
  type Props = {
    visible?: boolean;
    params?: APIAssetGrants.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    object?: 'package' | 'device';
    package?: number;
    device?: number;
    number?: number;
    position?: 'type' | 'positions';
    positions?: { object?: string; id?: number }[];
    type?: number;
    remark?: string;
  };

  type Former = {
    object?: 'package' | 'device';
    package?: number;
    device?: number[];
    number?: string;
    position?: 'type' | 'positions';
    positions?: number[][];
    type?: number[];
    remark?: string;
  };

  type Loading = {
    category?: boolean;
    packages?: boolean;
    buildings?: boolean;
    confirmed?: boolean;
  };
}
