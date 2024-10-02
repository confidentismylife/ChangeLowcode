
import { CommonComponentProps } from '../../interface';

import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import type{ DroppedItem } from '../../../type/DroppedItem'
function Modal({ id, children, title, styles ,name }: CommonComponentProps) {
    const { handleDragOver, handleDrop } = useDragAndDrop(id); // 获取拖拽处理方法
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
            style={styles}
            draggable
            onDragStart={handleDragStart}
            data-component-id={id}  
            className={`min-h-[100px] p-[20px]`}
            onDragOver={handleDragOver} // 处理拖拽进入事件
            onDrop={handleDrop} // 处理放置事件
        >
            <h4>{title}</h4>
            <div>
                {children}
            </div>
        </div>
    );
}

export default Modal;
