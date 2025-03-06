import React from 'react';
import AppstoreOutlined from '@ant-design/icons/lib/icons/AppstoreOutlined';
import FileOutlined from '@ant-design/icons/lib/icons/FileOutlined';
import LineChartOutlined from '@ant-design/icons/lib/icons/LineChartOutlined';

interface CustomMenuProps {
  select: number;
  setSelect: (value: number) => void;
  collapsed: boolean;
}

const CustomMenu: React.FC<CustomMenuProps> = ({ select, setSelect, collapsed }) => {
  const menuItems = [
    {
      key: 1,
      icon: <AppstoreOutlined />,
      label: '我的应用'
    },
    {
      key: 2,
      icon: <FileOutlined />,
      label: '模板中心'
    },
    {
      key: 3,
      icon: <LineChartOutlined />,
      label: '性能监控'
    }
  ];

  return (
    <div className="bili-sidebar">
      {menuItems.map(item => (
        <div
          key={item.key}
          className={`bili-sidebar-item ${select === item.key ? 'active' : ''}`}
          onClick={() => setSelect(item.key)}
        >
          <span className="text-xl mr-3">{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </div>
      ))}
    </div>
  );
};

export default CustomMenu;
