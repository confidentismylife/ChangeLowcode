import axios from 'axios';

// 定义全局埋点队列
let trackingQueue: any[] = [];

// 定时批量发送埋点数据
const sendTrackingBatch = () => {
  if (trackingQueue.length === 0) return;

  console.log('准备发送埋点数据:', trackingQueue);

  // 将埋点数据发送到服务器
  axios.post('/api/tracking', trackingQueue)
    .then(() => {
      console.log('埋点数据发送成功:', trackingQueue);
      trackingQueue = []; // 清空队列
    })
    .catch((error) => {
      console.error('埋点数据发送失败:', error);
      // 不清空队列，保留数据以便重试
    });
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

  // 检查队列长度，超过阈值时立即发送
  if (trackingQueue.length >= 10) {
    sendTrackingBatch(); // 队列满 10 项后立即发送
  }

  // 检查队列最大长度，防止溢出
  if (trackingQueue.length > 1000) {
    console.warn('埋点队列已满，丢弃最早的数据');
    trackingQueue.shift(); // 删除最早的一项数据
  }
};

// 导出当前的埋点数据
export const getTrackingData = async () => {
  try {
    const response = await axios.get('/api/tracking/getall', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    console.log('埋点数据获取成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching tracking data:', error);
    return []; // 返回空数组以防止应用崩溃
  }
};
