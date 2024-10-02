import { useRef, useState } from "react";

import { CommonComponentProps } from "../../interface";
import type { DroppedItem } from '../../../type/DroppedItem';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css'; // 引入 Resizable 样式
import './Image.css'; // 引入 CSS 样式

interface ImageProps extends CommonComponentProps {
    alt?: string;
    fallback?: string;
    height?: string | number;
    placeholder?: React.ReactNode;
    preview?: boolean | PreviewType;
    src: string;
    width?: string | number;
    onError?: React.ReactEventHandler<HTMLImageElement>;
}

type PreviewType = {
    visible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    getContainer?: () => HTMLElement;
};

const Image = ({
    id,
    name,
    styles,
    alt,
    fallback,
    height = '200px', // 默认高度
    placeholder,
    preview = true,
    src,
    width = '300px', // 默认宽度
    onError,
}: ImageProps) => {
    const [srcc, setSrcc] = useState<string>(src || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png');
    const imgRef = useRef<HTMLDivElement>(null); // 绑定到 div，而不是 img
    const [resizableWidth, setWidth] = useState<number>(typeof width === 'number' ? width : 300);
    const [resizableHeight, setHeight] = useState<number>(typeof height === 'number' ? height : 200);
    const [isResizing, setIsResizing] = useState(false); // 控制是否正在调整大小

    const ppp: DroppedItem = {
        id: id,
        name: name,
        dragType: 'move',
    };
    
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(ppp)); // 设置拖拽数据
        console.log(132133131231)
    };

    const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
        if (onError) {
            onError(event);
        }
        if (fallback && imgRef.current) {
            (imgRef.current.firstChild as HTMLImageElement).src = fallback; // 修改为正确的 img 元素
        }
    };

    const handleResizeStart = () => {
        setIsResizing(true); // 鼠标按下时开始调整大小
    };

    const handleResizeStop = () => {
        setIsResizing(false); // 鼠标松开时停止调整大小
    };

    const handleResize = (event: any, { size }: { size: { width: number, height: number } }) => {
        if (isResizing) { // 仅当鼠标按下时允许调整大小
            setWidth(size.width);
            setHeight(size.height);
        }
    };

    const mergedStyles = {
        ...styles,
        display: 'inline-block',
        padding: '4px',
        transition: 'width 0.3s ease, height 0.3s ease', // 添加平滑过渡动画
    };

    return (
        <div
            data-component-id={id}
            ref={imgRef} // 将 ref 绑定到 div，而不是 img
            draggable // 使 div 可拖拽
            onDragStart={handleDragStart} // 处理拖动事件
            style={{ ...mergedStyles, width: resizableWidth, height: resizableHeight }} // 使用动态宽高
        >
            <img
                src={srcc}
                alt={alt}
                onError={handleError}
                style={{ width: '100%', height: '100%' }} // 图片填满父容器
            />
        </div>
    );
};

export default Image;
