import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Input, Badge, Avatar } from "antd";
import CustomMenu from "./CustomMenu";
import ShowBox from "./shoubox";

// 导入图标
import BellOutlined from "@ant-design/icons/lib/icons/BellOutlined";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

const { Header, Content } = Layout;

export default function Show() {
  const navigate = useNavigate();
  const [select, setSelect] = useState(1);
  const [collapsed, setCollapsed] = useState(false);
  const [searchText, setSearchText] = useState("");

  // 示例数据 - 我的应用
  const [myApps] = useState([
    {
      fname: "电商后台管理",
      desc: "包含商品管理、订单管理等功能的后台系统",
      updateTime: "2024-01-20",
      creator: "张三",
      status: "published"
    },
    {
      fname: "数据可视化大屏",
      desc: "实时数据展示和监控的可视化平台",
      updateTime: "2024-01-18",
      creator: "李四",
      status: "draft"
    },
    {
      fname: "CRM系统",
      desc: "客户关系管理系统，支持客户跟进和销售管理",
      updateTime: "2024-01-15",
      creator: "王五",
      status: "published"
    }
  ]);

  // 示例数据 - 模板中心
  const [templates] = useState([
    {
      fname: "后台管理系统模板",
      desc: "快速搭建企业级后台管理系统的模板",
      updateTime: "2024-01-19",
      creator: "系统模板",
      status: "published"
    },
    {
      fname: "数据大屏模板",
      desc: "适用于各类数据可视化展示的大屏模板",
      updateTime: "2024-01-17",
      creator: "系统模板",
      status: "published"
    }
  ]);

  // 渲染内容区域
  const renderContent = () => {
    switch (select) {
      case 1:
        return (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#18191c]">我的应用</h2>
              <p className="text-[#61666d] mt-1">管理和编辑你的低代码应用</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myApps.map((item, index) => (
                <div key={index} className="bili-card group">
                  <div className="h-32 bg-gradient-to-br from-[#e1f3ff] to-[#f0f8ff] rounded-md mb-4"></div>
                  <h3 className="text-lg font-medium text-[#18191c] group-hover:text-[#00aeec] transition-colors">
                    {item.fname}
                  </h3>
                  <p className="text-[#61666d] text-sm mt-1 line-clamp-2">{item.desc}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e3e5e7]">
                    <div className="flex items-center text-sm text-[#9499a0]">
                      <span>{item.creator}</span>
                      <span className="mx-2">·</span>
                      <span>{item.updateTime}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="px-3 py-1 text-sm rounded border border-[#e3e5e7] text-[#61666d] hover:bg-[#f6f7f8] transition-colors"
                        onClick={() => navigate("/edit")}
                      >
                        编辑
                      </button>
                      <button className="px-3 py-1 text-sm rounded border border-[#00aeec] text-[#00aeec] hover:bg-[#00aeec10] transition-colors">
                        预览
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#18191c]">模板中心</h2>
              <p className="text-[#61666d] mt-1">快速开始，选择一个模板开始创建</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((item, index) => (
                <div key={index} className="bili-card group">
                  <div className="h-32 bg-gradient-to-br from-[#e1f3ff] to-[#f0f8ff] rounded-md mb-4"></div>
                  <h3 className="text-lg font-medium text-[#18191c] group-hover:text-[#00aeec] transition-colors">
                    {item.fname}
                  </h3>
                  <p className="text-[#61666d] text-sm mt-1 line-clamp-2">{item.desc}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e3e5e7]">
                    <div className="flex items-center text-sm text-[#9499a0]">
                      <span>{item.creator}</span>
                      <span className="mx-2">·</span>
                      <span>{item.updateTime}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="px-3 py-1 text-sm rounded border border-[#00aeec] text-[#00aeec] hover:bg-[#00aeec10] transition-colors"
                        onClick={() => navigate("/edit")}
                      >
                        使用此模板
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case 3:
        return (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#18191c]">性能监控</h2>
            <p className="text-[#61666d] mt-1">实时监控应用性能指标</p>
            <div className="mt-4 p-6 bg-white rounded-lg border border-[#e3e5e7]">
              <p className="text-center text-[#61666d]">性能监控功能开发中...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout className="bili-layout">
      <Header className="bili-header flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-[#18191c] text-xl font-bold mr-8">低代码平台</h1>
          <button 
            className="bili-button flex items-center"
            onClick={() => navigate("/edit")}
          >
            <PlusOutlined className="mr-1" />
            创建应用
          </button>
        </div>
        <div className="flex items-center gap-6">
          <Input
            prefix={<SearchOutlined className="text-[#9499a0]" />}
            placeholder="搜索应用..."
            className="bili-search w-[240px]"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <div className="flex items-center gap-4">
            <Badge count={3} color="#00aeec">
              <BellOutlined className="bili-icon-btn text-xl" />
            </Badge>
            <Avatar
              size={36}
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              className="cursor-pointer ring-2 ring-[#e3e5e7] hover:ring-[#00aeec] transition-all"
            />
          </div>
        </div>
      </Header>

      <CustomMenu
        select={select}
        setSelect={setSelect}
        collapsed={collapsed}
      />

      <Layout className="ml-[200px] mt-[64px] min-h-[calc(100vh-64px)] bg-[#f1f2f3] p-6">
        <Content>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}
