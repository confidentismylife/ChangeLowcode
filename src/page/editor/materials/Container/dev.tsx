import React, { useRef } from 'react';
import { CommonComponentProps } from '../../interface';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import type { DroppedItem } from '../../../type/DroppedItem';

const Container = ({ id, name, children, styles }: CommonComponentProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { handleDragOver, handleDrop } = useDragAndDrop(id);

  const ppp: DroppedItem = {
    id: id,
    name: name,
    dragType: 'move',
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(ppp));
  };

  return (
    <div
      data-component-id={id}
      ref={divRef}
      draggable
      onDragStart={handleDragStart}
      style={{
        backgroundColor: styles?.backgroundColor || '#fff', // 默认白色背景
        borderRadius: styles?.borderRadius || '8px', // 默认圆角
        boxShadow: styles?.boxShadow || '0 4px 6px rgba(0, 0, 0, 0.1)', // 默认阴影
        border: styles?.border || '1px solid #ddd', // 默认边框
        width: styles?.width || '20%', // 默认宽度
        height: styles?.height || 'auto', // 默认高度
        padding: '20px', // 内边距
        minHeight: '100px', // 最小高度
        ...styles, // 允许传入自定义样式覆盖
      }}
      className={`p-[20px] border-[#000]`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

export default Container;
