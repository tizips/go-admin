declare namespace APIData {
  type Paginate = {
    size?: number;
    page?: number;
    total?: number;
  };

  type Tree = {
    id?: number;
    object?: string;
    name?: string;
    disabled?: boolean;
    isLeaf?: boolean;
    children?: Tree[];
  };

  type Online = {
    id?: number;
    name?: string;
  };
}
