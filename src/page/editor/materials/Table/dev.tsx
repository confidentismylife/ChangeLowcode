import { Table as AntdTable } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { CommonComponentProps } from '../../interface';
import type{ DroppedItem } from '../../../type/DroppedItem'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'; // 导入自定义的拖放 Hook

function Table({ id, name, children, styles }: CommonComponentProps) {

    const { handleDragOver, handleDrop } = useDragAndDrop(id); // 使用自定义的拖放处理方法

    const divRef = useRef<HTMLDivElement>(null);



    const columns = useMemo(() => {
        return React.Children.map(children, (item: any) => {
            return {
                title: <div className='m-[-16px] p-[16px]' data-component-id={item.props?.id}>{item.props?.title}</div>,
                dataIndex: item.props?.dataIndex,
                key: item.props?.id // 使用 item.props?.id 作为 key
            }
        });
    }, [children]);
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
            className={`w-[100%]`}
            ref={divRef}
            data-component-id={id}
            draggable
            onDragStart={handleDragStart}
            style={styles}
            onDragOver={handleDragOver} // 处理拖拽进入事件
            onDrop={handleDrop} // 处理放置事件
        >
            <AntdTable
                columns={columns}
                dataSource={[]} // 根据需要填充数据源
                pagination={false}
            />
        </div>
    );
}

export default Table;
