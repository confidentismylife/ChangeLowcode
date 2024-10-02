import { useDrag } from 'react-dnd';
import { useMaterailDrop } from '../../hooks/useMaterailDrop';
import { CommonComponentProps } from '../../interface';
import { useEffect, useRef } from 'react';
import useComponentsDrop from '../../stores/components-drop';

// 用于合并多个 ref 的工具函数
const mergeRefs = (...refs: any[]) => (element: any) => {
  refs.forEach(ref => {
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  });
};

const Container = ({ id, name, children, styles }: CommonComponentProps) => {
    const { components } = useComponentsDrop();
    // 使用 useMaterailDrop 钩子
    const { canDrop, drop } = useMaterailDrop([...components], id);
    
    // 用于指向容器的 ref
    const divRef = useRef<HTMLDivElement>(null);

    // 使用 useDrag 钩子
    const [_, drag] = useDrag({
        type: name,
        item: {
            type: name,
            dragType: 'move',
            id: id
        }
    });

    useEffect(() => {
        // 将 drop 和 drag 结合到同一个 ref 上
        const combinedRef = mergeRefs(divRef, drop, drag);
        combinedRef(divRef.current);
    }, [drop, drag]);

    return (
        <div 
            data-component-id={id}
            ref={divRef} // 这里绑定 divRef 到容器
            style={styles}
            className={`min-h-[100px] p-[20px] ${canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}`}
        >
            {children}
        </div>
    );
};

export default Container;
