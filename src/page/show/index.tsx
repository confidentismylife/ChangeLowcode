import React, { CSSProperties, useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import ShowBox from './shoubox';
import { Button, Layout, Menu } from 'antd';
import { useComponentsStore } from '../editor/stores/component-total';
import { divide } from 'lodash';

const { Header, Content, Sider } = Layout;
import bgImage from '../../assets/bg.png'; // 根据相对路径导入图片
interface SchemaItem {
  schema: string | number;
  title: string;
  desc: string;
  children?: any[];
}

// 定义 Component 接口，表示一个组件的结构
interface Component {
  name: string; // 组件的名称，用于唯一标识
  props: any; // 组件的属性
  styles?: CSSProperties; // 组件的样式，可选
  desc: string; // 组件的描述
  children?: Component[]; // 子组件，可选
  parentId?: number; // 父组件的 ID，可选
  uindex?: string | number; // 组件的索引，可选
  project?: string | number; // 组件所属的项目，可选
}

// 定义 FormObject 接口，表示一个表单对象的结构
interface FormObject {
  fname: string; // 表单对象的名称
  componentForm: Component[]; // 表单对象包含的组件列表
}

// 定义 ObjectTotal 接口，表示状态管理的整体结构
interface ObjectTotal {
  objectTotal: FormObject[]; // 所有表单对象的列表
}

export default function Show() {
  const navigate = useNavigate();
  const [data, setData] = useState<FormObject[]>();
  const { objectTotal } = useComponentsStore();
  const [select, setSelect] = useState(true);

  useEffect(() => {
    // 更新数据
    setData(objectTotal); 

  }, [objectTotal,select]);

  const handleNavigate = (schema: string | number) => {
    const selectedItem = data?.find(item => item.fname === schema);
    if (selectedItem) {
      localStorage.setItem(`${schema}`, JSON.stringify(selectedItem));
      navigate(`/schema/${schema}`); // 导航到对应的路由
    }
  };

  return (
    <Layout className="h-screen">
      <Header className="flex items-center justify-between bg-gray-900 text-white shadow-lg p-4">
        <div className="text-2xl font-bold">ChangeLowCode</div>
        <Button
          type="primary"
          className="ml-auto"
          onClick={() => { navigate('/edit'); }} 
        >
          + 创建表单
        </Button>
      </Header>
      <Layout>
        <Sider width={200} className="bg-gray-800 text-white">
          <Menu mode="inline" defaultSelectedKeys={['1']} className="bg-gray-800">
            <Menu.Item key="1" className="hover:bg-gray-700 bg-slate-200" onClick={() => setSelect(!select)}>
              我的应用
            </Menu.Item>
            <Menu.Item key="2" className="hover:bg-gray-700  bg-slate-200" onClick={() => setSelect(!select)}>
              模板应用
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="p-6 bg-gray-100">
          <Content className="p-6 bg-white rounded-lg shadow-lg flex center overflow-y-visible">
            { select ?  <div className='overflow-auto flex flex-wrap m-10 w-full'>
              {data?.map((item) => (
                <ShowBox
                imageSrc={bgImage}
                  key={item.fname} // 使用 fname 作为唯一键
                  title={item.fname}
                  onNavigate={() => handleNavigate(item.fname)}
                />
              ))}
            </div>:<div>123</div>
            }
            {/* 在这里添加 Outlet 以切换对应路由内容 */}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
