
// WaterfallContainer.tsx
import React, { useRef } from 'react';
import { CommonComponentProps } from '../../interface';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { Waterfall } from './Waterfall'; 
import type { DroppedItem } from '../../../type/DroppedItem';
import { UnsplashImage } from './Waterfall'; // 导入 UnsplashImage 类型

const WaterfallContainer = ({
  id,
  name,
  styles,
  items, // 保留items属性
  waterfallType = 'column',
  columnWidth,
  gapSize,
  maxColumns,
}: CommonComponentProps & {
  items: UnsplashImage[]; // 根据实际使用的项类型进行调整
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
        backgroundColor: styles?.backgroundColor || '#fff',
        borderRadius: styles?.borderRadius || '8px',
        boxShadow: styles?.boxShadow || '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: styles?.border || '1px solid #ddd',
        width: styles?.width || '100%',
        height: styles?.height || 'auto',
        padding: '20px',
        minHeight: '100px',
        ...styles,
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Waterfall
        waterfallType={waterfallType}
        items={items} // 直接传递items
        columnWidth={columnWidth}
        gapSize={gapSize}
        maxColumns={maxColumns}
      />
    </div>
  );
};

export default WaterfallContainer;
