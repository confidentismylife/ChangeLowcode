import React, { useCallback } from 'react';
import { CommonComponentProps } from "../../interface";
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

function Page({ id, name, children, styles }: CommonComponentProps) {
    const { handleDragOver, handleDrop } = useDragAndDrop(id);

    // 网格大小
    const gridSize = 20;

    // 吸附网格对齐的逻辑
    const snapToGrid = useCallback((x: number, y: number) => {
        const snappedX = Math.max(0, Math.round(x / gridSize) * gridSize);
        const snappedY = Math.max(0, Math.round(y / gridSize) * gridSize);
        return [snappedX, snappedY];
    }, [gridSize]);

    // 自定义处理 drop 事件，并应用网格吸附
    const handleDropWithGrid = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        // 获取当前的鼠标位置
        const x = event.clientX;
        const y = event.clientY;

        // 吸附到最近的网格点
        const [snappedX, snappedY] = snapToGrid(x, y);

        console.log(`Snapped position: X=${snappedX}, Y=${snappedY}`);

        // 调用原始的 handleDrop 方法处理组件放置
        handleDrop(event); // 传递原始的事件对象
    }, [handleDrop, snapToGrid]);

    return (
        <div
            className='p-[20px] h-full w-full flex items-center justify-center'
            style={{
                ...styles,
                backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px),
                                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)`,
                backgroundSize: `${gridSize}px ${gridSize}px`,
            }} 
            onDragOver={handleDragOver}
            onDrop={handleDropWithGrid}
        >
            {children}
        </div>
    );
}

export default Page;
