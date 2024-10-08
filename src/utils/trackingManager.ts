import axios from 'axios';

// 定义全局埋点队列
let trackingQueue: any[] = [];

// 定时批量发送埋点数据
const sendTrackingBatch = () => {
  if (trackingQueue.length === 0) return;

  console.log('埋点数据发送成功:', trackingQueue);

  // 在这里进行数据处理，转换成图表需要的格式
  const chartData = trackingQueue.map(event => {
    return [event.data.loadingTime, event.timestamp]; // 假设你要展示加载时间和时间戳
  });

  // 将埋点数据发送到服务器
  // axios.post('/api/tracking', trackingQueue)
  //   .then(() => {
  //     console.log('埋点数据发送成功:', trackingQueue);
  //     trackingQueue = [];
  //   })
  //   .catch((error) => {
  //     console.error('埋点数据发送失败:', error);
  //   });
};

// 定时器，每 5 秒发送一次埋点数据
setInterval(sendTrackingBatch, 5000);

// 添加埋点到队列
export const addTrackingEvent = (eventType: string, data: any) => {
  trackingQueue.push({
    eventType,
    data,
    timestamp: new Date().toISOString(),
  });
};

// 导出当前的埋点数据
export const getTrackingData = () => {
  return trackingQueue.map(event => ({
    loadingTime: event.data.loadingTime,
    timestamp: event.timestamp,
  }));
};
