import { useDrag } from 'react-dnd';
import { useMaterailDrop } from '../../hooks/useMaterailDrop';
import { CommonComponentProps } from '../../interface';
import { useEffect, useRef } from 'react';
import useComponentsDrop from '../../stores/components-drop';
import {Space as AntdSpace} from 'antd'
const Space = ({ id, name, children, styles ,size}: CommonComponentProps) => {
    const { components } = useComponentsDrop();
    const {canDrop, drop } = useMaterailDrop([...components], id);
    
    const divRef = useRef<HTMLDivElement>(null);

    const [_, drag] = useDrag({
        type: name,
        item: {
            type: name,
            dragType: 'move',
            id: id
        }
    });

    useEffect(() => {
        drop(divRef);
        drag(divRef);
    }, []);
    
    return (
        <div 
            data-component-id={id}
            ref={divRef}
            style={styles}
            className={`min-h-[100px] p-[20px] ${ canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}`}
        >
            <AntdSpace size={size}>
                {children}
            </AntdSpace>
        </div>
    )
}

export default Space;