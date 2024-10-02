import { Form as AntdForm, Input } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop'; // 使用自定义的拖放 hook
import { CommonComponentProps } from '../../interface';
import type{ DroppedItem } from '../../../type/DroppedItem'
function Form({ id, name, children, onFinish }: CommonComponentProps) {
    const [form] = AntdForm.useForm();
    const divRef = useRef<HTMLDivElement>(null);

    // 使用自定义的拖放逻辑
    const { handleDragOver, handleDrop } = useDragAndDrop(id);

    // 处理表单项
    const formItems = useMemo(() => {
        return React.Children.map(children, (item: any) => {
            return {
                label: item.props?.label,
                name: item.props?.name,
                type: item.props?.type,
                id: item.props?.id,
            };
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
            className={`w-full p-4 min-h-[100px]`}
            ref={divRef}
            draggable
            onDragStart={handleDragStart}
            data-component-id={id}
            onDragOver={handleDragOver} // 处理拖拽进入事件
            onDrop={handleDrop} // 处理放置事件
        >
            <AntdForm
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                form={form}
                onFinish={(values) => {
                    onFinish && onFinish(values);
                }}
            >
                {formItems.map((item: any) => (
                    <AntdForm.Item key={item.name} data-component-id={item.id} name={item.name} label={item.label}>
                        <Input style={{ pointerEvents: 'none' }} />
                    </AntdForm.Item>
                ))}
            </AntdForm>
        </div>
    );
}

export default Form;
