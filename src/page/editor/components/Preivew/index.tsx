import React, { useEffect, useRef, useState } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponetsStore } from "../../stores/components";
import { message } from "antd";
import { ActionConfig } from "../Setting/ActionModal";

export function Preview() {
    const { components } = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();

    const componentRefs = useRef<Record<string, any>>({});
    const [firstPaintTime, setFirstPaintTime] = useState<number | null>(null); // 状态来保存首屏加载时间

    useEffect(() => {
        const startTime = performance.now(); // 记录开始时间

        const handleFirstPaint = () => {
            const endTime = performance.now(); // 记录结束时间
            const loadTime = endTime - startTime; // 计算加载时间
            console.log(`首屏加载时间: ${loadTime}ms`);
            setFirstPaintTime(loadTime); // 保存首屏加载时间
        };

        // 使用 requestAnimationFrame 监听第一帧
        const rafId = requestAnimationFrame(handleFirstPaint);

        // 清理函数
        return () => {
            cancelAnimationFrame(rafId); // 清理请求的动画帧
        };
    }, []);

    function handleEvent(component: Component) {
        const props: Record<string, any> = {};

        componentConfig[component.name].events?.forEach((event) => {
            const eventConfig = component.props[event.name];

            if (eventConfig) {
                props[event.name] = (...args: any[]) => {
                    eventConfig?.actions?.forEach((action: ActionConfig) => {
                        if (action.type === 'goToLink') {
                            window.location.href = action.url;
                        } else if (action.type === 'showMessage') {
                            if (action.config.type === 'success') {
                                message.success(action.config.text);
                            } else if (action.config.type === 'error') {
                                message.error(action.config.text);
                            }
                        } else if (action.type === 'customJS') {
                            const func = new Function('context', 'args', action.code);
                            func({
                                name: component.name,
                                props: component.props,
                                showMessage(content: string) {
                                    message.success(content);
                                }
                            }, args);
                        } else if (action.type === 'componentMethod') {
                            const component = componentRefs.current[action.config.componentId];

                            if (component) {
                                component[action.config.method]?.(...args);
                            }
                        }
                    });
                };
            }
        });

        return props;
    }

    function renderComponents(components: Component[]): React.ReactNode {
        return components.map((component: Component) => {
            const config = componentConfig?.[component.name];

            if (!config?.prod) {
                return null;
            }

            return React.createElement(
                config.prod,
                {
                    key: component.id,
                    id: component.id,
                    name: component.name,
                    styles: component.styles,
                    ref: (ref: Record<string, any>) => { componentRefs.current[component.id] = ref; },
                    ...config.defaultProps,
                    ...component.props,
                    ...handleEvent(component),
                },
                renderComponents(component.children || [])
            );
        });
    }

    return (
        <div>
            {renderComponents(components)}
            {firstPaintTime !== null && (
                <div className="loading-time">
                    首屏加载时间: {firstPaintTime.toFixed(2)} ms
                </div>
            )}
        </div>
    );
}
