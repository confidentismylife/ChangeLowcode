import { useEffect, useState } from 'react';
import React from 'react';
import { ComponentConfig, useComponentConfigStore } from '../stores/component-config';
import useComponentsDrop from '../stores/components-drop';
import { applyVueInReact, applyPureVueInReact } from 'veaury';

// 自定义 Hook 用于加载远程组件并注册到 Zustand store 中
export const useAddRemoteComponentConfigVue = (url: string) => {
    const { components, addComponentDrop } = useComponentsDrop();
    const [remoteComponent, setRemoteComponent] = useState<any>(null);
    const [componentNames, setComponentNames] = useState<string[]>([]);

    useEffect(() => {
        // 当 components 更新时打印到控制台
        console.log("Updated components:", components);
    }, [components]);

    useEffect(() => {
        const fetchAndRegisterComponent = async () => {
            const component = await loadVueAndRemoteComponent(url);
            if (component) {
                setRemoteComponent(component);
                console.log(component)
                console.log(1231233131323)
                const names = Object.keys(component);
                setComponentNames(names);

                names.forEach(key => {
                    // 添加组件到组件列表
                    addComponentDrop(key);
                    // 创建组件配置
                    const componentConfig: ComponentConfig = {
                        name: key,
                        defaultProps: {},
                        desc: `远程组件`,
                        dev: renderVueComponent(key, {}), // 使用 renderVueComponent 渲染 dev 组件
                        prod: renderVueComponent(key, {}), // 使用 renderVueComponent 渲染 prod 组件
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
    
                    // 注册组件到 Zustand 的 componentConfig store 中
                    useComponentConfigStore.getState().registerComponent(key, componentConfig);
                });
              
            }
        };

        fetchAndRegisterComponent();
    }, [url, addComponentDrop]);

  const renderVueComponent = (ComponentName: string, props: any) => {
    if (!remoteComponent || !remoteComponent[ComponentName]) {
        return () => React.createElement("div", {
            style: {
                width: "20px",
                backgroundColor: "lightred",
                color: "white"
            }
        }, `Component ${ComponentName} not found`);
    }

    // Type assertion to ensure it is a valid React component
    const Component = applyVueInReact(remoteComponent[ComponentName]) as React.ComponentType<any>;
    // 打印组件名称和 props
    console.log(`Rendering component: ${ComponentName}`, props);

    return () => React.createElement(Component, props);
};

};

// 远程组件加载函数
const loadVueAndRemoteComponent = async (url: string) => {
    try {
        // Load Vue 3
        const vueScript = document.createElement('script');
        vueScript.src = 'https://cdn.jsdelivr.net/npm/vue@3';
        vueScript.type = 'text/javascript';
        vueScript.async = true;
        document.body.appendChild(vueScript);

        await new Promise<void>((resolve, reject) => {
            vueScript.onload = () => resolve();
            vueScript.onerror = () => reject(new Error('Failed to load Vue library'));
        });

        // Load remote component
        const remoteScript = document.createElement('script');
        remoteScript.src = url;
        remoteScript.type = 'text/javascript';
        remoteScript.async = true;
        document.body.appendChild(remoteScript);

        await new Promise<void>((resolve, reject) => {
            remoteScript.onload = () => resolve();
            remoteScript.onerror = () => reject(new Error('Failed to load remote component script'));
        });

        // Access global components
        const RemoteComponent = (window as any).PjwRemoteComponentVue;
        if (RemoteComponent) {
            return RemoteComponent;
        } else {
            console.error('RemoteComponent not found on window');
            return null;
        }
    } catch (error) {
        console.error('Failed to load remote component', error);
        return null;
    }
};