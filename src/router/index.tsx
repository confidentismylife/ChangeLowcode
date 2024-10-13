// 路由配置文件（例如：routes.js）

import { createHashRouter, Route } from 'react-router-dom';
import LayoutPlay from '../page/layout/index'; // 确保拼写正确
import Edit from '../page/editor/index';
import Show from '../page/show/index';
import SchemaPage from '../page/schema/index'; // 新增的页面组件
import DataShow from '../page/dataShow'; // 新增的页面组件
import Login from '../page/login/index';
const router = createHashRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/show',
    element: <Show />,
    children: [
      { path: 'datashow', element: <DataShow  /> },

    ]
  },
  {
    path: '/edit',
    element: <Edit />,
  },
  {
    path: '/schema/:id',
    element: <LayoutPlay />,
  },
  {
    path: '/datashow',
    element: <DataShow  />,
  },
]);

export default router;