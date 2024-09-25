import React, { useEffect, useRef, ReactNode } from 'react';
import { Card as AntdCard, Avatar } from 'antd';
import { useMaterailDrop } from '../../hooks/useMaterailDrop';
import { useDrag } from 'react-dnd';
import { CommonComponentProps } from '../../interface';
import useComponentsDrop from '../../stores/components-drop';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';


const { Meta } = AntdCard;

interface CardProps extends CommonComponentProps {
    title?: string; // Make title optional
    extra?: string; // Keep extra as a string
    style?: React.CSSProperties; // Use React's CSSProperties for inline styles
    bordered: boolean;
    cover?: string; // Add cover image URL
    actions?: ReactNode[]; // Allow custom actions
    avatar?: string; // Add avatar URL for Meta
    description?: string; // Add description for Meta
}

function Card({
    id,
    name,
    title = 'Default Title',
    extra,
    style,
    children,
    styles,
    bordered,
    cover,
    actions,
    avatar,
    description,
}: Partial<CardProps>) {
    const { components } = useComponentsDrop();
    const { canDrop, drop } = useMaterailDrop([...components], (id as number));
    const divRef = useRef<HTMLDivElement>(null);

    const [, drag] = useDrag({
        type: name || 'default', // Provide a default type if name is undefined
        item: { type: name || 'default', dragType: 'move', id },
    });

    useEffect(() => {
        if (divRef.current) {
            drop(divRef);
            drag(divRef);
        }
    }, [drop, drag]);

    // Parse extra as string, e.g., "https://example.com:More"
    const parseExtra = (extra?: string) => {
        if (!extra) return null;
        const [url, value] = extra.split(':'); // Use ':' as a delimiter
        return { url, value };
    };

    const extraContent = parseExtra(extra);

    return (
        <div
            className={`w-full min-h-[50px] p-[20px] border ${canDrop ? 'border-2 border-blue-500' : 'border-black'}`}
            data-component-id={id}
            style={{ ...styles }} // Combine external styles with inline styles
            ref={divRef}
        >
            <AntdCard
                title={title}
                cover={cover ? <img alt="cover" src={cover} /> : null}
                actions={actions || [
                    <SettingOutlined key="setting" />,
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />,
                ]}
                extra={extraContent ? (
                    <a href={extraContent.url} style={{ color: 'blue' }}>
                        {extraContent.value}
                    </a>
                ) : null}
                style={style}
                bordered={bordered}
            >
                {avatar && <Meta avatar={<Avatar src={avatar} />} title={title} description={description} />}
                {children}
            </AntdCard>
        </div>
    );
}

export default Card;
