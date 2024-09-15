import { useEffect } from 'react';
import React from 'react';
import { ComponentConfig, useComponentConfigStore } from '../stores/component-config';
import useComponentsDrop from '../stores/components-drop';

// 自定义 Hook 用于加载远程组件并注册到 Zustand store 中
export const useAddRemoteComponentConfig = (url: string) => {
    const { components,addComponentDrop } = useComponentsDrop();
    useEffect(() => {
        // 当 components 更新时打印到控制台
        console.log("Updated components:", components);
    }, [components]);

    useEffect(() => {
        const fetchAndRegisterComponent = async () => {
            const component = await loadRemoteComponent(url);
            if (component) {
                Object.keys(component).forEach(key => {
                    // 添加组件到组件列表
                    addComponentDrop(key);
                    // 创建组件配置
                    const componentConfig: ComponentConfig = {
                        name: key,
                        defaultProps: {},
                        desc: `远程组件`,
                        dev: component[key],
                        prod: component[key],
                        setter: [
                            {
                                name: 'text',
                                label: '文本',
                                type: 'input',
                            },
                        ],
                        stylesSetter: [
                            {
                                name: 'width',
                                label: '宽度',
                                type: 'inputNumber',
                            },
                            {
                                name: 'height',
                                label: '高度',
                                type: 'inputNumber',
                            }
                        ],
                    };
                    console.log(1233123)
                    console.log(componentConfig.dev)
                    // 注册组件到 Zustand 的 componentConfig store 中
                    useComponentConfigStore.getState().registerComponent(key, componentConfig);
                });
                console.log('components', components);
            }
        };

        fetchAndRegisterComponent();
    }, [url, addComponentDrop]);
};

// 远程组件加载函数
async function loadRemoteComponent(url: string): Promise<any> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch remote component: ${response.statusText}`);
        }
        const script = await response.text();

        // 调试：打印脚本内容
        console.log('Loaded script:', script);

        const module = { exports: {} };

        const require = (id: string) => {
            if (id === 'react') {
                return React;
            }
            throw new Error(`Module ${id} is not available`);
        };

        const func = new Function('module', 'exports', 'require', script);
        func(module, module.exports, require);

        return module.exports;
    } catch (error) {
        console.error('Failed to load remote component', error);
        return null;
    }
}
