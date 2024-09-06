import React, { MouseEventHandler, useEffect, useState, useRef } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponetsStore } from "../../stores/components";
import HoverMask from "../HoverMask";
import SelectedMask from "../SelectedMask";

export function EditArea() {
    const { components, curComponentId, setCurComponentId } = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();

    const editAreaRef = useRef<HTMLDivElement>(null);
    const [scrollToplength, setScrollToplength] = useState<number>(0);
    const [scrollLeftlength, setScrollLeftlength] = useState<number>(0);

    function renderComponents(components: Component[]): React.ReactNode {
        return components.map((component: Component) => {
            const config = componentConfig?.[component.name];

            if (!config?.dev) {
                return null;
            }

            return React.createElement(
                config.dev,
                {
                    key: component.id,
                    id: component.id,
                    name: component.name,
                    styles: component.styles,
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
        debugger
        for (let i = 0; i < path.length; i += 1) {
            const ele = path[i] as HTMLElement;
            debugger
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

    return (
        <div
            ref={editAreaRef}
            className="h-[100%] edit-area overflow-auto"
            style={{ boxSizing: 'border-box', paddingRight: '17px', paddingBottom: '17px' }}
            onMouseOver={handleMouseOver}
            onMouseLeave={() => setHoverComponentId(undefined)}
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
            {curComponentId && (
                <SelectedMask
                    portalWrapperClassName="portal-wrapper"
                    containerClassName="edit-area"
                    componentId={curComponentId}
                    scrollToplength={scrollToplength}

                />
            )}
            <div className="portal-wrapper"></div>
        </div>
    );
}
