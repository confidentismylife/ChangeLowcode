import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../stores/component-config";
import { getComponentById, useComponetsStore } from "../stores/components";
import { useRef } from "react";

export interface ItemType {
  type: string;
  dragType?: 'move' | 'add',
  id: number
}

export function useMaterailDrop(accept: string[], id: number) {
    const { addComponent, deleteComponent, components } = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();

    const targetRef = useRef<HTMLDivElement>(null);

    const [{ canDrop }, drop] = useDrop(() => ({
        accept,
        drop: (item: ItemType, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) {
              return;
            }

            // 获取要放置的目标对象的信息（使用 id 参数）
            console.log('Dropping into target with id:', id);

            // 获取拖拽的物品的信息
            const droppedItem = monitor.getItem();
            console.log('Dropped item:', droppedItem);

            // 获取鼠标相对于视口的坐标
            const clientOffset = monitor.getClientOffset();
            if (clientOffset) {
                const relativeX = clientOffset.x; // 相对于视口的 x 坐标
                const relativeY = clientOffset.y; // 相对于视口的 y 坐标
                console.log(`Mouse position relative to viewport: x=${relativeX}, y=${relativeY}`);
                
                // 添加组件并包含相对坐标
                if (droppedItem.dragType === 'move') {
                    const component = getComponentById(droppedItem.id, components)!;
                    deleteComponent(droppedItem.id);
                    addComponent({
                        ...component,
                        x: relativeX,
                        y: relativeY,
                    }, id);
                } else {
                    const config = componentConfig[droppedItem.type];
                    if (config) {
                        addComponent({
                            id: new Date().getTime(),
                            name: droppedItem.type,
                            desc: config.desc,
                            props: config.defaultProps,
                            x: relativeX,
                            y: relativeY,
                        }, id);
                    } else {
                        console.error(`Component config for type ${droppedItem.type} is undefined`);
                    }
                }
            }
        },
        collect: (monitor) => ({
          canDrop: monitor.canDrop(),
        }),
    }));

    return { canDrop, drop, targetRef };
}
