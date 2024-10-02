// src/hooks/useDragAndDrop.ts
import { useCallback } from 'react';
import { useComponetsStore, getComponentById } from '../stores/components';
import { useComponentConfigStore } from '../stores/component-config';

interface DroppedItem {
    id?: number | null; // 组件ID
    name: string;
    dragType: 'add' | 'move'; // 拖拽类型
}

export function useDragAndDrop(id?: number) {
    const { addComponent, deleteComponent, components } = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // 允许放置
    }, []);

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        debugger
        event.preventDefault(); // 防止默认行为

        // 获取鼠标的位置
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        console.log('鼠标位置')
        console.log(mouseX, mouseY);

        // 获取 Page 组件的边界信息
        const pageRect = event.currentTarget.getBoundingClientRect();
        const pageX = pageRect.left; // Page 组件左边距
        const pageY = pageRect.top; // Page 组件上边距
        console.log('Page 组件边界');
        console.log(pageX, pageY);
        // 计算鼠标相对于 Page 组件的位置
        const relativeX = mouseX - pageX;
        const relativeY = mouseY - pageY;

        // 获取拖拽的元素数据并解析
        const droppedItem: DroppedItem = JSON.parse(event.dataTransfer.getData('text/plain'));

        // 根据拖拽的类型进行处理
      // 根据拖拽的类型进行处理
if (droppedItem.dragType === 'move') {
    const component = getComponentById(droppedItem.id, components);

    if (component) { // 检查组件是否存在
        // 获取移动组件的宽高
        const componentWidth = component.props.width || 100; // 默认宽度
        const componentHeight = component.props.height || 100; // 默认高度
        console.log('拖拽组件宽高');
        // 重新计算相对于 Page 的位置
        const adjustedX = relativeX - componentWidth / 4; // 使鼠标在新组件中心
        const adjustedY = relativeY - componentHeight / 4;
        console.log(adjustedX, adjustedY);
        // 计算边界，确保不会放置在负坐标上
        const boundedX = Math.max(0, adjustedX);
        const boundedY = Math.max(0, adjustedY);

        // 处理移动逻辑
        deleteComponent(droppedItem.id); // 删除原组件
        addComponent({
            ...component,
            x: boundedX, // 使用调整后的 X 位置
            y: boundedY, // 使用调整后的 Y 位置
        }, id); // 添加到新父级
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

        // 计算边界，确保不会放置在负坐标上
        const boundedX = Math.max(0, adjustedX);
        const boundedY = Math.max(0, adjustedY);

        addComponent({
            id: new Date().getTime(),
            name: droppedItem.name,
            desc: config.desc,
            props: config.defaultProps,
            x: boundedX, // 使用调整后的 X 位置
            y: boundedY, // 使用调整后的 Y 位置
        }, id);
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
