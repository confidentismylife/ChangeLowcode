import React, { CSSProperties, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShowBox from './shoubox';
import SelectBox from './SelectBox'; // 导入选择框组件
import { Button, Layout, Menu } from 'antd';
import { useComponentsStore } from '../editor/stores/component-total';
import bgImage from '../../assets/bg.png';
import axios from 'axios';
import DataShow from '../dataShow/index'
const { Header, Content, Sider } = Layout;

interface Component {
  name: string;
  props: any;
  styles?: CSSProperties;
  desc: string;
  children?: Component[];
  parentId?: number;
  uindex?: string | number;
  project?: string | number;
}

interface FormObject {
  fname: string;
  componentForm: Component[];
  isTemplate: boolean;
}

export default function Show() {
  const navigate = useNavigate();
  const [data, setData] = useState<FormObject[]>([]);
  const { objectTotal } = useComponentsStore();
  const [select, setSelect] = useState(1);
  const [isSelectBoxVisible, setSelectBoxVisible] = useState(false); // 控制选择框的显示状态

  useEffect(() => {
    setData(objectTotal);
  }, [objectTotal]);

  const handleNavigate = (schema: string | number) => {
    const selectedItem = data?.find(item => item.fname === schema);
    if (selectedItem) {
      localStorage.setItem(`${schema}`, JSON.stringify(selectedItem));
      navigate(`/schema/${schema}`);
    }
  };

  const handleSendRequest = () => {
    axios.get('http://localhost/api/data')
      .then(response => {
        console.log('Response from Koa server:', response.data);
        
        // 发送获取到的数据到主程序
        window.parent.postMessage(response.data, '*'); // 向父窗口发送数据
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const messageHandler = (event: MessageEvent) => {
    // 可选：验证消息来源
    if (event.origin !== 'http://localhost:3000') {
      return;
    }

    console.log('Received message from iframe:', event.data);
    
    if (event.data === '你好') {
      alert('接收到来自 iframe 的消息: ' + event.data);

      // 发送通知回 iframe
      event.source.postMessage('已收到你的消息！', event.origin);
    }
  };

  // 监听来自 iframe 的消息
  useEffect(() => {
    // 添加事件监听器
    window.addEventListener('message', messageHandler);
  
    // 清理事件监听器
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  const handleSelect = (selectedItem: FormObject) => {
    // 在这里发送选中的数据给主程序
    console.log('Selected item:', selectedItem);
    // 发送选中的数据给主程序
    window.parent.postMessage(selectedItem, '*');

  };

  return (
    <Layout className="h-screen">
      <Header className="flex items-center justify-between bg-gray-900 text-white shadow-lg p-4">
        <div className="text-2xl font-bold">ChangeLowCode</div>
      </Header>
      <Layout>
        <Sider width={200} className="bg-gray-800 text-white">
          <Menu mode="inline" defaultSelectedKeys={['1']} className="bg-gray-800">
            <Menu.Item key="1" className="hover:bg-gray-700 bg-slate-200" onClick={() => setSelect(1)}>
              我的应用
            </Menu.Item>
            <Menu.Item key="2" className="hover:bg-gray-700 bg-slate-200" onClick={() => setSelect(2)}>
              模板应用
            </Menu.Item>
            <Menu.Divider className="my-2" />
            <Menu.Item key="3" className="hover:bg-gray-700 bg-slate-200" onClick={() => setSelect(3)}>
              性能监控
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="p-6 bg-gray-200 ">
          <Content className="rounded-lg shadow-xl flex center overflow-y-visible relative bg-gray-100 ">
            {select === 1 ? (
              <div className='overflow-auto flex flex-wrap ml-10 mt-16'>
                <Button
                  type="primary"
                  className="ml-auto absolute left-10 top-6"
                  onClick={() => { navigate('/edit'); }}
                >
                  + 创建表单
                </Button>
                <Button
                  type="primary"
                  className="ml-auto absolute left-40 top-6"
                  onClick={handleSendRequest}
                >
                  + 发送请求
                </Button>
                <Button
                  type="primary"
                  className="ml-auto absolute left-72 top-6"
                  onClick={() => setSelectBoxVisible(true)} // 打开选择框
                >
                  + 选择 ShowBox
                </Button>
                {data?.map((item) => (
                  <ShowBox
                    imageSrc={bgImage}
                    key={item.fname}
                    title={item.fname}
                    onNavigate={() => handleNavigate(item.fname)}
                  />
                ))}
              </div>
            ) : select === 2 ? (
              <div className='overflow-auto flex flex-wrap ml-10 mt-16'>
                {data?.filter(item => item.isTemplate).map((item) => (
                  <ShowBox
                    imageSrc={bgImage}
                    key={item.fname}
                    title={item.fname}
                    onNavigate={() => handleNavigate(item.fname)}
                  />
                ))}
              </div>
            ) : select === 3 ? (
              <>
                <div>性能监控内容</div>
                <DataShow></DataShow>
              </>
            ) : null}
            <SelectBox
              visible={isSelectBoxVisible}
              onClose={() => setSelectBoxVisible(false)} // 关闭选择框
              data={data}
              onSelect={handleSelect} // 选择项回调
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
