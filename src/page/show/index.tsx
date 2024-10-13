import React, { CSSProperties, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowBox from "./shoubox";
import SelectBox from "./SelectBox"; // 导入选择框组件
import { Avatar, Button, FloatButton, Layout, Menu, Tooltip } from "antd";
import { useComponentsStore } from "../editor/stores/component-total";
import bgImage from "../../assets/cc.png";
import axios from "axios";
import DataShow from "../dataShow/index";
import CustomMenu from "./CustomMenu";
const { Header, Content, Sider } = Layout;
import { userEnv } from "../../utils/axios";
import CustomerServiceOutlined from "@ant-design/icons";
import CommentOutlined from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { CheckOutlined } from "@ant-design/icons";
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
  const [isSelectBoxVisible, setSelectBoxVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setData(objectTotal);
  }, [objectTotal]);

  const handleNavigate = (schema: string | number) => {
    const selectedItem = data?.find((item) => item.fname === schema);
    if (selectedItem) {
      localStorage.setItem(`${schema}`, JSON.stringify(selectedItem));
      navigate(`/schema/${schema}`);
    }
  };

  const handleSendRequest = () => {
    const res = userEnv();
    console.log(res);
  };

  const messageHandler = (event: MessageEvent) => {
    if (event.origin !== "http://localhost:3000") {
      return;
    }

    console.log("Received message from iframe:", event.data);

    if (event.data === "你好") {
      alert("接收到来自 iframe 的消息: " + event.data);
      event.source.postMessage("已收到你的消息！", event.origin);
    }
  };

  useEffect(() => {
    window.addEventListener("message", messageHandler);
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  const handleSelect = (selectedItem: FormObject) => {
    console.log("Selected item:", selectedItem);
    window.parent.postMessage(selectedItem, "*");
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const [open, setOpen] = useState<boolean>(true);
  return (
    <Layout className="h-screen">
      <Header className="flex items-center justify-between bg-gray-900 text-white shadow-lg p-4">
        <div className="text-2xl font-bold">ChangeLowCode</div>
        <div className="flex items-center">
          {/* 头像区域 */}
          <div className="relative right-4">
            <Avatar
              size={40}
              src="https://res.cloudinary.com/dru9kzzjh/image/upload/v1721460717/y9vrtpt8f050f7krizfa.jpg"
              className="border-2 border-white rounded-full shadow-md"
            />
            {/* 可以在这里添加一个状态指示器，比如在线状态 */}
            <span className="absolute bottom-2 right-0   block w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        </div>
      </Header>

      <Layout>
        <Sider
          width={100}
          className="bg-gray-800 text-white"
          collapsible
          collapsed={collapsed}
          onCollapse={toggleCollapsed}
          collapsedWidth={48}
        >
          <CustomMenu
            select={select}
            setSelect={setSelect}
            collapsed={collapsed}
          />
        </Sider>

        <div className="w-10 flex flex-col items-center space-y-4 mt-5">
          <Tooltip
            title={<span className="text-black">创建新应用</span>}
            placement="right" // 设置提示框在按钮的右侧
            overlayInnerStyle={{ backgroundColor: "white" }}
          >
            <Button
              type="default"
              shape="default"
              icon={<PlusOutlined />}
              size="small"
              onClick={() => {
                navigate("/edit");
              }}
              className="w-8 h-8 bg-gray-300 text-black hover:bg-gray-400 active:shadow-lg transition duration-200 ease-in-out"
            />
          </Tooltip>

          <Tooltip
            title={<span className="text-black">发送</span>}
            placement="right"
            overlayInnerStyle={{ backgroundColor: "white" }}
          >
            <Button
              type="default"
              shape="default"
              onClick={handleSendRequest}
              icon={<CloudDownloadOutlined />}
              size="small"
              className="w-8 h-8 bg-gray-300 text-black hover:bg-gray-400 active:shadow-lg transition duration-200 ease-in-out"
            />
          </Tooltip>

          <Tooltip
            title={<span className="text-black">选择应用</span>}
            placement="right"
            overlayInnerStyle={{ backgroundColor: "white" }}
          >
            <Button
              type="default"
              shape="default"
              icon={<CheckOutlined />}
              onClick={() => setSelectBoxVisible(true)}
              size="small"
              className="w-8 h-8 bg-gray-300 text-black hover:bg-gray-400 active:shadow-lg transition duration-200 ease-in-out"
            />
          </Tooltip>
        </div>

        <Layout className="p-6 bg-gray-200 ">
          <Content className="rounded-lg shadow-xl flex center overflow-y-visible relative bg-gray-100 ">
            {select === 1 ? (
              <div className="overflow-auto flex flex-wrap ml-10 mt-10">
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
              <div className="overflow-auto flex flex-wrap ml-10 mt-10">
                {data
                  ?.filter((item) => item.isTemplate)
                  .map((item) => (
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
                <DataShow />
              </>
            ) : null}
            <SelectBox
              visible={isSelectBoxVisible}
              onClose={() => setSelectBoxVisible(false)}
              data={data}
              onSelect={handleSelect}
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
