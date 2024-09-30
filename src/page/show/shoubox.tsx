import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCoffee, faHeart, faStar, faUser } from '@fortawesome/free-solid-svg-icons';

// 定义一个图标数组
const icons = [faInfoCircle, faCoffee, faHeart, faStar, faUser];

interface ShowBoxChildProps {
  schemachild: number;
  jsoncode: string;
}

interface ShowBoxProps {
  schema?: string | number;
  title?: string | number;
  desc?: string;
  children?: Array<ShowBoxChildProps>;
  onNavigate?: () => void;
}

export default function ShowBox({ schema, title, desc, children, onNavigate }: ShowBoxProps) {


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
        <span className="text-gray-800 font-semibold">Child Schema: {child.schemachild}</span>
        <pre className="text-gray-700 font-mono">{child.jsoncode}</pre>
      </div>
    ));
  };

  return (
    <div
      className="w-32 h-44 bg-white rounded-lg shadow-lg border border-gray-200 m-6 p-4 flex flex-col items-start justify-start transition-transform transform hover:scale-105"
      onClick={handleNavigate}
    >
      <div className="flex flex-col items-center justify-center mb-2">
        <FontAwesomeIcon icon={randomIcon} size="2x" className="text-teal-500" />
      </div>
      <h2 className="text-gray-800 text-xl font-bold">{title}</h2>
      <p className="text-gray-600 text-sm font-semibold mb-2">{desc}</p>
      {children && (
        <div className="mt-2 border-t border-gray-200 pt-2">
          {renderChildren(children)}
        </div>
      )}
    </div>
  );
}
