import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 导入 persist 中间件
import { CSSProperties } from 'react';
import cloneDeep from 'lodash/cloneDeep';

interface Component {
    id: number;
    name: string;
    props: any;
    styles?: CSSProperties;
    desc: string;
    children?: Component[];
    parentId?: number;
    uindex?: string|number;
    project?: string|number;
}

interface ShowMessages {
    componentShow: Component[];
    addShowMessage: (newComponent: Component) => void;
}

export const useComponentsShow = create<ShowMessages>()(
  persist(
    (set) => ({
      componentShow: [],

      addShowMessage: (newComponent: Component) =>
        set((state) => {
          console.log('newComponent', newComponent);
          console.log('state', state);

          const newComp = cloneDeep(newComponent); // 深拷贝

          return {
            componentShow: [...state.componentShow, newComp],
          };
        }),
    }),
    {
      name: 'components-show-storage', // 存储在 localStorage 中的键名
    }
  )
);
