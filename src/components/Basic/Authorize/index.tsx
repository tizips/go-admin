import { useModel } from '@@/plugin-model/useModel';

const Authorize = (props: APIAuthorize.Props) => {
  const { initialState } = useModel('@@initialState');

  return initialState?.permissions && initialState.permissions.indexOf(props.permission) >= 0
    ? props.children || <></>
    : props.fallback || <></>;
};

export default Authorize;
