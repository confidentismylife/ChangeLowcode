import { useEffect, useRef } from "react";

import { CommonComponentProps } from "../../interface";
import { useDrag } from "react-dnd";
import { useDragAndDrop } from "../../hooks/useDragAndDrop"; // 导入自定义的拖放 Hook
import type{ DroppedItem } from '../../../type/DroppedItem'
interface TextProps extends CommonComponentProps {
    text?: string;
    wrap?: boolean; // 新增 wrap 属性
    mode?: 'title' | 'body'; // 新增 mode 属性
    fontColor?: string; // 新增字体颜色属性
    textAlign?: 'left' | 'center' | 'right'; // 新增文本对齐属性
    lineHeight?: number; // 新增行高属性
}

const Text = ({ id, name, styles, text = '我是默认的数据文本', wrap = false, mode = 'body', fontColor = '#000000', textAlign = 'left', lineHeight = 1.5 }: TextProps) => {

    const { handleDragOver, handleDrop } = useDragAndDrop(id); // 使用自定义的拖放处理方法

    const ref = useRef<HTMLDivElement>(null);


    const mergedStyles = {
        ...styles,
        maxWidth: '100%', // 最大宽度为父元素的宽度
        whiteSpace: wrap ? 'normal' : 'nowrap', // 根据 wrap 属性决定是否换行
        overflow: wrap ? 'visible' : 'hidden', // 根据 wrap 属性决定是否隐藏溢出内容
        textOverflow: wrap ? 'clip' : 'ellipsis', // 根据 wrap 属性决定是否显示省略号
        fontSize: mode === 'title' ? '24px' : '16px', // 根据 mode 属性设置字体大小
        fontWeight: mode === 'title' ? 'bold' : 'normal', // 根据 mode 属性设置字体粗细
        color: fontColor, // 根据 fontColor 属性设置字体颜色
        textAlign: textAlign, // 根据 textAlign 属性设置文本对齐方式
        lineHeight: lineHeight, // 根据 lineHeight 属性设置行高
        textIndent: mode === 'body' ? '2em' : '0', // 根据 mode 属性设置文本缩进
    };
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
            ref={ref}
            draggable
            onDragStart={handleDragStart}
            style={mergedStyles}
            className="p-2"
            onDragOver={handleDragOver} // 处理拖拽进入事件
            onDrop={handleDrop} // 处理放置事件
        >
            {text}
        </div>
    );
}

export default Text;
