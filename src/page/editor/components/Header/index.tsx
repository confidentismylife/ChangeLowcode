import { Button, Space, Modal, Input } from 'antd';
import { useState } from 'react';
import { useComponetsStore } from '../../stores/components';
import { useAddRemoteComponentConfig } from '../../hooks/useAddRemoteComponentConfig';

export function Header() {
    const { mode, setMode, setCurComponentId } = useComponetsStore();
    const [modalVisible, setModalVisible] = useState(false); // 控制 Modal 的显示
    const [inputUrl, setInputUrl] = useState(''); // 存储用户输入的 URL
    const [remoteUrl, setRemoteUrl] = useState('https://cdn.jsdelivr.net/npm/pjw-remote-component@1.0.3/dist/bundle.umd.js'); // 初始远程 URL

    // 调用自定义 Hook 加载远程组件
    useAddRemoteComponentConfig(remoteUrl);

    // 处理用户输入的 URL 并加载远程组件
    const handleLoadRemoteComponent = () => {
        setRemoteUrl(inputUrl); // 设置远程 URL
        setModalVisible(false); // 关闭 Modal
    };

    return (
        <div className='w-[100%] h-[100%]'>
            <div className='h-[50px] flex justify-between items-center px-[20px]'>
                <div>ChangeLowCode</div>
                <Space>
                    <Button type='primary'>保存</Button>
                    {mode === 'edit' && (
                        <Button
                            onClick={() => {
                                setMode('preview');
                                setCurComponentId(null);
                            }}
                            type='primary'
                        >
                            预览
                        </Button>
                    )}
                    {mode === 'preview' && (
                        <Button
                            onClick={() => setMode('edit')}
                            type='primary'
                        >
                            退出预览
                        </Button>
                    )}
                    {/* 加载远程组件按钮 */}
                    <Button
                        type='primary'
                        onClick={() => setModalVisible(true)} // 点击按钮显示 Modal
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
            >
                <Input
                    placeholder="输入远程组件 URL"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)} // 监听输入框变化
                />
            </Modal>
        </div>
    );
}
