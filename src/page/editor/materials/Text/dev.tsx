import { useEffect, useRef } from "react";
import useComponentsDrop from "../../stores/components-drop";
import { useMaterailDrop } from "../../hooks/useMaterailDrop";
import { CommonComponentProps } from "../../interface";
import { useDrag } from "react-dnd";

interface TextProps extends CommonComponentProps {
    text?: string;
    wrap?: boolean; // 新增 wrap 属性
}

const Text = ({ id, name, children, styles, text = '我是默认的数据文本', wrap = false }: TextProps) => {
    const { components } = useComponentsDrop();
    const { canDrop, drop } = useMaterailDrop([...components], id);

    const ref = useRef<HTMLDivElement>(null);
    const [_, drag] = useDrag({
        type: name,
        item: {
            type: name,
            dragType: 'move',
            id: id
        }
    });

    useEffect(() => {
        if (ref.current) {
            drag(ref.current);
            drop(ref.current);
        }
    }, [drag, drop]);

    const mergedStyles = {
        ...styles,
        maxWidth: '100%', // 最大宽度为父元素的宽度
        whiteSpace: wrap ? 'normal' : 'nowrap', // 根据 wrap 属性决定是否换行
        overflow: wrap ? 'visible' : 'hidden', // 根据 wrap 属性决定是否隐藏溢出内容
        textOverflow: wrap ? 'clip' : 'ellipsis', // 根据 wrap 属性决定是否显示省略号
        overflowWrap: wrap ? 'break-word' : 'normal', // 根据 wrap 属性决定是否自动换行
    };

    return (
        <div
            data-component-id={id}
            ref={ref}
            style={mergedStyles}
            className="p-2"
        >
            {text}
        </div>
    );
}

export default Text;