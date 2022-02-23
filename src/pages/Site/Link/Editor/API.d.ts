declare namespace APISiteLink {
  export type Props = {
    visible?: boolean;
    params?: APISiteLinks.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  }

  export type Editor = {
    name?: string;
    uri?: string;
    admin?: string;
    email?: string;
    logo?: string;
    summary?: string;
    no?: number;
    position?: number;
    is_enable?: number;
  }

  export type Former = {
    name?: string;
    uri?: string;
    admin?: string;
    email?: string;
    picture?: string[];
    summary?: string;
    no?: number;
    position?: number;
    is_enable?: number;
  }

  export type Loading = {
    confirmed?: boolean;
    upload?: boolean;
  }

  type Validators = {
    picture?: API.Validator;
  }
}