import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// 定义一个图标数组
const icons = [faInfoCircle, faEye];

interface ShowBoxChildProps {
  schemachild: number;
  jsoncode: string;
}

interface ShowBoxProps {
  schema?: string | number;
  title?: string | number;
  desc?: string;
  imageSrc?: string; // 添加 imageSrc 属性以传递图片路径
  children?: Array<ShowBoxChildProps>;
  onNavigate?: () => void;
}

export default function ShowBox({ schema, title, desc, imageSrc, children, onNavigate }: ShowBoxProps) {
  // 随机选择一个图标
  const randomIcon = icons[Math.floor(Math.random() * icons.length)];

  // 处理点击事件以导航到相应路径
  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  // 渲染子项
  const renderChildren = (children: Array<ShowBoxChildProps>) => {
    return children.map((child, index) => (
      <div key={index} className="mt-2">
        <span className="text-slate-800 font-semibold">Child Schema: {child.schemachild}</span>
        <pre className="text-slate-700 font-mono whitespace-pre-wrap break-words">{child.jsoncode}</pre>
      </div>
    ));
  };

  return (
    <div
      className="bg-slate-100 ml-7 hover:bg-slate-400 text-slate-800 w-80 h-56 rounded-lg shadow-lg p-4 flex flex-col justify-between relative cursor-pointer transition-all duration-200 ease-in-out"
      onClick={handleNavigate}
    >
      <div className="absolute top-4 left-4">
        <FontAwesomeIcon icon={randomIcon} size="2x" className="text-slate-800" />
      </div>
      <h2 className="text-slate-800 text-xl font-bold text-center">{title || '标题'}</h2>

      {/* 添加图片部分 */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt="ShowBox Content"
          className="w-full h-24 object-cover mt-2 rounded-md"
        />
      )}

      <div className="flex justify-center items-center mt-4"></div>
      
      {children && (
        <div className="mt-2 border-t border-slate-300 pt-2">
          {renderChildren(children)}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-red-500">未发布</span>
        <button className="bg-slate-700 text-white rounded px-2 py-1 hover:bg-slate-600 transition-colors duration-200">
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </div>
    </div>
  );
}
