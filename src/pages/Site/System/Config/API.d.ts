declare namespace APISiteSystem {
  type Data = {
    type?: string;
    label?: string;
    children?: System[];
  };

  type System = { genre?: string; label?: string; key?: string; val?: string; required?: number };

  type Loading = {
    confirm?: boolean;
  };
}
