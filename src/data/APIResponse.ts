// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-namespace
declare namespace APIResponse {

  type Response<T> = {
    code: number;
    message: string;
    data: T;
  }


  type Paginate<T> = {
    code: number;
    message: string;
    data: {
      size: number;
      page: number;
      total: number;
      data?: T
    };
  }

  type Online = {
    id?: number;
    name?: string;
  }

}