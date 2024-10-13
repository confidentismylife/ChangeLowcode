import { Segmented, Button } from 'antd';
import { useState } from 'react';
import { useComponetsStore } from '../../stores/components';
import { ComponentAttr } from './ComponentAttr';
import { ComponentEvent } from './ComponentEvent';
import { ComponentStyle } from './ComponentStyle';

interface SettingProps {
    onToggle: () => void;
}

export function Setting({ onToggle }: SettingProps) {
    const { curComponentId } = useComponetsStore();
    const [key, setKey] = useState<string>('属性');

    if (!curComponentId) return null;

    return (
        <div className=" z-[1000] h-full flex flex-col bg-gray-100 p-4 rounded-lg shadow-l  ">
            <Segmented
                value={key}
                onChange={setKey}
                block
                options={['属性', '样式', '事件']}
                className="mb-4"
            />
            <Button onClick={onToggle} className="mb-4">
                切换
            </Button>
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md overflow-auto">
                {key === '属性' && <ComponentAttr />}
                {key === '样式' && <ComponentStyle />}
                {key === '事件' && <ComponentEvent />}
            </div>
        </div>
    );
}
