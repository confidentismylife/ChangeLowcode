import React, { useRef } from 'react';

export interface MaterialItemProps {
    name: string;
    desc: string;
}
interface DroppedItem {
    id?: number;  // 组件ID
    name: string;  // 组件类型
    dragType: 'add' | 'move';  // 拖拽类型
}


// MaterialItem.tsx remains unchanged
export function MaterialItem(props: MaterialItemProps) {
    const { name, desc } = props;
    const itemRef = useRef<HTMLDivElement>(null);
    const ppp: DroppedItem = {
        name: name,
        dragType: 'add',
    };
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(ppp));
    };

    return (
        <div
            ref={itemRef}
            draggable
            onDragStart={handleDragStart}
            className='
                border
                border-gray-300
                w-24
                h-14
                p-2
                m-1
                cursor-move
                inline-flex
                flex-col
                justify-center
                items-center
                bg-white
                rounded-md
                shadow-sm
                transition-transform
                transform-gpu
                hover:shadow-md
                hover:scale-105
                hover:bg-gray-100
                text-center
            '
        >
            <div className="text-xs font-medium text-gray-800">
                {name}
            </div>
            <div className="text-xxs text-gray-500 mt-1">
                {desc}
            </div>
        </div>
    );
}
