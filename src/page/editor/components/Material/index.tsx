import { useMemo } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { MaterialItem } from "../MaterialItem";
import { useAddRemoteComponentConfig } from "../../hooks/useAddRemoteComponentConfig"; // 引入自定义 Hook

export function Material() {
    const { componentConfig } = useComponentConfigStore();

    // 过滤基础组件，排除 'Page'
    const components = useMemo(() => {
        return Object.values(componentConfig).filter(item => item.name !== 'Page');
    }, [componentConfig]);

    return (
        <>
            <span className="m-2">基础组件</span>
            <div className="m-2 overflow-auto">
                {components.filter(item => item.desc !== '远程组件').map((item, index) => (
                    <MaterialItem name={item.name} desc={item.desc} key={item.name + index} />
                ))}
            </div>

            <span className="m-2">远程组件</span>
            <div className="m-2 overflow-auto">
                {components.filter(item => item.desc === '远程组件').map((item, index) => (
                    <MaterialItem name={item.name} desc={item.desc} key={item.name + index} />
                ))}
            </div>
        </>
    );
}
