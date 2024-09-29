import { useEffect, useRef, useState } from "react";
import useComponentsDrop from "../../stores/components-drop";
import { useMaterailDrop } from "../../hooks/useMaterailDrop";
import { CommonComponentProps } from "../../interface";
import { useDrag } from "react-dnd";
import { Image as AntdImage } from 'antd';

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
    children,
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
    const [srcc, setSrcc] = useState<string>('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png');

    const imgRef = useRef<HTMLImageElement>(null);
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

    const mergedStyles = {
        ...styles,
        width: width || '40px',
        height: height || '50px',
        display: 'inline-block', // 设置为 inline-block
        padding: '4px', // 设置内边距
    };

    return (
        <div
            data-component-id={id}
            ref={imgRef}
            style={mergedStyles}
          
        >
            <AntdImage
                src={srcc}
                alt={alt}
                onError={handleError}
                height={'150px'}
                width={'180px'}
            />
            {placeholder && <div>{placeholder}</div>}
        </div>
    );
};

export default Image;