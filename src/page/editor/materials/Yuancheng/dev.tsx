import React, { useState, useEffect, Suspense } from 'react';
import { useMaterailDrop } from '../../hooks/useMaterailDrop';
import { CommonComponentProps } from '../../interface';

// 远程组件加载函数
async function loadRemoteComponent(url: string): Promise<any> {
  try {
    const script = await fetch(url).then((res) => res.text());
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

// 定义一个简单的fallback组件
const Loading = () => <div>Loading...</div>;

export interface CommonComponentProps1 extends CommonComponentProps {
  text: string | string;
}

function Yuancheng({ id, children, title, styles, text }: CommonComponentProps1) {
  const { canDrop, drop } = useMaterailDrop(['Button', 'Container', 'Table', 'Form'], id);
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    const loadComponent = async () => {
      const component = await loadRemoteComponent('https://cdn.jsdelivr.net/npm/pjw-remote-component@1.0.3/dist/bundle.umd.js');
      if (component) {
        setComponent(component);
        console.log('Loaded Component:', component); // 直接打印组件
      }
    };
    loadComponent();
  }, []);

  return (
    <div ref={drop} style={styles}>
      <h1>{title}</h1>
      <Suspense fallback={<Loading />}>
        {Component ? (
          <>
            {Component.Test && <Component.Test id={id} text={text} style={styles} />}
          </>
        ) : (
          <Loading />
        )}
      </Suspense>
      {children}
    </div>
  );
}

export default Yuancheng;