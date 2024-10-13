import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { Card as AntdCard, Avatar, Button } from 'antd';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { CommonComponentProps } from '../../interface';
import useComponentsDrop from '../../stores/components-drop';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import HeartOutlined from '@ant-design/icons/HeartOutlined';
import { addTrackingEvent } from '../../../../utils/trackingManager';

const { Meta } = AntdCard;

interface ProductCardProps extends CommonComponentProps {
  productImage: string; // 商品图片URL
  productName: string; // 商品名称
  productPrice: string; // 商品价格
  actions?: ReactNode[]; // 操作按钮
  skdopen?: boolean; // 开启监控的布尔值
}

const ProductCard: React.FC<Partial<ProductCardProps>> = ({
  id,
  productImage = 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
  productName = '笔记本',
  productImageicon = 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
  productPrice = '¥10',
  styles = {},
  actions = [
    <Button key="buy" type="primary" icon={<ShoppingCartOutlined />}>
      加入购物车
    </Button>,
    <Button key="wish" type="default" icon={<HeartOutlined />}>
      加入心愿单
    </Button>,
  ],
  skdopen = false,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { handleDragOver, handleDrop } = useDragAndDrop(id);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ id, name: productName, dragType: 'move' }));
  };

  const sendTrackingEvent = (eventType: string, data: any) => {
    addTrackingEvent(eventType, data);
    console.log(`埋点事件: ${eventType}`, data);
  };

  const handleActionClick = (actionType: string) => {
    if (skdopen) {
      sendTrackingEvent('action_click', { productId: id, productName, actionType });
    }
  };

  useEffect(() => {
    const img = new Image();
    img.src = productImage;

    img.onload = () => {
      setImageLoaded(true);
      if (skdopen) {
        sendTrackingEvent('image_load_success', { productId: id, productName, productImage });
      }
    };

    img.onerror = () => {
      if (skdopen) {
        sendTrackingEvent('image_load_failure', { productId: id, productName, productImage });
      }
    };
  }, [productImage, id, productName, skdopen]);

  return (
    <div
      className="min-h-[50px] p-[20px]"
      data-component-id={id}
      style={{ ...styles }}
      ref={divRef}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <AntdCard
        cover={<img alt="product" src={productImage} />}
        actions={React.Children.map(actions, (action) =>
          React.cloneElement(action as React.ReactElement, {
            onClick: () => handleActionClick((action as React.ReactElement).key as string),
          })
        )}
        style={{ width: 300 }}
      >
        <Meta
          avatar={<Avatar src={productImageicon} />}
          title={productName}
          description={`价格: ${productPrice}`}
        />
      </AntdCard>
    </div>
  );
};

export default ProductCard;
             