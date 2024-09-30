import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LineChart = () => {
    const chartRef = useRef(null); // 用于获取图表 DOM 元素

    // 假设的首屏加载时间数据
    const loadingTimeData = [
        [20, 120],
        [50, 200],
        [40, 50],
    ];

    useEffect(() => {
        // 初始化 ECharts 实例
        const myChart = echarts.init(chartRef.current);

        // 图表配置
        const option = {
            xAxis: {
                type: 'value',
                name: '时间 (ms)', // 设置横坐标的名称
                min: 0, // 设置横坐标最小值
                max: 100, // 设置横坐标最大值
            },
            yAxis: {
                type: 'value',
                name: '加载时间 (ms)', // 设置纵坐标的名称
                min: 0,
                max: 250,
            },
            series: [
                {
                    data: loadingTimeData, // 使用假设的数据
                    type: 'line',
                    smooth: true, // 平滑折线
                },
            ],
        };

        // 设置配置项
        myChart.setOption(option);

        // 清理函数
        return () => {
            myChart.dispose(); // 在组件卸载时销毁图表实例
        };
    }, [loadingTimeData]);

    return (
        <div
            ref={chartRef}
            style={{ width: '100%', height: '400px' }} // 设置图表的大小
        />
    );
};

export default LineChart;
