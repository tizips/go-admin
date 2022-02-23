declare namespace APIAccount {

  type Editor = {
    avatar?: string;
    nickname?: string;
    mobile?: string;
    email?: string;
    password?: string;
  }

  type Former = {
    avatar?: string;
    username?: string;
    nickname?: string;
    mobile?: string;
    email?: string;
    password?: string;
  }

  type Validators = {
    avatar?: API.Validator;
  }

  type Loading = {
    confirm?: boolean;
    upload?: boolean;
  }
}