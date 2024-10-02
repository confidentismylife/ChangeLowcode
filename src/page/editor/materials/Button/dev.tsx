// src/components/Button.tsx
import React, { useEffect, useRef, useMemo, Suspense } from 'react';
import { Button as AntdButton } from 'antd';
import { CommonComponentProps } from '../../interface';

interface DroppedItem {
  id?: number; // 组件ID
  name: string;
  dragType: 'add' | 'move'; // 拖拽类型
}

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

  // 使用 useMemo 来动态引入图标组件
  const IconComponent = useMemo(() => {
    if (icon) {
      return React.lazy(() =>
        import(`@ant-design/icons`).then((icons) => ({ default: icons[icon] }))
      );
    }
    return null;
  }, [icon]);

  const ppp: DroppedItem = {
    id: id,
    name: type,
    dragType: 'move',
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(ppp)); // 设置拖拽数据
    console.log('开始', event);
  };

  return (
    <div
    data-component-id={id}
      ref={buttonRef}
      draggable
      onDragStart={handleDragStart}
      style={{ display: 'inline-block' }} // Make sure the button can be dragged
    >
      <Suspense fallback={<div>Loading...</div>}>
        <AntdButton
          type={type}
          style={styles}
          color={color}
          size={size}
          icon={IconComponent ? <IconComponent /> : null} // Ensure IconComponent is in scope
        >
          {text}
        </AntdButton>
      </Suspense>
    </div>
  );
};

export default Button;
