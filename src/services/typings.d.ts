// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Account = {
    username?: string;
    nickname?: string;
    avatar?: string;
    email?: string;
    signature?: string;
    title?: string;
    mobile?: string;
  };

  type Module = {
    id: number;
    slug: string;
    name: string;
  };

  type Upload = {
    name?: string;
    url?: string;
  };

  type Validator = {
    status?: 'success' | 'validating' | 'warning' | 'error';
    message?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
