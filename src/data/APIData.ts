// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-namespace
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
}
