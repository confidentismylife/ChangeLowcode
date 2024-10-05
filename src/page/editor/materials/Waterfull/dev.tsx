import React, { useRef } from 'react';
import { CommonComponentProps } from '../../interface';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { Waterfall } from './Waterfall'; // 确保导入您之前实现的 Waterfall 组件
import type { DroppedItem } from '../../../type/DroppedItem';

const WaterfallContainer = ({
  id,
  name,
  styles,
  items,
  waterfallType = 'column', // 默认使用列式布局
  columnWidth,
  gapSize,
  maxColumns,
}: CommonComponentProps & {
  items: any[]; // 根据实际使用的项类型进行调整
  waterfallType?: 'column' | 'flex' | 'grid' | 'js';
  columnWidth?: number;
  gapSize?: number;
  maxColumns?: number;
}) => {
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
        width: styles?.width || '100%', // 默认宽度
        height: styles?.height || 'auto', // 默认高度
        padding: '20px', // 内边距
        minHeight: '100px', // 最小高度
        ...styles, // 允许传入自定义样式覆盖
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Waterfall
        waterfallType={waterfallType}
        items={items}
        columnWidth={columnWidth}
        gapSize={gapSize}
        maxColumns={maxColumns}
      />
    </div>
  );
};

export default WaterfallContainer;
