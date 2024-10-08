import React, { useCallback, useEffect, useState } from 'react';
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

    // 位置和缩放状态
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);
    const [scale, setScale] = useState(1);

    // 自定义处理 drop 事件，并应用网格吸附
    const handleDropWithGrid = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        // 获取当前的鼠标位置
        const x = event.clientX - event.currentTarget.getBoundingClientRect().left;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().top;

        // 吸附到最近的网格点
        const [snappedX, snappedY] = snapToGrid(x, y);

        console.log(`Snapped position: X=${snappedX}, Y=${snappedY}`);

        // 调用原始的 handleDrop 方法处理组件放置
        handleDrop(event); // 传递原始的事件对象
    }, [handleDrop, snapToGrid]);

    // 鼠标滚轮事件处理缩放
    const handleWheel = (event) => {
        event.preventDefault();
        if (event.ctrlKey) {
            setScale(prevScale => {
                let newScale = prevScale + (event.deltaY > 0 ? -0.1 : 0.1);
                return Math.max(0.5, Math.min(newScale, 2));
            });
        }
    };

    // 拖拽处理
    const handleMouseDown = (event) => {
        const startX = event.clientX;
        const startY = event.clientY;

        const onMouseMove = (e) => {
            setPosX(prevX => prevX + (startX - e.clientX));
            setPosY(prevY => prevY + (startY - e.clientY));
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div
            
            className='p-[20px] h-full w-full flex items-center justify-center'
            style={{
                ...styles,
                backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px),
                                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)`,
                backgroundSize: `${gridSize}px ${gridSize}px`,
                transform: `translate(${posX}px, ${posY}px) scale(${scale})`,
                transition: 'transform 0.2s ease',
            }} 
            onDragOver={handleDragOver}
            onDrop={handleDropWithGrid}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
        >
            {children}
        </div>
    );
}

export default Page;
