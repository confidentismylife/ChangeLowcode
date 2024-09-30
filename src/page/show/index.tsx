import React, { CSSProperties, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShowBox from './shoubox';
import { Layout } from 'antd';
import { useComponentsStore } from '../editor/stores/component-total';

const { Header, Content } = Layout;

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

  useEffect(() => {
    // 更新数据
    setData(objectTotal); 
  }, [objectTotal]);

  const handleNavigate = (schema: string | number) => {
    const selectedItem = data?.find(item => item.fname === schema);
    if (selectedItem) {
      localStorage.setItem(`${schema}`, JSON.stringify(selectedItem));
      navigate(`/schema/${schema}`);
    }
  };

  return (
    <Layout className="h-screen">
      <Header className="flex items-center justify-between bg-gray-900 text-white shadow-lg">
        <div className="text-2xl font-bold">ChangeLowCode</div>
      </Header>
      <Layout>  
        <Layout className="p-6 bg-gray-100">
          <Content className="p-6 bg-white rounded-lg shadow-lg flex center overflow-y-visible">
            <div className='overflow-auto flex flex-wrap m-10 w-full'>
              {data?.map((item) => (
                <ShowBox
                  key={item.fname} // 使用 schema 作为唯一键
                  title={item.fname}
                  // desc={item.desc}
                  // children={item.children}
                  onNavigate={() => handleNavigate(item.fname)}
                />
              ))}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
