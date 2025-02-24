import React, { MouseEventHandler, useEffect, useState, useRef } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponetsStore } from "../../stores/components";
import HoverMask from "../HoverMask";
import SelectedMask from "../SelectedMask";
import { useComponentXy } from "../../stores/component-xy";

export function EditArea() {
    const { components, curComponentId, setCurComponentId } = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();
    
    const editAreaRef = useRef<HTMLDivElement>(null);
    const [scrollToplength, setScrollToplength] = useState<number>(0);
    const [scrollLeftlength, setScrollLeftlength] = useState<number>(0);
    const { componentXy } = useComponentXy();
    
    useEffect(() => {
        console.log("componentXy changed:", componentXy);
        renderSelectedMask()
    }, [componentXy]); // 监听 componentXy 的变化

    function renderComponents(components: Component[]): React.ReactNode {
        return components.map((component: Component) => {
            const config = componentConfig?.[component.name];

            if (!config?.dev) {
                return null;
            }
            // 设置组件样式，使用 x 和 y 属性进行定位
            const style = {
                position: 'absolute', // 绝对定位
                left: component.x ?? 0, // 使用 x 属性，默认为 0
                top: component.y ?? 0, // 使用 y 属性，默认为 0
                ...component.styles, // 合并其他样式
            };

            return React.createElement(
                config.dev,
                {
                    key: component.id,
                    id: component.id,
                    name: component.name,
                    styles: style, // 将样式传递给组件
                    ...config.defaultProps,
                    ...component.props,
                },
                renderComponents(component.children || [])
            );
        });
    }

    const [hoverComponentId, setHoverComponentId] = useState<number>();

    const handleMouseOver: MouseEventHandler = (e) => {
        const path = e.nativeEvent.composedPath();

        for (let i = 0; i < path.length; i += 1) {
            const ele = path[i] as HTMLElement;

            const componentId = ele.dataset?.componentId;

            if (componentId) {
                setHoverComponentId(+componentId);
                return;
            }
        }
    };

    const handleClick: MouseEventHandler = (e) => {
        const path = e.nativeEvent.composedPath();
  
        for (let i = 0; i < path.length; i += 1) {
            const ele = path[i] as HTMLElement;

            const componentId = ele.dataset?.componentId;
            if (componentId) {
                setCurComponentId(+componentId);
                return;
            }
        }
    };

    // 计算滚动距离
    const logScrollPosition = () => {
        if (editAreaRef.current) {
            const { scrollTop, scrollLeft } = editAreaRef.current;
            setScrollToplength(scrollTop);
            setScrollLeftlength(scrollLeft);
        }
    };

    useEffect(() => {
        const editArea = editAreaRef.current;

        if (editArea) {
            editArea.addEventListener('scroll', logScrollPosition);
        }

        return () => {
            if (editArea) {
                editArea.removeEventListener('scroll', logScrollPosition);
            }
        };
    }, []);

    function renderSelectedMask() {
        console.log("renderSelectedMask componentXy:", componentXy);
        return (
            curComponentId && (
                <SelectedMask
                    id={curComponentId} // 使用 curComponentId 作为 id
                    componentXyq={componentXy}
                    portalWrapperClassName="portal-wrapper"
                    containerClassName="edit-area"
                    componentId={curComponentId}
                    scrollToplength={scrollToplength}
                    scrollLeftlength={scrollLeftlength} // 使用 scrollLeftlength 而不是 0
                />
            )
        );
    }

    return (
        <div
            ref={editAreaRef}
            className="h-[100%] edit-area overflow-auto z-0"
            style={{ boxSizing: 'border-box', paddingRight: '17px', paddingBottom: '17px' }}
            onMouseOver={handleMouseOver}
            onMouseLeave={() => {
                setHoverComponentId(undefined);
            }}
            onClick={handleClick}
        >
            {renderComponents(components)}
            {hoverComponentId && hoverComponentId !== curComponentId && (
                <HoverMask
                    portalWrapperClassName="portal-wrapper"
                    containerClassName="edit-area"
                    componentId={hoverComponentId}
                    scrollToplength={scrollToplength}
                    scrollLeftlength={scrollLeftlength}
                />
            )}
            {renderSelectedMask()} {/* 调用 renderSelectedMask 函数 */}
            <div className="portal-wrapper"></div>
        </div>
    );
}
