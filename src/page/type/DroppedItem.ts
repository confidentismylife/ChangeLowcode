export interface DroppedItem {
    id?: number; // 组件ID
    name: string;
    dragType: 'add' | 'move'; // 拖拽类型
  }
  