import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { RouterProvider } from 'react-router-dom';
import router from './router'; // 确保路径正确

ReactDOM.createRoot(document.getElementById('root')!).render(
  <DndProvider backend={HTML5Backend}>
    <RouterProvider router={router} />
  </DndProvider>
);