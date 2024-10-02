import { CommonComponentProps } from '../../interface';
import { Space as AntdSpace } from 'antd';

const Space = ({ id, children, styles, size }: CommonComponentProps) => {
    return (
        <div 
            data-component-id={id}
            style={styles}
            className="min-h-[100px] p-[20px]"
        >
            <AntdSpace size={size}>
                {children}
            </AntdSpace>
        </div>
    );
};

export default Space;
