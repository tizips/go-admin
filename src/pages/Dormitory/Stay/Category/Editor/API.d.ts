declare namespace APIStayCategory {

  type Props = {
    visible?: boolean;
    params?: APIStayCategories.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  }

  type Editor = {
    name?: string;
    order?: number;
    is_temp?: number;
    is_enable?: number;
  }

  type Former = {
    name?: string;
    order?: number;
    is_temp?: number;
    is_enable?: number;
  }

  type Loading = {
    confirmed?: boolean;
  }

}