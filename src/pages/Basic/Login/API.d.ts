declare namespace APILogin {

  type Login = {
    username?: string;
    password?: string;
  }

  type Response = {
    token: string;
    expire_at: number;
  }

}