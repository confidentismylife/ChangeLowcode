import React from 'react';
import LineChart from './LineChart'; // 确保路径正确

export default function DataShow() {
    return (
        <div>
            <h1 className="text-center text-xl font-bold">首屏加载时间折线图</h1>
            <LineChart />
        </div>
    );
}
