import { Segmented, Button } from 'antd';
import { useState } from 'react';
import { Material } from "../Material";
import { Outline } from "../Outline";
import { Source } from "../Source";

interface MaterialWrapperProps {
    onToggle: () => void;
}

export function MaterialWrapper({ onToggle }: MaterialWrapperProps) {
    const [key, setKey] = useState<string>('物料');

    return (
        <div className="z-20 h-full flex flex-col bg-gray-100 p-4 rounded-lg shadow-lg relative"> {/* 添加 relative 以支持绝对定位 */}
            <Segmented
                value={key}
                onChange={setKey}
                block
                options={['物料', '大纲', '源码']}
                className="mb-4"
            />
            {/* 使用绝对定位的按钮 */}
            <Button
                onClick={onToggle} 
                className="absolute top-20 right-10" // 绝对定位
                type="primary" // 使用 Ant Design 的 primary 按钮样式
            >
                隐藏
            </Button>
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md overflow-auto">
                {key === '物料' && <Material />}
                {key === '大纲' && <Outline />}
                {key === '源码' && <Source />}
            </div>
        </div>
    );
}
