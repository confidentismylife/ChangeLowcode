
import { CommonComponentProps } from '../../interface';

const Container = ({ id, children, styles }: CommonComponentProps) => {
    console.log('Container', id, styles);

    return (
        <div 
            style={styles}
            className={`p-[20px]`}
        >{children}</div>
    )
}

export default Container;