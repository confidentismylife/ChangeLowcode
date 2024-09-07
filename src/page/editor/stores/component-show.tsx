import { create } from 'zustand';
import { CSSProperties } from 'react';
import cloneDeep from 'lodash/cloneDeep';  // 导入 lodash 的 cloneDeep

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

export const useComponentsShow = create<ShowMessages>((set) => ({
    componentShow: [],

    addShowMessage: (newComponent: Component) =>
        set((state) => {
            console.log('newComponent', newComponent);
            console.log('state', state);

            // 使用 lodash 的 cloneDeep 进行深拷贝
            const newComp = cloneDeep(newComponent);

            return {
                componentShow: [
                    ...state.componentShow,
                    newComp  // 使用深拷贝后的对象
                ],
            };
        }),
}));
