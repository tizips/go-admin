declare namespace APISiteArticle {
  export type Props = {
    visible?: boolean;
    params?: APISiteArticles.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  }

  export type Editor = {
    category?: number;
    name?: string;
    picture?: string;
    title?: string;
    keyword?: string;
    description?: string;
    source_name?: string;
    source_uri?: string;
    is_comment?: number;
    is_enable?: number;
    content?: any;
  }

  export type Former = {
    category?: number[];
    name?: string;
    picture?: string[];
    title?: string;
    keyword?: string;
    description?: string;
    source_name?: string;
    source_uri?: string;
    is_comment?: number;
    is_enable?: number;
    content?: any;
  }

  type Information = {
    id?: number;
    category?: number[];
    name?: string;
    picture?: string;
    title?: string;
    keyword?: string;
    description?: string;
    source_name?: string;
    source_uri?: string;
    is_comment?: number;
    is_enable?: number;
    content?: any;
  }

  export type Category = {
    id: number;
    name?: string;
    is_enable?: number;
    children?: Category;
  }

  export type Loading = {
    confirmed?: boolean;
    category?: boolean;
    upload?: boolean;
    information?: boolean;
  }

  type Validators = {
    picture?: API.Validator;
  }
}