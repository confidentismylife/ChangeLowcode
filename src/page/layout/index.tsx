import { useEffect, useState } from 'react';
import { Button, Layout, Menu, MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useComponentsShow } from '../editor/stores/component-show';
import { Preview } from './preivew'; // 确保 Preview 组件导入正确
import { Component } from "../editor/stores/components";

const { Header, Content, Sider } = Layout;

export default function LayputPlay() {
  const { componentShow } = useComponentsShow();
  const [items3, setItems3] = useState<MenuProps['items']>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>(''); // 当前选中的 key
  const navigate = useNavigate();

  useEffect(() => {
    const updatedItems3 = componentShow.map((item) => ({
      key: `${item.uindex}`,
      label: `${item.project}`,
    }));
    
    setItems3(updatedItems3);
    
    // 默认选中第一个菜单项
    if (updatedItems3.length > 0) {
      setSelectedKey(updatedItems3[0].key as string);
    }
  }, [componentShow]);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const selected = componentShow.find((item) => String(item.uindex) === e.key);
    if (selected) {
      const { uindex, project, ...componentWithoutUindex } = selected;
      setSelectedComponent(componentWithoutUindex);
      setSelectedKey(e.key);
    }
  };

  return (
    <Layout className="h-screen">
      <Header className="flex items-center justify-between bg-gray-900 text-white shadow-lg">
        <div className="text-2xl font-bold">ChangeLowCode</div>
        <Button
          type='primary'
          className='ml-auto px-6 py-2 transition-all duration-300 ease-in-out hover:bg-blue-600'
          onClick={() => { navigate('/edit'); }}
          style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
        >
          新添
        </Button>
      </Header>
      <Layout>
        <Sider width={250} className="bg-gray-100 shadow-lg">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}  // 使用 selectedKeys 控制选中状态
            className="h-full border-r-0"
            items={items3}
            onClick={handleMenuClick}
            style={{ backgroundColor: '#f5f5f5' }}
          />
        </Sider>
        <Layout className="p-6 bg-gray-100">
          <Content className="p-6 bg-white rounded-lg shadow-lg overflow-auto">
            {selectedComponent ? (
              <Preview components={[selectedComponent]} />
            ) : (
              <div className="text-center text-gray-500">请选择一个菜单项查看详细信息。</div>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}