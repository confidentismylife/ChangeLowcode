import React, { ReactNode } from 'react';
import { Card as AntdCard, Avatar } from 'antd';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';

const { Meta } = AntdCard;

interface CardProps {
  title?: string;
  extra?: string;
  style?: React.CSSProperties;
  bordered?: boolean;
  cover?: string;
  actions?: ReactNode[];
  avatar?: string;
  description?: string;
}

function Card({
  title = '默认标题', // 默认标题
  extra = 'https://example.com+更多信息', // 默认 extra
  style = {}, // 默认样式为空对象
  bordered = true, // 默认边框为 true
  cover = 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png', // 默认封面图片
  actions = [
    // 默认操作按钮
    <SettingOutlined key="setting" />,
    <EditOutlined key="edit" />,
    <EllipsisOutlined key="ellipsis" />,
  ],
  avatar = 'https://api.dicebear.com/7.x/miniavs/svg?seed=8', // 默认头像
  description = '这是默认描述', // 默认描述
}: Partial<CardProps>) {
  const parseExtra = (extra?: string) => {
    if (!extra) return null;
    const [url, value] = extra.split('+');
    return { url, value };
  };

  const extraContent = parseExtra(extra);

  return (
    <AntdCard
      title={title}
      cover={cover ? <img alt="cover" src={cover} /> : null}
      actions={actions}
      extra={
        extraContent ? (
          <a href={extraContent.url} style={{ color: 'blue' }}>
            {extraContent.value}
          </a>
        ) : null
      }
      style={{ width: 300, ...style }} // 设置默认宽度为 300
      bordered={bordered}
    >
      {avatar && <Meta avatar={<Avatar src={avatar} />} title={title} description={description} />}
    </AntdCard>
  );
}

export default Card;
