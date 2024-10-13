import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

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

export default function ShowBox({
  schema,
  title,
  desc,
  imageSrc,
  children,
  onNavigate,
}: ShowBoxProps) {
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
        <span className="text-gray-700 font-semibold">
          Child Schema: {child.schemachild}
        </span>
        <pre className="text-gray-600 font-mono whitespace-pre-wrap break-words">
          {child.jsoncode}
        </pre>
      </div>
    ));
  };

  return (
    <div
      className="bg-gray-50 ml-7 hover:bg-gray-200 text-gray-800 w-72 h-56 mb-5 mr-5 rounded-lg border border-gray-300 shadow-lg p-4 flex flex-col justify-between relative cursor-pointer transition-all duration-200 ease-in-out"
      onClick={handleNavigate}
    >
      {/* 圆形组件在右上角 */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
      </div>

      <h2 className="text-gray-800 text-l font-bold text-center mb-2">
        {title || "标题"}
      </h2>

      {/* 添加图片部分 */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt="ShowBox Content"
          className="w-full h-32 object-cover rounded-md"
        />
      )}

      {children && (
        <div className="mt-2 border-t border-gray-300 pt-2">
          {renderChildren(children)}
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button className="bg-blue-600 text-white rounded px-2 py-1 ml-52 hover:bg-blue-500">
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </div>
    </div>
  );
}
