import React, { useRef } from "react";
import { useComponentConfigStore } from "../editor/stores/component-config";
import { Component } from "../editor/stores/components";
import { message } from "antd";
import { ActionConfig } from "../editor/components/Setting/ActionModal";

interface PreviewProps {
  components: Component[];  // Ensure props structure is correct
}

export function Preview({ components }: PreviewProps) {  // Destructure props

  const { componentConfig } = useComponentConfigStore();
  const componentRefs = useRef<Record<string, any>>({});

  // Handle events based on component configuration
  function handleEvent(component: Component) {
    const props: Record<string, any> = {};

    componentConfig[component.name]?.events?.forEach((event) => {
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
              const comp = componentRefs.current[action.config.componentId];
              if (comp) {
                comp[action.config.method]?.(...args);
              }
            }
          });
        };
      }
    });

    return props;
  }

  // Render components recursively
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

      // Create the component with its props
      return React.createElement(
        config.prod,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: style, // Pass styles to the component
          ref: (ref: Record<string, any>) => { componentRefs.current[component.id] = ref; },
          ...config.defaultProps,
          ...component.props,
          ...handleEvent(component), // Attach event handlers
        },
        renderComponents(component.children || []) // Render children recursively
      );
    });
  }

  return (
    <div className="relative  bg-white p-4 rounded-lg shadow-md h-[570px] overflow-auto">
      {/* Use a wrapper for positioning and layout */}
   
        {renderComponents(components)}
    
    </div>
  );
}
