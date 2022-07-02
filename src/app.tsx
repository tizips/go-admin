import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import RightContent from '@/components/Basic/RightContent';
import Footer from '@/components/Basic/Footer';
import { doAccount } from '@/services/account';
import Constants from '@/utils/Constants';
import { notification, Spin } from 'antd';
import defaultSettings from '../config/defaultSettings';
import Header from '@/components/Basic/Header';
import { LoadingOutlined } from '@ant-design/icons';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  account?: API.Account;
  module?: number;
  module_key?: string;
  permissions?: string[];
  toAccount?: () => Promise<any>;
}> {
  Spin.setDefaultIndicator(<LoadingOutlined />);

  const toAccount = async () => {
    try {
      const response = await doAccount();
      if (response.code === Constants.Success) return response.data;
    } catch (error) {
      history.push(Constants.PathLogin);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== Constants.PathLogin) {
    const account = await toAccount();
    return {
      toAccount,
      account,
      settings: { primaryColor: defaultSettings.primaryColor },
    };
  }
  return {
    toAccount,
    settings: { primaryColor: defaultSettings.primaryColor },
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    headerContentRender: () => (initialState?.account ? <Header /> : <></>),
    rightContentRender: () => (initialState?.account ? <RightContent /> : <></>),
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.account?.nickname,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.account && location.pathname !== Constants.PathLogin) {
        history.push(Constants.PathLogin);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;

  /**
   * 未登录，跳转登录页面
   */
  if (response.status === 401) {
    if (localStorage.getItem(Constants.Authorization)) localStorage.clear();
    history.push(Constants.PathLogin);
  } else if (response.status === 403) {
    history.push('/403');
    return response;
  }

  if (response && response.status && response.status !== 401) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status } = response;

    notification.error({
      message: `请求错误 ${status}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const Authorization = localStorage.getItem(Constants.Authorization);

  let headers = {};

  if (Authorization && Authorization !== '') {
    headers = { Authorization: Authorization };
  }

  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers },
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RefreshResponse = (response: Response, options: RequestOptionsInit) => {
  const token = response.headers.get(Constants.Authorization);
  if (token && token != localStorage.getItem(Constants.Authorization))
    localStorage.setItem(Constants.Authorization, token);
  return response;
};

export const request: RequestConfig = {
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [RefreshResponse],
  errorHandler,
};
