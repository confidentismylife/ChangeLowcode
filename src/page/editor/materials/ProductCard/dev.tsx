import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { Card as AntdCard, Avatar, Button } from 'antd';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { CommonComponentProps } from '../../interface';
import useComponentsDrop from '../../stores/components-drop';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import HeartOutlined from '@ant-design/icons/HeartOutlined';
import type { DroppedItem } from '../../../type/DroppedItem';
import { addTrackingEvent } from '../../../../utils/trackingManager'; // 引入埋点管理模块

const { Meta } = AntdCard;

interface ProductCardProps extends CommonComponentProps {
  productImage: string; // 商品图片URL
  productName: string; // 商品名称
  productPrice: string; // 商品价格
  actions?: ReactNode[];
}

// 统一的埋点处理函数
const sendTrackingEvent = (eventType: string, data: any) => {
  addTrackingEvent(eventType, data); // 使用统一的埋点模块
  console.log(`埋点事件: ${eventType}`, data); // 控制台输出事件日志
};

function ProductCard({
  id,
  name,
  productImage = 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg', // 默认商品图片
  productName = '笔记本', // 默认商品名称
  productImageicon = 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
  productPrice = '¥10', // 默认价格
  styles = {}, // 外部样式
  actions = [
    <Button key="buy" type="primary" icon={<ShoppingCartOutlined />}>
      加入购物车
    </Button>,
    <Button key="wish" type="default" icon={<HeartOutlined />}>
      加入心愿单
    </Button>,
  ], // 默认操作按钮
}: Partial<ProductCardProps>) {
  const { components } = useComponentsDrop();
  const divRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 使用自定义 hook 处理拖拽
  const { handleDragOver, handleDrop } = useDragAndDrop(id);
  const droppedItem: DroppedItem = {
    id: id,
    name: name,
    dragType: 'move',
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(droppedItem)); // 设置拖拽数据
    console.log('拖拽开始', event);
  };

  // 按钮点击事件处理，调用埋点事件
  const handleActionClick = (actionType: string) => {
    sendTrackingEvent('action_click', {
      productId: id,
      productName,
      actionType,
    });
  };

  // 为每个按钮绑定点击事件
  const actionsWithClick = actions.map((action) =>
    React.cloneElement(action, {
      onClick: () => handleActionClick(action.key),
    })
  );

  // 监听图片加载事件
  useEffect(() => {
    const img = new Image();
    img.src = productImage;

    img.onload = () => {
      setImageLoaded(true);
      sendTrackingEvent('image_load_success', {
        productId: id,
        productName,
        productImage,
      });
    };

    img.onerror = () => {
      sendTrackingEvent('image_load_failure', {
        productId: id,
        productName,
        productImage,
      });
    };
  }, [id, productName, productImage]);

  return (
    <div
      className="min-h-[50px] p-[20px]"
      data-component-id={id}
      style={{ ...styles }} // 合并外部样式
      ref={divRef}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver} // 允许拖拽进入
      onDrop={handleDrop} // 处理放置事件
    >
      <AntdCard
        cover={<img alt="product" src={productImage} />} // 商品图片
        actions={actionsWithClick} // 操作按钮
        style={{ width: 300 }} // 设置宽度
      >
        <Meta
          avatar={<Avatar src={productImageicon} />} // 使用商品图片作为头像
          title={productName} // 商品名称
          description={`价格: ${productPrice}`} // 商品价格
        />
      </AntdCard>
    </div>
  );
}

export default ProductCard;
