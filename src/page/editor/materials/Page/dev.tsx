// src/components/Page.tsx
import React from 'react';
import { CommonComponentProps } from "../../interface";
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

function Page({ id, name, children, styles }: CommonComponentProps) {
    const { handleDragOver, handleDrop } = useDragAndDrop(id);
    return (
        <div
            className='p-[20px] h-full w-full flex items-center justify-center'
            style={{ ...styles }} // 自定义样式
            onDragOver={handleDragOver} // 允许拖拽进入
            onDrop={handleDrop} // 处理放置事件
        >
            {children}
        </div>
    );
}

export default Page;
