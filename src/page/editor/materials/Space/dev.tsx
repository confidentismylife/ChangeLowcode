
import { CommonComponentProps } from '../../interface';
import { useEffect, useRef } from 'react';
import useComponentsDrop from '../../stores/components-drop';
import { Space as AntdSpace } from 'antd';
import { useDragAndDrop } from '../../hooks/useDragAndDrop'; // 导入自定义的拖放 Hook
import type{ DroppedItem } from '../../../type/DroppedItem'
const Space = ({ id, name, children, styles, size }: CommonComponentProps) => {
    const { components } = useComponentsDrop();

    const { handleDragOver, handleDrop } = useDragAndDrop(id); // 使用自定义的拖放处理方法

    const divRef = useRef<HTMLDivElement>(null);

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
            ref={divRef}
            draggable
            onDragStart={handleDragStart}
            style={styles}
            className={`min-h-[100px] p-[20px]'`}
            onDragOver={handleDragOver} // 处理拖拽进入事件
            onDrop={handleDrop} // 处理放置事件
        >
            <AntdSpace size={size}>
                {children}
            </AntdSpace>
        </div>
    );
};

export default Space;
