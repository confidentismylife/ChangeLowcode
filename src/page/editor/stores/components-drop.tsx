import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 导入 persist 中间件

interface components {
  components: string[];
  addComponentDrop: (newComponent: string) => void;
}

const useComponentsDrop = create<components>()(
  persist(
    (set) => ({
      components: ['Button', 'Container', 'Table', 'Form', 'Yuancheng', 'Modal','Space','Card'],
      addComponentDrop: (newComponent: string) =>
        set((state) => ({
          components: [...state.components, newComponent],
        })),
    }),
    {
      name: 'components-drop-storage', // 存储在 localStorage 中的键名
    }
  )
);

export default useComponentsDrop;
