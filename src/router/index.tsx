// 路由配置文件（例如：routes.js）

import { createHashRouter, Route } from 'react-router-dom';
import LayoutPlay from '../page/layout/index'; // 确保拼写正确
import Edit from '../page/editor/index';
import Show from '../page/show/index';
import SchemaPage from '../page/schema/index'; // 新增的页面组件

const router = createHashRouter([
  {
    path: '/',
    element: <Show />,
  },
  {
    path: '/edit',
    element: <Edit />,
  },
  {
    path: '/schema/:id',
    element: <LayoutPlay />,
  },
  // {
  //   path: '/schema/:id',
  //   element: <SchemaPage />,
  // }
]);

export default router;