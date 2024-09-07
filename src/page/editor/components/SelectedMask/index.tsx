import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { getComponentById, useComponetsStore } from '../../stores/components';
import { Dropdown, Popconfirm, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface SelectedMaskProps {
  portalWrapperClassName: string;
  containerClassName: string;
  componentId: number;
  scrollToplength: number;
}

function SelectedMask({ containerClassName, portalWrapperClassName, componentId, scrollToplength }: SelectedMaskProps) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });
  const [isReady, setIsReady] = useState(false);  // 状态来管理渲染

  const { components, curComponentId, curComponent, deleteComponent, setCurComponentId } = useComponetsStore();

  useEffect(() => {
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
      labelLeft = labelLeft + 0;

      if (labelTop <= 0) {
        labelTop -= -20;
      }

      setPosition({
        top: top - containerTop + container.scrollTop - scrollToplength,
        left: left - containerLeft,
        width,
        height,
        labelTop,
        labelLeft,
      });
    };

    const resizeHandler = () => {
      updatePosition();
    };

    // 初始化时检查 DOM 是否准备好
    const checkReady = () => {
      const el = document.querySelector(`.${portalWrapperClassName}`);
      if (el) {
        setIsReady(true);
        updatePosition();
      }
    };

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

  if (!isReady) return null;  // 当目标容器尚未准备好时，不渲染组件

  const el = document.querySelector(`.${portalWrapperClassName}`)!;

  return createPortal((
    <>
      <div
        style={{
          position: "absolute",
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
          position: "absolute",
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
                <DeleteOutlined style={{ color: '#fff' }} />
              </Popconfirm>
            </div>
          )}
        </Space>
      </div>
    </>
  ), el);
}

export default SelectedMask;
