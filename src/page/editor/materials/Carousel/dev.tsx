import { useState, useEffect, useRef } from 'react';
import { CommonComponentProps } from "../../interface";
import { useDragAndDrop } from '../../hooks/useDragAndDrop'; // 假设你有这个自定义 hook
import './Carousel.css'; // 引入 Carousel 样式
import { DroppedItem } from '../../../type/DroppedItem';

interface CarouselProps extends CommonComponentProps {
    images: string[]; // 图片地址数组
    interval?: number; // 自动播放间隔，默认为 3000ms
    width?: number | string;
    height?: number | string;
    showIndicators?: boolean; // 是否显示指示器
    showArrows?: boolean; // 是否显示左右箭头
    styles?: React.CSSProperties; // 接收外部样式
}

const Carousel = ({
    id,
    name,
    interval = 3000, // 默认 3 秒自动切换
    width = 300,
    height = 200,
    showIndicators = true,
    showArrows = true,
    styles,
}: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef<number | null>(null);
    const divRef = useRef<HTMLDivElement>(null); // 用于引用外层容器

    const images = [
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    ];
    const totalImages = images.length;

    // 使用自定义 hook 来处理拖拽事件
    const { handleDragOver, handleDrop } = useDragAndDrop(id);

    // 自动切换逻辑
    useEffect(() => {
        if (!isHovered) {
            timerRef.current = window.setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
            }, interval);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentIndex, isHovered, interval, totalImages]);

    // 手动切换到下一张
    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
    };

    // 手动切换到上一张
    const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
    };  
    const ppp: DroppedItem = {
        id: id,
        name: name,
        dragType: 'move',
      };
    
      const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(ppp));
      };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <div
            data-component-id={id}
            className="carousel"
            ref={divRef} // 为容器添加引用
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            draggable // 设置为可拖拽
            onDragStart={handleDragStart} // 开始拖拽
            onDragOver={handleDragOver} // 允许拖拽
            onDrop={handleDrop} // 处理放置事件
            style={{
                width: width + 'px',
                height: height + 'px',
                position: 'relative',
                overflow: 'hidden',
                ...styles, // 合并外部样式
            }}
        >
            {totalImages > 0 ? (
                <div
                    className="carousel-track"
                    style={{
                        display: 'flex',
                        transition: 'transform 0.5s ease',
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {images.map((src, index) => (
                        <div key={index} className="carousel-slide" style={{ flex: '0 0 100%' }}>
                            <img
                                src={src}
                                alt={`Slide ${index}`}
                                style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    className="carousel-skeleton"
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#e0e0e0', // 默认背景色
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '1.5rem',
                        color: '#999',
                    }}
                >
                    暂无图片可显示
                </div>
            )}

            {showArrows && (
                <>
                    <button className="carousel-prev" onClick={goToPrev}>
                        ❮
                    </button>
                    <button className="carousel-next" onClick={goToNext}>
                        ❯
                    </button>
                </>
            )}

            {showIndicators && (
                <div className="carousel-indicators">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${currentIndex === index ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carousel;
