// src/components/Container.tsx
import React, { useRef } from 'react';
import { CommonComponentProps } from '../../interface';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import type{ DroppedItem } from '../../../type/DroppedItem'
const Container = ({ id, name, children, styles }: CommonComponentProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const { handleDragOver, handleDrop } = useDragAndDrop(id); // 使用自定义 hook
    
  const ppp: DroppedItem = {
    id: id,
    name: name,
    dragType: 'move',
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(ppp)); // 设置拖拽数据
  };
    return (
        <div 
            data-component-id={id}
            ref={divRef} // 绑定 divRef 到容器
            draggable
            onDragStart={handleDragStart}
            style={styles}
            className={`min-h-[100px] p-[20px] border-[1px] border-[#000]`}
            onDragOver={handleDragOver} // 允许拖拽进入
            onDrop={handleDrop} // 处理放置事件
        >
            {children}
        </div>
    );
};

export default Container;
