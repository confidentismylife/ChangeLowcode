import React, { useEffect, useRef } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponetsStore } from "../../stores/components";

export function Preview() {
    const { components } = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();

    const componentRefs = useRef<Record<string, any>>({});

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
