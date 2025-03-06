import { Allotment } from "allotment";
import 'allotment/dist/style.css';
import { Header } from "./components/Header";
import { EditArea } from "./components/EditArea";
import { Setting } from "./components/Setting";
import { MaterialWrapper } from "./components/MaterialWrapper";
import { useComponetsStore } from "./stores/components";
import Preview from "./components/Preivew";
import { useState } from "react";

export default function ReactPlayground() {
    const { mode } = useComponetsStore();
    const [isMaterialVisible, setMaterialVisible] = useState(true);
    const [isSettingVisible, setSettingVisible] = useState(true);

    return (
        <div className='h-[100vh] flex flex-col'>
            <div className='h-[60px] flex items-center border-b-[1px] border-[#000]'>
                <Header />
            </div>
            {
                mode === 'edit' 
                    ? <Allotment>
                        {isMaterialVisible && (
                            <Allotment.Pane preferredSize={300} maxSize={400} minSize={200}>
                                <MaterialWrapper onToggle={() => setMaterialVisible(prev => !prev)} />
                            </Allotment.Pane>
                        )}
                        <Allotment.Pane>
                            <EditArea />
                        </Allotment.Pane>
                        {isSettingVisible && (
                            <Allotment.Pane preferredSize={260} maxSize={500} minSize={300}>
                                <Setting onToggle={() => setSettingVisible(prev => !prev)} />
                            </Allotment.Pane>
                        )}
                    </Allotment>
                    : <Preview />
            }
            <button 
                onClick={() => setMaterialVisible(prev => !prev)} 
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 absolute left-4 top-16 z-10"
            >
                {isMaterialVisible ? '隐藏物料' : '显示物料'}
            </button>
            <button 
                onClick={() => setSettingVisible(prev => !prev)} 
                className="bg-blue-500 text-white px-4 py-2 rounded absolute right-6 z-10 bottom-10"
            >
                {isSettingVisible ? '隐藏设置' : '显示设置'}
            </button>
        </div>
    );
} 