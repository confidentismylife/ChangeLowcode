import { useEffect, useState } from 'react';
import { useComponetsStore } from '../../stores/components';
import { useComponentXy } from '../../stores/component-xy';

interface SelectedMaskLogicProps {
  componentId: number;
  containerClassName: string;
  scrollToplength: number;
  scrollLeftlength: number;
  componentXyq?: any;
}

export function useSelectedMaskLogic({
  componentId,
  containerClassName,
  scrollToplength,
  scrollLeftlength,
  componentXyq,
}: SelectedMaskLogicProps) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });
  const { setXy,componentXy } = useComponentXy(); // 从 Zustand 中获取 setXy 方法
  const [isReady, setIsReady] = useState(false);
  const {
    components,
    curComponentId,
    curComponent,
    deleteComponent,
    setCurComponentId,
    updateComponentStyles,
  } = useComponetsStore();

  const updatePosition = () => {
    setTimeout(() => {
      
  
    if (!componentId) return;

    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    const node = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    const { top, left, width, height } = node.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

    let labelTop = top - containerTop + container.scrollTop;
    let labelLeft = left - containerLeft + width;

    const newPosition = {
      top: top - containerTop + container.scrollTop - scrollToplength,
      left: left - containerLeft,
      width,
      height,
      labelTop,
      labelLeft,
    };

    // 只在有变化时更新状态

  
      console.log('输出了')
      console.log({
        top: top - containerTop + container.scrollTop - scrollToplength,
        left: left - containerLeft,
        width: width,
        height: height,
        labelTop: labelTop,
        labelLeft: labelLeft,
    })
      setPosition(newPosition);
      
      setXy({
        top: top - containerTop + container.scrollTop - scrollToplength,
        left: left - containerLeft,
        width: width,
        height: height,
        labelTop: labelTop,
        labelLeft: labelLeft,
    });
  }, 200);

    
  };

  const resizeHandler = () => {
    updatePosition();
  };

  const checkReady = () => {
    const el = document.querySelector(`.${containerClassName}`);
    if (el) {
      setIsReady(true);
      updatePosition();
    }
  };

  useEffect(() => {
    checkReady();
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [componentId, scrollToplength, containerClassName]);

  const handleDelete = () => {
    deleteComponent(curComponentId!);
    setCurComponentId(null);
  };

  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();

    const initialWidth = position.width;
    const initialHeight = position.height;
    const initialX = e.clientX;
    const initialY = e.clientY;

    let newWidth = initialWidth;
    let newHeight = initialHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (direction.includes('right')) {
        newWidth = initialWidth + (moveEvent.clientX - initialX);
      }
      if (direction.includes('bottom')) {
        newHeight = initialHeight + (moveEvent.clientY - initialY);
      }

      setPosition((prev) => ({
        ...prev,
        width: Math.max(newWidth, 1),
        height: Math.max(newHeight, 1),
      }));
      updatePosition();
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      updateComponentStyles(componentId, {
        width: Math.max(newWidth, 1),
        height: Math.max(newHeight, 1),
      });
      updatePosition();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return {
    position,
    isReady,
    curComponent,
    parentComponents: components,
    handleDelete,
    handleMouseDown,
  };
}