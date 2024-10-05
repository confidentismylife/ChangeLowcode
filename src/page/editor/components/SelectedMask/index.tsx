import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Dropdown, Popconfirm, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useSelectedMaskLogic } from './useSelectedMaskLogic';

interface SelectedMaskProps {
  id?: number;
  componentXyq?: any;
  portalWrapperClassName: string;
  containerClassName: string;
  componentId: number;
  scrollToplength: number;
  scrollLeftlength: number;
}

function SelectedMask({
  
  id,
  containerClassName,
  portalWrapperClassName,
  componentId,
  scrollToplength,
  componentXyq,
  scrollLeftlength,
}: SelectedMaskProps) {
  const {
    position,
    isReady,
    curComponent,
    parentComponents,
    handleDelete,
    handleMouseDown,
  } = useSelectedMaskLogic({
    componentId,
    containerClassName,
    scrollToplength,
    scrollLeftlength,
    componentXyq,
  });
  if (!isReady) return null;

  const el = document.querySelector(`.${portalWrapperClassName}`)!;

  const createDots = (position: { left: number; top: number; width: number; height: number }) => {
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
      <div
        style={{ ...dotStyle, left: position.left, top: position.top }}
        key="top-left"
        onMouseDown={(e) => handleMouseDown(e, 'top-left')}
      />,
      <div
        style={{ ...dotStyle, left: position.left + position.width, top: position.top }}
        key="top-right"
        onMouseDown={(e) => handleMouseDown(e, 'top-right')}
      />,
      <div
        style={{ ...dotStyle, left: position.left, top: position.top + position.height }}
        key="bottom-left"
        onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
      />,
      <div
        style={{ ...dotStyle, left: position.left + position.width, top: position.top + position.height }}
        key="bottom-right"
        onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
      />
    );

    // 边上的圆点（每条边1个）
    const edgeDots = 1; // 每条边1个圆点
    for (let i = 1; i <= edgeDots; i++) {
      // 上边
      dots.push(
        <div
          style={{ ...dotStyle, left: position.left + (position.width / (edgeDots + 1)) * i, top: position.top }}
          key={`top-${i}`}
          onMouseDown={(e) => handleMouseDown(e, 'top')}
        />
      );
      // 下边
      dots.push(
        <div
          style={{ ...dotStyle, left: position.left + (position.width / (edgeDots + 1)) * i, top: position.top + position.height }}
          key={`bottom-${i}`}
          onMouseDown={(e) => handleMouseDown(e, 'bottom')}
        />
      );
      // 左边
      dots.push(
        <div
          style={{ ...dotStyle, left: position.left, top: position.top + (position.height / (edgeDots + 1)) * i }}
          key={`left-${i}`}
          onMouseDown={(e) => handleMouseDown(e, 'left')}
        />
      );
      // 右边
      dots.push(
        <div
          style={{ ...dotStyle, left: position.left + position.width, top: position.top + (position.height / (edgeDots + 1)) * i }}
          key={`right-${i}`}
          onMouseDown={(e) => handleMouseDown(e, 'right')}
        />
      );
    }

    return dots;
  };

  return createPortal(
    <>
      <div
        style={{
          position: 'absolute' as const,
          left: componentXyq.left,
          top:  componentXyq.top,
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          border: '1px dashed blue',
          pointerEvents: 'none',
          width:  componentXyq.width,
          height:  componentXyq.height,
          zIndex: 12,
          borderRadius: 4,
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          position: 'absolute' as const,
          left:  componentXyq.labelLeft,
          top:  componentXyq.labelTop,
          fontSize: '14px',
          zIndex: 13,
          display: ! componentXyq.width || componentXyq.width < 10 ? 'none' : 'inline',
          transform: 'translate(-100%, -100%)',
        }}
      >
        <Space>
          <Dropdown
            menu={{
              items: parentComponents.map((component) => ({
                key: component.id,
                label: component.name,
              })),
              onClick: (item) => {
                setCurComponentId(item.key);
              },
            }}
          >
            <span>{curComponent.name}</span>
          </Dropdown>
          <Popconfirm title="确定删除这个组件吗？" onConfirm={handleDelete}>
            <DeleteOutlined style={{ color: 'red' }} />
          </Popconfirm>
        </Space>
      </div>
      {createDots(componentXyq)}
    </>,
    el
  );
}

export default SelectedMask;