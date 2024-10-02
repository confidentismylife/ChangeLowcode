import React, { useEffect, useRef, useMemo } from 'react';
import { Button as AntdButton } from 'antd';
import { CommonComponentProps } from '../../interface';
import { DroppedItem } from '../../../type/DroppedItem';
import * as AntdIcons from '@ant-design/icons'; // 引入所有图标

const Button = ({
  id,
  type,
  text,
  styles,
  icon,
  size,
  color,
}: CommonComponentProps & {
  onDragEnd: (id: string, position: { x: number; y: number }) => void;
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('buttonRef');
    console.log(id);
  }, []);

  const renderIcon = () => {
    if (icon) {
      // 去掉 <, > 和 /，只保留字母和数字
      const iconName = icon.replace(/[<>\s/]/g, ''); // 去掉 <, > 和 /
      const IconComponent = AntdIcons[iconName]; // 从 AntdIcons 中获取对应的图标组件
      return IconComponent ? <IconComponent /> : null;
    }
    return null;
  };

  const ppp: DroppedItem = {
    id: id,
    name: type,
    dragType: 'move',
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(ppp)); // 设置拖拽数据
  };

  return (
    <div
      ref={buttonRef}
      draggable
      onDragStart={handleDragStart}
      style={{ display: 'inline-block' }} // 确保按钮可被拖拽
    >
      <AntdButton
        data-component-id={id}
        type={type}
        style={styles}
        color={color}
        size={size}
        icon={renderIcon()} // 确保图标组件被渲染
      >
        {text}
      </AntdButton>
    </div>
  );
};

export default Button;
