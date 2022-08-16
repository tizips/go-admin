declare namespace APISiteManageAdmin {
  type Props = {
    visible?: boolean;
    params?: APISiteManageAdmins.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    username?: string;
    nickname?: string;
    mobile?: string;
    password?: string;
    roles?: number[];
    is_enable?: number;
  };

  type Former = {
    username?: string;
    nickname?: string;
    mobile?: string;
    password?: string;
    roles?: number[];
    is_enable?: number;
  };

  type Role = {
    id: number;
    name?: string;
  };

  type Loading = {
    confirmed?: boolean;
    permission?: boolean;
  };
}
