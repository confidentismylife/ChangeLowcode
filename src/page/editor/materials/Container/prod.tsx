
import { CommonComponentProps } from '../../interface';

const Container = ({ id, children, styles }: CommonComponentProps) => {
  return (
    <div 
      data-component-id={id}
      style={{
        backgroundColor: styles?.backgroundColor || '#fff', // 默认白色背景
        borderRadius: styles?.borderRadius || '8px', // 默认圆角
        boxShadow: styles?.boxShadow || '0 4px 6px rgba(0, 0, 0, 0.1)', // 默认阴影
        border: styles?.border || '1px solid #ddd', // 默认边框
        width: styles?.width || '100%', // 默认宽度
        height: styles?.height || 'auto', // 默认高度
        padding: '20px', // 内边距
        minHeight: '100px', // 最小高度
        ...styles, // 允许传入自定义样式覆盖
      }}
      className="min-h-[100px] p-[20px] border-[1px] border-[#000]"
    >
      {children}
    </div>
  );
};

export default Container;
