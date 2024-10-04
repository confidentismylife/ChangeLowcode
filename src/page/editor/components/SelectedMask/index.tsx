import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { getComponentById, useComponetsStore } from '../../stores/components';
import { Dropdown, Popconfirm, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useComponentXy } from '../../stores/component-xy'; // 导入 useComponentXy

interface SelectedMaskProps {
  id?:number;
  portalWrapperClassName: string;
  containerClassName: string;
  componentId: number;
  scrollToplength: number;
  scrollLeftlength: number;
}

function SelectedMask({ id,containerClassName, portalWrapperClassName, componentId, scrollToplength, scrollLeftlength }: SelectedMaskProps) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });
  const [isReady, setIsReady] = useState(false);
  const { components, curComponentId, curComponent, deleteComponent, setCurComponentId, updateComponentStyles } = useComponetsStore();
  
  // 获取 Zustand 状态管理中的 setXy 方法
  const { setXy,componentXy } = useComponentXy();
  const [x,setx]=useState(null);
  const updatePosition = () => {
    if (!componentId) return;

    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    const node = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    const { top, left, width, height } = node.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

    let labelTop = top - containerTop + container.scrollTop;
    let labelLeft = left - containerLeft + width;

    // 更新 position 状态
    setPosition({
      top: top - containerTop + container.scrollTop - scrollToplength,
      left: left - containerLeft,
      width,
      height,
      labelTop,
      labelLeft,
    });

    // 更新 Zustand 状态管理中的位置信息
    setXy(
      top - containerTop + container.scrollTop - scrollToplength,
      left - containerLeft,
      width,
      height,
      labelTop,
      labelLeft
    );
  };

  const resizeHandler = () => {
    updatePosition();
  };

  const checkReady = () => {
    const el = document.querySelector(`.${portalWrapperClassName}`);
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
  }, [componentId, scrollToplength, containerClassName, portalWrapperClassName]);

  const curSelectedComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId, components]);

  const parentComponents = useMemo(() => {
    const parentComponents = [];
    let component = curComponent;

    while (component?.parentId) {
      component = getComponentById(component.parentId, components)!;
      parentComponents.push(component);
    }

    return parentComponents;
  }, [curComponent, components]);

  function handleDelete() {
    deleteComponent(curComponentId!);
    setCurComponentId(null);
  }

  // Resize handling
  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();

    // 获取初始宽高和鼠标位置
    const initialWidth = position.width;
    const initialHeight = position.height;
    const initialX = e.clientX;
    const initialY = e.clientY;

    let newWidth = initialWidth;
    let newHeight = initialHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      // 计算新的宽高
      if (direction.includes('right')) {
        newWidth = initialWidth + (moveEvent.clientX - initialX);
      }
      if (direction.includes('bottom')) {
        newHeight = initialHeight + (moveEvent.clientY - initialY);
      }

      // 直接更新组件的大小，确保不小于20
      setPosition((prev) => ({
        ...prev,
        width: Math.max(newWidth, 1), // Prevent collapse
        height: Math.max(newHeight, 1), // Prevent collapse
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      // 更新最终的组件样式
      updateComponentStyles(componentId, {
        width: Math.max(newWidth, 1),
        height: Math.max(newHeight, 1),
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  if (!isReady) return null;

  const el = document.querySelector(`.${portalWrapperClassName}`)!;

  const createDots = (position: { left: number, top: number, width: number, height: number }) => {
    const dots = [];
    const dotStyle: React.CSSProperties = {
      position: 'absolute',
      width: '8px',
      height: '8px',
      backgroundColor: 'blue',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
    };

    // 角上的圆点（每个角1个）
    dots.push(
      <div style={{ ...dotStyle, left: position.left, top: position.top }} key="top-left" onMouseDown={(e) => handleMouseDown(e, 'top-left')} />,
      <div style={{ ...dotStyle, left: position.left + position.width, top: position.top }} key="top-right" onMouseDown={(e) => handleMouseDown(e, 'top-right')} />,
      <div style={{ ...dotStyle, left: position.left, top: position.top + position.height }} key="bottom-left" onMouseDown={(e) => handleMouseDown(e, 'bottom-left')} />,
      <div style={{ ...dotStyle, left: position.left + position.width, top: position.top + position.height }} key="bottom-right" onMouseDown={(e) => handleMouseDown(e, 'bottom-right')} />
    );

    // 边上的圆点（每条边1个）
    const edgeDots = 1; // 每条边1个圆点
    for (let i = 1; i <= edgeDots; i++) {
      // 上边
      dots.push(
        <div style={{ ...dotStyle, left: position.left + (position.width / (edgeDots + 1)) * i, top: position.top }} key={`top-${i}`} onMouseDown={(e) => handleMouseDown(e, 'top')} />
      );
      // 下边
      dots.push(
        <div style={{ ...dotStyle, left: position.left + (position.width / (edgeDots + 1)) * i, top: position.top + position.height }} key={`bottom-${i}`} onMouseDown={(e) => handleMouseDown(e, 'bottom')} />
      );
      // 左边
      dots.push(
        <div style={{ ...dotStyle, left: position.left, top: position.top + (position.height / (edgeDots + 1)) * i }} key={`left-${i}`} onMouseDown={(e) => handleMouseDown(e, 'left')} />
      );
      // 右边
      dots.push(
        <div style={{ ...dotStyle, left: position.left + position.width, top: position.top + (position.height / (edgeDots + 1)) * i }} key={`right-${i}`} onMouseDown={(e) => handleMouseDown(e, 'right')} />
      );
    }

    return dots;
  };

  return createPortal(( 
    <>
      <div
        style={{
          position: "absolute" as const,
          left: position.left,
          top: position.top,
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          border: "1px dashed blue",
          pointerEvents: "none",
          width: position.width,
          height: position.height,
          zIndex: 12,
          borderRadius: 4,
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          position: "absolute" as const,
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: "14px",
          zIndex: 13,
          display: (!position.width || position.width < 10) ? "none" : "inline",
          transform: 'translate(-100%, -100%)',
        }}
      >
        <Space>
          <Dropdown
            menu={{
              items: parentComponents.map(item => ({
                key: item.id,
                label: item.desc,
              })),
              onClick: ({ key }) => {
                setCurComponentId(+key);
              }
            }}
            disabled={parentComponents.length === 0}
          >
            <div
              style={{
                padding: '0 8px',
                backgroundColor: 'blue',
                borderRadius: 4,
                color: '#fff',
                cursor: "pointer",
                whiteSpace: 'nowrap',
              }}
            >
              {curSelectedComponent?.desc}
            </div>
          </Dropdown>
          {curComponentId !== 1 && (
            <div style={{ padding: '0 8px', backgroundColor: 'blue' }}>
              <Popconfirm
                title="确认删除？"
                okText={'确认'}
                cancelText={'取消'}
                onConfirm={handleDelete}
              >
                <DeleteOutlined style={{ color: '#fff', cursor: 'pointer' }} />
              </Popconfirm>
            </div>
          )}
        </Space>
      </div>
      {createDots(position)}
    </>
  ), el);
}

export default SelectedMask;
