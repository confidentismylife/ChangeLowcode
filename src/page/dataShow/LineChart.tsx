import React, { useEffect, useState } from "react";
import { getTrackingData } from "../../utils/trackingManager"; // 确保路径正确
import { Button, Table } from "antd"; // 引入 Ant Design 的 Table 组件

const TrackingDataTable = () => {
  const [trackingData, setTrackingData] = useState([]);

  // 模拟埋点数据更新
  const fetchTrackingData = async () => {
    const data = await getTrackingData();
    const events = [];

    data.forEach((event) => {
      if (event.eventType === "action_click") {
        events.push({
          key: events.length + 1,
          eventType: "点击事件",
          success: true,
          timestamp: event.createdAt,
          productId: event.data.productId,
          productName: event.data.productName,
          actionType: event.data.actionType,
        });
      } else if (event.eventType === "image_load_success") {
        events.push({
          key: events.length + 1,
          eventType: "图片加载事件",
          success: true,
          timestamp: event.createdAt,
          productId: event.data.productId,
          productName: event.data.productName,
          imageUrl: event.data.productImage,
        });
      } else {
        events.push({
          key: events.length + 1,
          eventType: "其他事件",
          success: true,
          timestamp: event.createdAt,
          otherEventType: event.eventType,
        });
      }
    });

    setTrackingData(events);
  };

  useEffect(() => {
    fetchTrackingData(); // 初始加载数据
  }, []);

  const columns = [
    { title: "事件 ID", dataIndex: "key", key: "key", width: 80, fixed: "left" },
    { title: "事件类型", dataIndex: "eventType", key: "eventType", width: 120, ellipsis: true },
    { title: "是否成功", dataIndex: "success", key: "success", width: 100, render: (success) => (success ? "成功" : "失败") },
    { title: "时间戳", dataIndex: "timestamp", key: "timestamp", width: 180, render: (timestamp) => new Date(timestamp).toLocaleString() },
    { title: "产品 ID", dataIndex: "productId", key: "productId", width: 120 },
    { title: "产品名称", dataIndex: "productName", key: "productName", width: 150, ellipsis: true },
    { title: "具体类型", dataIndex: "actionType", key: "actionType", width: 100, render: (text, record) => (record.eventType === "点击事件" ? text : null) },
    { title: "图片 URL", dataIndex: "imageUrl", key: "imageUrl", width: 200, ellipsis: true, render: (text, record) => (record.eventType === "图片加载事件" ? <a href={text} target="_blank" rel="noopener noreferrer">查看图片</a> : null) },
  ];

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <Button onClick={fetchTrackingData} className="mb-4 z-30 absolute top-[-5px] left-10 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
        点击更新数据
      </Button>
      <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
        <Table
          dataSource={trackingData}
          columns={columns}
          pagination={false}
          scroll={{ x: 1000 }} // 允许水平滚动
          bordered
          className="min-w-full"
        />
      </div>
    </div>
  );
};

export default TrackingDataTable;
