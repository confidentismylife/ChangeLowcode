import React, { useRef } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponetsStore } from "../../stores/components";
import { message } from "antd";
import { ActionConfig } from "../Setting/ActionModal";

const Preview: React.FC = () => {
    const { components } = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();

    const componentRefs = useRef<Record<string, any>>({});

    function handleEvent(component: Component) {
        const props: Record<string, any> = {};

        componentConfig[component.name]?.events?.forEach((event) => {
            const eventConfig = component.props[event.name];

            if (eventConfig) {
                props[event.name] = (...args: any[]) => {
                    eventConfig?.actions?.forEach((action: ActionConfig) => {
                        if (action.type === "goToLink") {
                            window.location.href = action.url;
                        } else if (action.type === "showMessage") {
                            if (action.config.type === "success") {
                                message.success(action.config.text);
                            } else if (action.config.type === "error") {
                                message.error(action.config.text);
                            }
                        } else if (action.type === "customJS") {
                            const func = new Function("context", "args", action.code);
                            func(
                                {
                                    name: component.name,
                                    props: component.props,
                                    showMessage(content: string) {
                                        message.success(content);
                                    },
                                },
                                args
                            );
                        } else if (action.type === "componentMethod") {
                            const targetComponent =
                                componentRefs.current[action.config.componentId];
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
            
            if (!config) {
                console.error(`No config found for component: ${component.name}`);
                return null;
            }

            if (!config.prod) {
                console.error(`No prod component found for: ${component.name}`);
                return null;
            }

            // 检查prod组件的类型
            if (typeof config.prod !== 'function' && typeof config.prod !== 'string') {
                console.error(`Invalid prod component type for ${component.name}:`, config.prod);
                return null;
            }

            // Set component styles using x and y properties
            const style = {
                position: "absolute" as const,
                left: component.x ?? 0,
                top: component.y ?? 0,
                ...component.styles,
            };

            const props = {
                key: component.id,
                id: component.id,
                name: component.name,
                styles: style,
                ref: (ref: any) => {
                    if (ref) {
                        componentRefs.current[component.id] = ref;
                    }
                },
                ...config.defaultProps,
                ...component.props,
                ...handleEvent(component),
            };

            try {
                return React.createElement(
                    config.prod,
                    props,
                    component.children?.length ? renderComponents(component.children) : null
                );
            } catch (error) {
                console.error(`Error rendering component ${component.name}:`, error);
                return null;
            }
        });
    }

    return (
        <div
            className="preview-container"
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
            }}
        >
            {renderComponents(components)}
        </div>
    );
}

export default Preview;
