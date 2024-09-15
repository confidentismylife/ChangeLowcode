import { Button, Space, Modal, Input } from 'antd';
import { useState } from 'react';
import { useComponetsStore } from '../../stores/components';
import { useAddRemoteComponentConfig } from '../../hooks/useAddRemoteComponentConfig';
import { useAddRemoteComponentConfigVue } from '../../hooks/useAddRemoteComponentComfigVue';
import { useNavigate } from 'react-router-dom';
import { useComponentsShow } from '../../stores/component-show';

export function Header() {
    const { mode, setMode, setCurComponentId, components } = useComponetsStore();
    const [modalVisible, setModalVisible] = useState(false); // 控制 Modal 的显示
    const [inputUrl, setInputUrl] = useState(''); // 存储用户输入的 URL
    const [remoteUrl, setRemoteUrl] = useState('https://cdn.jsdelivr.net/npm/pjw-remote-component@1.0.5/dist/bundle.umd.js'); // 初始远程 URL
    const navigate = useNavigate();
    const { addShowMessage } = useComponentsShow();
    const [locodeVisible, setLocodeVisible] = useState(false);
    const [name, setName] = useState(''); // 存储用户输入的 URL

    // 调用自定义 Hook 加载远程组件
    useAddRemoteComponentConfig(remoteUrl);
    // useAddRemoteComponentConfigVue('https://cdn.jsdelivr.net/npm/pjw-remote-component-vue@1.0.3/dist/bundle.umd.js')

    // 处理用户输入的 URL 并加载远程组件
    const handleLoadRemoteComponent = () => {
        setRemoteUrl(inputUrl); // 设置远程 URL
        setModalVisible(false); // 关闭 Modal
    };

    const slowhandel = () => {
        // 确保组件有唯一的 id
        const componentWithId = {
            ...components[0],
            uindex: components[0].id + Date.now(), // 如果没有 id，则生成一个唯一的时间戳作为 id
            project: name,
        };

        // 将组件对象转换为 JSON 字符串

        // 添加组件到状态管理
        addShowMessage(componentWithId);
        setLocodeVisible(false);
        // 使用 URL 编码的 JSON 字符串进行导航
        navigate(`/`);
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
                    {/* 加载远程组件按钮 */}
                    <Button
                        type='primary'
                        onClick={() => setModalVisible(true)} // 点击按钮显示 Modal
                        className='px-4 py-2'
                    >
                        加载远程组件
                    </Button>
                </Space>
            </div>

            {/* Modal 弹窗 */}
            <Modal
                title="输入远程组件 URL"
                open={modalVisible}
                onOk={handleLoadRemoteComponent} // 确认按钮点击时加载远程组件
                onCancel={() => setModalVisible(false)} // 取消时关闭 Modal
                className='rounded-lg shadow-lg'
            >
                <Input
                    placeholder="输入远程组件 URL"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)} // 监听输入框变化
                    className='rounded-lg'
                />
            </Modal>
            <Modal
                title="保存低代码"
                open={locodeVisible}
                onOk={slowhandel} // 确认按钮点击时加载远程组件
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