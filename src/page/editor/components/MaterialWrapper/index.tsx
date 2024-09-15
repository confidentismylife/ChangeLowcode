import { Segmented } from "antd";
import { useState } from "react";
import { Material } from "../Material";
import { Outline } from "../Outline";
import { Source } from "../Source";

export function MaterialWrapper() {
    const [key, setKey] = useState<string>('物料');

    return (
        <div className="h-full flex flex-col bg-gray-100 p-4 rounded-lg shadow-lg">
            <Segmented
                value={key}
                onChange={setKey}
                block
                options={['物料', '大纲', '源码']}
                className="mb-4"
            />
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md overflow-auto">
                {key === '物料' && <Material />}
                {key === '大纲' && <Outline />}
                {key === '源码' && <Source />}
            </div>
        </div>
    );
}