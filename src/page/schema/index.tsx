import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Menu, MenuProps } from 'antd';
import { Preview } from './preivew'; // 注意文件名的小写形式

const { Header, Content, Sider } = Layout;

interface SchemaChild {
  schemachild: number;
  jsoncode: string;
  title: string;
  desc: string;
}

interface SchemaItem {
  schema: string | number;
  title: string;
  desc: string;
  children?: SchemaChild[];
}

export default function Show() {
  const [key, setKey] = useState<SchemaItem | null>(null); // 初始值应为 null
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<MenuProps['items']>([]);

  useEffect(() => {
    // 获取并解析存储的值
    const storedValue = localStorage.getItem(id);
    if (storedValue) {
      try {
        const parsedValue = JSON.parse(storedValue);
        setKey(parsedValue); // 更新为对象
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
  }, [id]);

  useEffect(() => {
    JSON.parse(jsonData)
    // 当 key 更新时，生成菜单项
    if (key?.children) {
      const menuItems = key.children.map((child, index) => ({
        label: child.title,
        key: `child-${index}`,
      }));
      setItems(menuItems);
    }
  }, [key]);

  // 将 JSON 数据提取到常量中
  const jsonData = `[
        {
          "id": 1,
          "name": "Page",
          "props": {},
          "desc": "页面",
          "children": [
            {
              "id": 1727680422094,
              "name": "Container",
              "desc": "容器",
              "props": {},
              "parentId": 1,
              "children": [
                {
                  "id": 1727680427022,
                  "name": "Table",
                  "desc": "表格",
                  "props": {},
                  "parentId": 1727680422094
                },
                {
                  "id": 1727680428510,
                  "name": "Form",
                  "desc": "表单",
                  "props": {},
                  "parentId": 1727680422094
                }
              ]
            },
            {
              "id": 1727680434453,
              "name": "Container",
              "desc": "容器",
              "props": {},
              "parentId": 1
            }
          ],
          "curComponentId": 1727680434453,
          "curComponent": {
            "id": 1727680434453,
            "name": "Container",
            "desc": "容器",
            "props": {},
            "parentId": 1
          },
          "mode": "edit"
        }
      ]
      `;

  return (
    <Layout className="h-screen">
      <Header className="flex items-center justify-between bg-gray-900 text-white shadow-lg">
        <div className="text-2xl font-bold">ChangeLowCode</div>
      </Header>
      <Layout className="p-6 bg-gray-100">
        <Content className="p-6 bg-white rounded-lg shadow-lg flex center overflow-y-visible">
          <Sider width={230} className="bg-gray-100 shadow-lg overflow-hidden">
            <div className="h-10 border-r-0 bg-orange-200 flex justify-center items-center">
              {key ? <div>{key.title}</div> : <div>未找到相关数据</div>}
            </div>
            <Menu
              mode="inline"
              items={items}
              className="h-full border-r-0"
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </Sider>
          <div className="overflow-auto flex flex-wrap m-10">
            <Preview components={[JSON.parse(jsonData)]} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
