
import { RouterProvider } from 'react-router-dom';
import router from './router';  // 导入定义的路由
function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App