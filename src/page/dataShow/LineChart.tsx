import React, { useEffect, useState } from 'react';
import { addTrackingEvent, getTrackingData } from '../../utils/trackingManager'; // 确保路径正确

const TrackingDataTable = () => {
    const [trackingData, setTrackingData] = useState({
        clickEvents: [],
        imageLoadEvents: [],
        otherEvents: [],
    });

    // 模拟埋点数据更新
    const fetchTrackingData = () => {
        const data = getTrackingData();

        // 这里可以将数据分配到不同的事件类型
        // 这里假设只处理 loadingTime 的情况，你可以根据需要添加其他事件
        const clickEvents = data.map((event, index) => ({
            id: index + 1,
            eventType: 'click_event', // 示例事件类型
            success: true, // 模拟成功，实际情况可从 data 中获取
            timestamp: event.timestamp,
        }));

        // 更新状态
        setTrackingData({
            clickEvents,
            imageLoadEvents: [], // 假设没有图像加载事件
            otherEvents: [], // 假设没有其他事件
        });
    };

    useEffect(() => {
        fetchTrackingData(); // 初始加载数据

        const interval = setInterval(() => {
            fetchTrackingData(); // 每 5 秒更新数据
        }, 5000);

        // 清理函数
        return () => {
            clearInterval(interval); // 在组件卸载时清除定时器
        };
    }, []);

    return (
        <div>
            <h2>点击事件</h2>
            <table>
                <thead>
                    <tr>
                        <th>事件 ID</th>
                        <th>事件类型</th>
                        <th>是否成功</th>
                        <th>时间戳</th>
                    </tr>
                </thead>
                <tbody>
                    {trackingData.clickEvents.map((event) => (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>{event.eventType}</td>
                            <td>{event.success ? '成功' : '失败'}</td>
                            <td>{new Date(event.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>图片加载事件</h2>
            <table>
                <thead>
                    <tr>
                        <th>图片 URL</th>
                        <th>是否成功</th>
                        <th>时间戳</th>
                    </tr>
                </thead>
                <tbody>
                    {trackingData.imageLoadEvents.map((event, index) => (
                        <tr key={index}>
                            <td>{event.imageUrl}</td>
                            <td>{event.success ? '成功' : '失败'}</td>
                            <td>{new Date(event.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>其他事件</h2>
            <table>
                <thead>
                    <tr>
                        <th>事件 ID</th>
                        <th>事件类型</th>
                        <th>是否成功</th>
                        <th>时间戳</th>
                    </tr>
                </thead>
                <tbody>
                    {trackingData.otherEvents.map((event) => (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>{event.eventType}</td>
                            <td>{event.success ? '成功' : '失败'}</td>
                            <td>{new Date(event.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TrackingDataTable;
