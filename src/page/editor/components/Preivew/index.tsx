import React, { useRef } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponetsStore } from "../../stores/components";
import { message } from "antd";
import { ActionConfig } from "../Setting/ActionModal";

export function Preview() {
    const { components } = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();

    const componentRefs = useRef<Record<string, any>>({});

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
                            const targetComponent = componentRefs.current[action.config.componentId];

                            if (targetComponent) {
                                targetComponent[action.config.method]?.(...args);
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

            // Set component styles using x and y properties
            const style = {
                position: 'absolute', // Absolute positioning
                left: component.x ?? 0, // Default x position
                top: component.y ?? 0, // Default y position
                ...component.styles, // Merge other styles
            };

            return React.createElement(
                config.prod,
                {
                    key: component.id,
                    id: component.id,
                    name: component.name,
                    styles: style, // Pass styles to the component
                    ref: (ref: Record<string, any>) => { 
                        if (ref) {
                            componentRefs.current[component.id] = ref;
                        }
                    },
                    ...config.defaultProps,
                    ...component.props,
                    ...handleEvent(component) // Handle events
                },
                renderComponents(component.children || [])
            );
        });
    }

    return (
        <div
            className="preview-container"
            style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
        >
            {renderComponents(components)}
        </div>
    );
}
