import { useEffect, useMemo, useRef, useState } from "react";
import Ruler from "@scena/react-ruler";
import "./ruler.css"; // 记得添加 CSS 文件以确保样式正常

interface IFsRulerContainer {
  children: JSX.Element;
}

const FsRulerContainer = (props: IFsRulerContainer) => {
  const { children } = props;
  const [width] = useState(1920);
  const [height] = useState(1080);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [scale, setScale] = useState(1);
  const verticalRulerRef = useRef<null | Ruler>(null);
  const horizontalRulerRef = useRef<null | Ruler>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  let startX = 0,
      startY = 0;

  useEffect(() => {
    // 初始化拖拽和自动布局
    dragCanvas();
    autoLayoutCanvas();
    window.addEventListener("resize", handlePageResize);
    containerRef.current!.addEventListener("wheel", handleWheel, { passive: false });

    // 清理事件监听
    return () => {
      window.removeEventListener("resize", handlePageResize);
      containerRef.current!.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    // 当缩放变化时，调整滚动位置
    canvasRef.current && handleScroll();
  }, [scale]);

  const computedUnit = useMemo(() => {
    // 根据缩放比例计算单位
    if (scale > 1.5) return 25;
    else if (scale > 0.75 && scale <= 1.5) return 50;
    else if (scale > 0.4 && scale <= 0.75) return 100;
    else if (scale > 0.2 && scale <= 0.4) return 200;
    else return 400;
  }, [scale]);

  const computedDis = () => {
    // 计算容器与画布之间的距离
    const containerRect = containerRef.current!.getBoundingClientRect();
    const canvasRect = canvasRef.current!.getBoundingClientRect();
    const disX = Math.floor(containerRect.left) - Math.floor(canvasRect.left);
    const disY = Math.floor(containerRect.top) - Math.floor(canvasRect.top);
    return { disX, disY };
  };

  const handleScroll = () => {
    const { disX, disY } = computedDis();
    setPosX(Math.floor(disX / scale));
    setPosY(Math.floor(disY / scale));
  };

  const handleWheel = (e: WheelEvent) => {
    // 控制缩放
    if (e.ctrlKey) {
      e.preventDefault();
      setScale((prevScale) => {
        if (e.deltaY < 0) {
          return Math.min(prevScale + 0.1, 2); // 限制最大缩放为2
        } else {
          return Math.max(prevScale - 0.1, 0.5); // 限制最小缩放为0.5
        }
      });
    }
  };

  const dragCanvas = () => {
    canvasRef.current?.addEventListener("mousedown", (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startX = e.pageX + containerRef.current!.scrollLeft;
      startY = e.pageY + containerRef.current!.scrollTop;
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    // 拖动画布
    containerRef.current!.scrollLeft = startX - e.pageX;
    containerRef.current!.scrollTop = startY - e.pageY;
  };

  const handleMouseUp = () => {
    // 释放鼠标时清除事件监听
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const autoLayoutCanvas = () => {
    // 自适应画布布局
    const containerWidth = containerRef.current!.clientWidth - 40;
    const containerHeight = containerRef.current!.clientHeight;

    const containerRatio = containerWidth / containerHeight;
    const canvasRatio = width / height;
    let newScale = 1;
    if (canvasRatio > containerRatio) {
      newScale = Math.min(containerWidth / width, 1); // 限制最大为1
    } else {
      newScale = Math.min(containerHeight / height, 1); // 限制最大为1
    }
    setScale(newScale);
    setLayoutPos(newScale);
  };

  const setLayoutPos = (scale: number) => {
    const { disX, disY } = computedDis();
    containerRef.current!.scrollLeft += -disX - 20; // 适当调整
    containerRef.current!.scrollTop += -disY - (containerRef.current!.clientHeight - canvasRef.current!.clientHeight * scale) / 2;
  };

  const handlePageResize = () => {
    // 窗口大小改变时调整标尺
    verticalRulerRef.current?.resize();
    horizontalRulerRef.current?.resize();
  };

  return (
    <div className="fs-ruler-container">
      <div className="left">
        <div className="px-box">px</div>
        <Ruler
          ref={verticalRulerRef}
          type="vertical"
          lineColor="#aaa"
          textColor="#000"
          backgroundColor="#fff"
          negativeRuler={true}
          zoom={scale}
          scrollPos={posY}
          unit={computedUnit}
          segment={2}
          textOffset={[10, 0]}
        />
      </div>
      <div className="right">
        <div style={{ height: "20px" }}>
          <Ruler
            type="horizontal"
            ref={horizontalRulerRef}
            lineColor="#aaa"
            textColor="#000"
            backgroundColor="#fff"
            negativeRuler={true}
            zoom={scale}
            scrollPos={posX}
            unit={computedUnit}
            segment={2}
            textOffset={[0, 10]}
          />
        </div>
        <div className="content-container" ref={containerRef} onScroll={handleScroll}>
          <button
            className="content-button"
            onClick={autoLayoutCanvas}
          >
            自适应布局
          </button>
          <div className="content-layout" style={{ width: `${width * 2}px`, height: `${height * 2}px` }}>
            <div
              className="content-canvas"
              ref={canvasRef}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                transform: `scale(${scale})`,
                marginLeft: `-${Math.floor(width / 2)}px`,
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FsRulerContainer;
