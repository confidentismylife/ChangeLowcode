import { Button, Space, Modal, Input } from 'antd';
import { useState } from 'react';
import { useComponetsStore } from '../../stores/components';
import { useAddRemoteComponentConfig } from '../../hooks/useAddRemoteComponentConfig';
import { useAddRemoteComponentConfigVue } from '../../hooks/useAddRemoteComponentComfigVue';
import { useNavigate } from 'react-router-dom';
import { useComponentsShow } from '../../stores/component-show';

export function Header() {
    const { mode, setMode, setCurComponentId, components } = useComponetsStore();
    const [modalVisibleReact, setModalVisibleReact] = useState(false); // 控制 React Modal 的显示
    const [modalVisibleVue, setModalVisibleVue] = useState(false); // 控制 Vue Modal 的显示
    const [inputUrlReact, setInputUrlReact] = useState(''); // 存储用户输入的 React 组件 URL
    const [inputUrlVue, setInputUrlVue] = useState(''); // 存储用户输入的 Vue 组件 URL
    const [remoteUrlReact, setRemoteUrlReact] = useState('https://cdn.jsdelivr.net/npm/pjw-remote-component@1.0.5/dist/bundle.umd.js'); // React 初始远程 URL
    const [remoteUrlVue, setRemoteUrlVue] = useState('https://cdn.jsdelivr.net/npm/pjw-remote-component-vue@1.0.3/dist/bundle.umd.js'); // Vue 初始远程 URL
    const navigate = useNavigate();
    const { addShowMessage } = useComponentsShow();
    const [locodeVisible, setLocodeVisible] = useState(false);
    const [name, setName] = useState(''); // 存储用户输入的名称

    // 调用自定义 Hook 分别加载远程 React 和 Vue 组件
    useAddRemoteComponentConfig(remoteUrlReact);
    useAddRemoteComponentConfigVue(remoteUrlVue);

    // 处理 React 组件的 URL 输入并加载远程组件
    const handleLoadRemoteReactComponent = () => {
        setRemoteUrlReact(inputUrlReact); // 设置远程 React URL
        setModalVisibleReact(false); // 关闭 React Modal
    };

    // 处理 Vue 组件的 URL 输入并加载远程组件
    const handleLoadRemoteVueComponent = () => {
        setRemoteUrlVue(inputUrlVue); // 设置远程 Vue URL
        setModalVisibleVue(false); // 关闭 Vue Modal
    };

    const slowhandel = () => {
        // 确保组件有唯一的 id
        const componentWithId = {
            ...components[0],
            uindex: components[0].id + Date.now(), // 如果没有 id，则生成一个唯一的时间戳作为 id
            project: name,
        };

        // 添加组件到状态管理
        addShowMessage(componentWithId);
        setLocodeVisible(false);
        navigate(`/`); // 导航回首页
    };

    return (
        <div className='w-full h-full'>
            <div className='h-full flex justify-between items-center px-[20px] bg-gray-900 text-white shadow-lg'>
                <div className='text-xl font-bold'>ChangeLowCode</div>
                <Space>
                    <Button type='primary' onClick={() => setLocodeVisible(true)} className='px-4 py-2'>保存</Button>
                    {mode === 'edit' && (
                        <Button
                            onClick={() => {
                                setMode('preview');
                                setCurComponentId(null);
                            }}
                            type='primary'
                            className='px-4 py-2'
                        >
                            预览
                        </Button>
                    )}
                    {mode === 'preview' && (
                        <Button
                            onClick={() => setMode('edit')}
                            type='primary'
                            className='px-4 py-2'
                        >
                            退出预览
                        </Button>
                    )}
                    {/* 加载远程 React 组件按钮 */}
                    <Button
                        type='primary'
                        onClick={() => setModalVisibleReact(true)} // 点击按钮显示 React Modal
                        className='px-4 py-2'
                    >
                        加载远程 React 组件
                    </Button>

                    {/* 加载远程 Vue 组件按钮 */}
                    <Button
                        type='primary'
                        onClick={() => setModalVisibleVue(true)} // 点击按钮显示 Vue Modal
                        className='px-4 py-2'
                    >
                        加载远程 Vue 组件
                    </Button>
                </Space>
            </div>

            {/* React Modal 弹窗 */}
            <Modal
                title="输入远程 React 组件 URL"
                open={modalVisibleReact}
                onOk={handleLoadRemoteReactComponent} // 确认按钮点击时加载远程 React 组件
                onCancel={() => setModalVisibleReact(false)} // 取消时关闭 React Modal
                className='rounded-lg shadow-lg'
            >
                <Input
                    placeholder="输入远程 React 组件 URL"
                    value={inputUrlReact}
                    onChange={(e) => setInputUrlReact(e.target.value)} // 监听 React URL 输入框变化
                    className='rounded-lg'
                />
            </Modal>

            {/* Vue Modal 弹窗 */}
            <Modal
                title="输入远程 Vue 组件 URL"
                open={modalVisibleVue}
                onOk={handleLoadRemoteVueComponent} // 确认按钮点击时加载远程 Vue 组件
                onCancel={() => setModalVisibleVue(false)} // 取消时关闭 Vue Modal
                className='rounded-lg shadow-lg'
            >
                <Input
                    placeholder="输入远程 Vue 组件 URL"
                    value={inputUrlVue}
                    onChange={(e) => setInputUrlVue(e.target.value)} // 监听 Vue URL 输入框变化
                    className='rounded-lg'
                />
            </Modal>

            {/* 保存低代码 Modal 弹窗 */}
            <Modal
                title="保存低代码"
                open={locodeVisible}
                onOk={slowhandel} // 确认按钮点击时保存低代码组件
                onCancel={() => setLocodeVisible(false)} // 取消时关闭 Modal
                className='rounded-lg shadow-lg'
            >
                <Input
                    placeholder="输入名称"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // 监听输入框变化
                    className='rounded-lg'
                />
            </Modal>
        </div>
    );
}
