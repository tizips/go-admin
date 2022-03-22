declare namespace APIAssetPackage {
  type Props = {
    visible?: boolean;
    params?: APIAssetPackages.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    name?: string;
    devices?: { device?: number; number?: number }[];
  };

  type Former = {
    name?: string;
    devices?: { device?: number[]; number?: string }[];
  };

  type Loading = {
    category?: boolean;
    confirmed?: boolean;
  };

  type Devices = {
    id?: number;
    name?: string;
    isLeaf?: boolean;
    loading?: boolean;
    children?: Devices[];
  };
}
