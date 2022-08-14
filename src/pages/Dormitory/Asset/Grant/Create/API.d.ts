declare namespace APIDormitoryAssetGrant {
  type Props = {
    visible?: boolean;
    params?: APIDormitoryAssetGrants.Data;
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
    position?: 'types' | 'positions' | 'live';
    positions?: { object?: string; id?: number }[];
    types?: { object?: string; id?: number }[];
    remark?: string;
  };

  type Former = {
    object?: 'package' | 'device';
    package?: number;
    device?: number[];
    number?: string;
    position?: 'types' | 'positions' | 'live';
    positions?: number[][];
    types?: number[][];
    remark?: string;
  };

  type Loading = {
    category?: boolean;
    packages?: boolean;
    buildings?: boolean;
    confirmed?: boolean;
  };
}
