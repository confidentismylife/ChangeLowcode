import { useEffect, useState } from 'react';
import { Button, Layout, Menu, MenuProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom'; 
import { useComponentsStore } from '../editor/stores/component-total';
import { Preview } from './preivew'; 

const { Header, Content, Sider } = Layout;

export default function LayputPlay() {
  const [selectedComponent, setSelectedComponent] = useState<any | null>(null);
  const [curry, setCurry] = useState<any | null>(null);
  const [items3, setItems3] = useState<MenuProps['items']>([]);
  const { id } = useParams();
  const { objectTotal } = useComponentsStore(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    if (id && objectTotal) {
      const selected = objectTotal.find((item) => item.fname === id);
      console.log('Selected Object:', selected); 

      if (selected && selected.componentForm) {
        setSelectedComponent(selected.componentForm);

        const updatedItems3 = selected.componentForm.map((item, index) => ({
          key: `${item.form}`, 
          label: `${item.form || `Component ${index + 1}`}`, 
        }));
        console.log('Updated Menu items:', updatedItems3);
        setItems3(updatedItems3);
      }
    }
  }, [id, objectTotal]);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('Menu Clicked:', e.key)
    const component = selectedComponent?.find((item) => String(item.form) === e.key);
    console.log('Clicked component:', component);
    if (component) {

      setCurry([component]);
    }
  };

  useEffect(()=>{
    console.log('Curry:', curry);
  }, [curry])
  return (
    <Layout className="h-screen">
      <Header className="flex items-center justify-between bg-gray-900 text-white shadow-lg">
        <div className="text-2xl font-bold">ChangeLowCode</div>
        <Button
          type="primary"
          className="ml-auto"
          onClick={() => { navigate('/edit'); }} 
        >
          +创建项目
        </Button>
      </Header>
      <Layout>
        <Sider width={250} className="bg-gray-100 shadow-lg">
          <Menu
            mode="inline"
            selectedKeys={curry ? [curry[0].form] : []} // 使用 curry 来设置选中状态
            className="h-full border-r-0"
            items={items3}
            onClick={handleMenuClick}
          >
            
          </Menu>
        </Sider>
        <Layout className="p-6 bg-gray-100">
          <Content className="p-6 bg-white rounded-lg shadow-lg overflow-auto">
            {curry ? (
              <Preview components={curry} /> 
            ) : (
              <div className="text-center text-gray-500">请选择一个组件查看详细信息。</div>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
