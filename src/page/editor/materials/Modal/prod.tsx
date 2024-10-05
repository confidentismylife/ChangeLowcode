import { Modal as AntdModal } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { CommonComponentProps } from '../../interface';

export interface ModalRef {
    open: () => void;
    close: () => void;
}

const Modal: React.ForwardRefRenderFunction<ModalRef, CommonComponentProps> = (
    { children, title, onOk, onCancel, styles },
    ref
) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
    }), []);

    return (
        <AntdModal
            title={title}
            open={open}
            onCancel={() => {
                if (onCancel) {
                    onCancel();
                }
                setOpen(false);
            }}
            onOk={() => {
                if (onOk) {
                    onOk();
                }
            }}
            destroyOnClose
            modalStyle={styles} // 直接将样式传递给 Modal
            bodyStyle={{
                maxHeight: '70vh', // 最大高度
                overflowY: 'auto', // 允许垂直滚动
                padding: '16px', // 内边距
            }}
            forceRender // 强制渲染，确保子组件在 Modal 打开时渲染
        >
            {children}
        </AntdModal>
    );
};

export default forwardRef(Modal);
