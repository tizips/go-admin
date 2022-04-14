import { Tag } from 'antd';

const Enable = (props: APIEnable.Props) => {
  return (
    <Tag color={props.is_enable === 1 ? '#87d068' : '#f50'}>
      {props.is_enable === 1 ? '启用' : '禁用'}
    </Tag>
  );
};

export default Enable;
