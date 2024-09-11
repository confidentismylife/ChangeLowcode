// 导入创建路由的函数
import { createHashRouter } from 'react-router-dom';
import layoutPlay from '../page/layout/index'; // 确保拼写正确
import edit from '../page/editor/index';

// 创建 router 路由实例对象，并配置路由对应关系（路由数组）
const router = createHashRouter([
  {
    path: '/',
    Component: layoutPlay,
  },
  {
    path: '/edit',
    Component: edit,
  }
]);

export default router;