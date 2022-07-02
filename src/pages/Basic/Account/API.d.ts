declare namespace APIAccount {
  type Editor = {
    avatar?: string;
    nickname?: string;
    mobile?: string;
    email?: string;
    password?: string;
  };

  type Former = {
    avatar?: any[];
    username?: string;
    nickname?: string;
    mobile?: string;
    email?: string;
    password?: string;
  };

  type Loading = {
    confirm?: boolean;
    upload?: boolean;
  };
}
