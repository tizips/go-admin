declare namespace APISiteArchitectureModule {
  type Props = {
    visible?: boolean;
    params?: APISiteArchitectureModules.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    slug?: string;
    name?: string;
    order?: number;
    is_enable?: number;
  };

  type Former = {
    slug?: string;
    name?: string;
    order?: number;
    is_enable?: number;
  };

  type Loading = {
    confirmed?: boolean;
  };
}
