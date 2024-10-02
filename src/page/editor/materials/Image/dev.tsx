import { useEffect, useRef, useState } from "react";
import useComponentsDrop from "../../stores/components-drop";
import { useMaterailDrop } from "../../hooks/useMaterailDrop";
import { CommonComponentProps } from "../../interface";
import { useDrag } from "react-dnd";
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
    const { components } = useComponentsDrop();
    const { canDrop, drop } = useMaterailDrop([...components], id);
    const [srcc, setSrcc] = useState<string>(src || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png');
    const imgRef = useRef<HTMLImageElement>(null);
    const [resizableWidth, setWidth] = useState<number>(typeof width === 'number' ? width : 300);
    const [resizableHeight, setHeight] = useState<number>(typeof height === 'number' ? height : 200);
    const [isResizing, setIsResizing] = useState(false); // 控制是否正在调整大小
    const [_, drag] = useDrag({
        type: name,
        item: {
            type: name,
            dragType: 'move',
            id: id
        }
    });

    useEffect(() => {
        if (imgRef.current) {
            drag(imgRef.current);
            drop(imgRef.current);
        }
    }, [drag, drop]);

    const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
        if (onError) {
            onError(event);
        }
        if (fallback && imgRef.current) {
            imgRef.current.src = fallback;
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
        <Resizable
            width={resizableWidth}
            height={resizableHeight}
            onResize={handleResize}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
            resizeHandles={['se']} // 设置调整大小的句柄位置
        >
            <div
                data-component-id={id}
                ref={imgRef}
                className={`img-container ${isResizing ? 'resizing' : ''}`} // 按下时添加 'resizing' 类
                style={{ ...mergedStyles, width: resizableWidth, height: resizableHeight }}
            >
                <img
                    src={srcc}
                    alt={alt}
                    onError={handleError}
                    style={{ width: '100%', height: '100%' }}
                />
                {placeholder && <div>{placeholder}</div>}
            </div>
        </Resizable>
    );
};

export default Image;
