import React from 'react';
import AppstoreAddOutlined from '@ant-design/icons/AppstoreAddOutlined'; // 你的应用图标
import FileOutlined from '@ant-design/icons/FileOutlined'; // 替代 TemplateOutlined
import LineChartOutlined from '@ant-design/icons/LineChartOutlined'; // 性能监控图标

interface CustomMenuProps {
  select: number; // 当前选中的项
  setSelect: (value: number) => void; // 更新选中的项的方法
  collapsed: boolean; // 是否折叠状态
}

const CustomMenu: React.FC<CustomMenuProps> = ({ select, setSelect, collapsed }) => {
  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center h-10 hover:bg-gray-700 p-2 cursor-pointer ${select === 1 ? 'bg-gray-600' : 'bg-gray-800'}`}
        onClick={() => setSelect(1)}
      >
        <AppstoreAddOutlined className="mr-2" />
        {!collapsed && <span className="whitespace-nowrap">我的应用</span>} {/* 仅在未折叠时显示文本 */}
      </div>
      <div
        className={`flex items-center h-10 hover:bg-gray-700 p-2 cursor-pointer ${select === 2 ? 'bg-gray-600' : 'bg-gray-800'}`}
        onClick={() => setSelect(2)}
      >
        <FileOutlined className="mr-2" />
        {!collapsed && <span className="whitespace-nowrap">模板应用</span>} {/* 仅在未折叠时显示文本 */}
      </div>
      <div
        className={`flex items-center h-10 hover:bg-gray-700 p-2 cursor-pointer ${select === 3 ? 'bg-gray-600' : 'bg-gray-800'}`}
        onClick={() => setSelect(3)}
      >
        <LineChartOutlined className="mr-2" />
        {!collapsed && <span className="whitespace-nowrap">性能监控</span>} {/* 仅在未折叠时显示文本 */}
      </div>
    </div>
  );
};

export default CustomMenu;
