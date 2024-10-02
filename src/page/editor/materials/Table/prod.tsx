import { Table as AntdTable } from 'antd';
import React, { useMemo } from 'react';
import { CommonComponentProps } from '../../interface';

function Table({ id, children, styles }: CommonComponentProps) {
    const columns = useMemo(() => {
        return React.Children.map(children, (item: any) => {
            return {
                title: <div className='m-[-16px] p-[16px]' data-component-id={item.props?.id}>{item.props?.title}</div>,
                dataIndex: item.props?.dataIndex,
                key: item.props?.id // 使用 item.props?.id 作为 key
            };
        });
    }, [children]);

    return (
        <div
            className="w-[100%]"
            data-component-id={id}
            style={styles}
        >
            <AntdTable
                columns={columns}
                dataSource={[]} // 根据需要填充数据源
                pagination={false}
            />
        </div>
    );
}

export default Table;
