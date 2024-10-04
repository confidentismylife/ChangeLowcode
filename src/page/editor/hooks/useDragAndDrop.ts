// src/hooks/useDragAndDrop.ts
import { useCallback } from 'react';
import { useComponetsStore, getComponentById } from '../stores/components';
import { useComponentConfigStore } from '../stores/component-config';
import { useComponentXy } from '../stores/component-xy'; // 导入 useComponentXy

interface DroppedItem {
    id?: number | null; // 组件ID
    name: string;
    dragType: 'add' | 'move'; // 拖拽类型
}

// 吸附阈值（像素）
const SNAP_THRESHOLD = 10;

export function useDragAndDrop(id?: number) {
    const { addComponent, deleteComponent, components } = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();
    const { setXy } = useComponentXy(); // 从 Zustand 中获取 setXy 方法

    const updatePosition = (componentId: number, scrollToplength: number, containerClassName: string) => {
        if (!componentId) return;

        const container = document.querySelector('.edit-area');
        if (!container) return;

        const node = document.querySelector(`[data-component-id="${componentId}"]`);
        if (!node) return;

        const { top, left, width, height } = node.getBoundingClientRect();
        const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

        const labelTop = top - containerTop + container.scrollTop;
        const labelLeft = left - containerLeft + width;
 
        // 存入 Zustand 状态管理库
        setXy({
            top: top - containerTop + container.scrollTop - scrollToplength,
            left: left - containerLeft,
            width: width,
            height: height,
            labelTop: labelTop,
            labelLeft: labelLeft,
        });
    };

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // 允许放置
    }, []);

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // 防止默认行为

        // 获取鼠标的位置
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // 获取 Page 组件的边界信息
        const pageRect = event.currentTarget.getBoundingClientRect();
        const pageX = pageRect.left; // Page 组件左边距
        const pageY = pageRect.top; // Page 组件上边距

        // 计算鼠标相对于 Page 组件的位置
        const relativeX = mouseX - pageX;
        const relativeY = mouseY - pageY;

        // 获取拖拽的元素数据并解析
        const droppedItem: DroppedItem = JSON.parse(event.dataTransfer.getData('text/plain'));

        // 根据拖拽的类型进行处理
        if (droppedItem.dragType === 'move') {
            const component = getComponentById(droppedItem.id, components);

            if (component) {
                // 获取移动组件的宽高
                const componentWidth = component.props.width || 100; // 默认宽度
                const componentHeight = component.props.height || 100; // 默认高度

                // 重新计算相对于 Page 的位置
                const adjustedX = relativeX - componentWidth / 4; // 使鼠标在新组件中心
                const adjustedY = relativeY - componentHeight / 4;

                // 吸附逻辑
                const snapX = Math.round(adjustedX / 10) * 10; // 吸附到最近的 10 像素
                const snapY = Math.round(adjustedY / 10) * 10;

                // 处理边界，确保不会放置在负坐标上
                const boundedX = Math.max(0, snapX);
                const boundedY = Math.max(0, snapY);

                // 处理移动逻辑
                deleteComponent(droppedItem.id); // 删除原组件
                addComponent({
                    ...component,
                    x: boundedX, // 使用调整后的 X 位置
                    y: boundedY, // 使用调整后的 Y 位置
                }, id);
          
                // 更新位置
                updatePosition(droppedItem.id, 0, 'edit-area'); // 传入合适的参数
            } else {
                console.error(`Component with id ${droppedItem.id} not found for move operation.`);
            }
        } else {
            const config = componentConfig[droppedItem.name];
            // 检查 config 是否存在
            if (config) {
                // 获取新组件的宽高
                const componentWidth = config.defaultProps?.width || 100; // 默认宽度
                const componentHeight = config.defaultProps?.height || 100; // 默认高度

                // 计算相对于 Page 的位置以使鼠标在新组件中心
                const adjustedX = relativeX - componentWidth / 4;
                const adjustedY = relativeY - componentHeight / 4;

                // 吸附逻辑
                const snapX = Math.round(adjustedX / 10) * 10; // 吸附到最近的 10 像素
                const snapY = Math.round(adjustedY / 10) * 10;

                // 处理边界，确保不会放置在负坐标上
                const boundedX = Math.max(0, snapX);
                const boundedY = Math.max(0, snapY);

                addComponent({
                    id: new Date().getTime(),
                    name: droppedItem.name,
                    desc: config.desc,
                    props: config.defaultProps,
                    x: boundedX, // 使用调整后的 X 位置
                    y: boundedY, // 使用调整后的 Y 位置
                }, id);

                // 更新位置
                updatePosition(id, 0, 'your-container-class-name'); // 传入合适的参数
            } else {
                console.error(`Component config for type ${droppedItem.name} is undefined`);
            }
        }
    }, [addComponent, deleteComponent, components, componentConfig, id]);

    return {
        handleDragOver,
        handleDrop,
    };
}
