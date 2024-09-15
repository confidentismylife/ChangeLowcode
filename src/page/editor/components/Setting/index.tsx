import { Segmented } from 'antd';
import { useState } from 'react';
import { useComponetsStore } from '../../stores/components';
import { ComponentAttr } from './ComponentAttr';
import { ComponentEvent } from './ComponentEvent';
import { ComponentStyle } from './ComponentStyle';

export function Setting() {
    const { curComponentId } = useComponetsStore();
    const [key, setKey] = useState<string>('属性');

    if (!curComponentId) return null;

    return (
        <div className="h-full flex flex-col bg-gray-100 p-4 rounded-lg shadow-lg">
            <Segmented
                value={key}
                onChange={setKey}
                block
                options={['属性', '样式', '事件']}
                className="mb-4"
            />
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md overflow-auto">
                {key === '属性' && <ComponentAttr />}
                {key === '样式' && <ComponentStyle />}
                {key === '事件' && <ComponentEvent />}
            </div>
        </div>
    );
}