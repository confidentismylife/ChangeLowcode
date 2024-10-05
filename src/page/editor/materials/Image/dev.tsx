import { useRef, useState, useEffect } from "react";
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
    styles?: React.CSSProperties; // 添加 styles 属性以接收外部样式
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
    placeholder,
    preview = true,
    src,
    onError,
}: ImageProps) => {
    const [srcc, setSrcc] = useState<string>(src || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png');
    const imgRef = useRef<HTMLDivElement>(null);
    const [resizableWidth, setWidth] = useState<number>(300); // 默认宽度
    const [resizableHeight, setHeight] = useState<number>(200); // 默认高度
    const [isResizing, setIsResizing] = useState(false);
    
    useEffect(() => {
        console.log('图片');
        console.log(styles);
    }, [styles]);
    
    const ppp: DroppedItem = {
        id: id,
        name: name,
        dragType: 'move',
    };
    
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(ppp));
    };

    const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
        if (onError) {
            onError(event);
        }
        if (fallback && imgRef.current) {
            (imgRef.current.firstChild as HTMLImageElement).src = fallback;
        }
    };

    const handleResizeStart = () => {
        setIsResizing(true);
    };

    const handleResizeStop = () => {
        setIsResizing(false);
    };

    const handleResize = (event: any, { size }: { size: { width: number, height: number } }) => {
        if (isResizing) {
            setWidth(size.width);
            setHeight(size.height);
        }
    };

    // 优先使用 styles 中的宽和高
    useEffect(() => {
        if (styles) {
            if (styles.width) {
                setWidth(typeof styles.width === 'number' ? styles.width : parseFloat(styles.width));
            }
            if (styles.height) {
                setHeight(typeof styles.height === 'number' ? styles.height : parseFloat(styles.height));
            }
        }
    }, [styles]);

    return (
        <div
            data-component-id={id}
            ref={imgRef}
            draggable
            onDragStart={handleDragStart}
            style={{
                ...styles, // 合并外部样式
                display: 'inline-block',
                padding: '4px',
                transition: 'width 0.3s ease, height 0.3s ease',
                width: resizableWidth, // 使用更新后的宽度
                height: resizableHeight, // 使用更新后的高度
            }} // 使用合并后的样式
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
