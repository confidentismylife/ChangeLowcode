// src/components/Container.tsx
import React, { useRef } from 'react';
import { CommonComponentProps } from '../../interface';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

const Container = ({ id, name, children, styles }: CommonComponentProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const { handleDragOver, handleDrop } = useDragAndDrop(id); // 使用自定义 hook

    // 开始拖拽时触发
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        // 将组件 ID 和类型传递到拖拽数据中
        const draggedItem = JSON.stringify({ id, name, dragType: 'move' });
        event.dataTransfer.setData('text/plain', draggedItem); // 设置拖拽数据
    };

    return (
        <div 
            data-component-id={id}
            ref={divRef} // 绑定 divRef 到容器
            style={styles}
            className={`min-h-[100px] p-[20px] border-[1px] border-[#000]`}
            draggable // 使容器可拖拽
            onDragStart={handleDragStart} // 开始拖拽事件
            onDragOver={handleDragOver} // 允许拖拽进入
            onDrop={handleDrop} // 处理放置事件
        >
            {children}
        </div>
    );
};

export default Container;
