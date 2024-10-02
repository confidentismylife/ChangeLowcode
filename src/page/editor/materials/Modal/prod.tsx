import { CommonComponentProps } from '../../interface';

function Modal({ id, children, title, styles }: CommonComponentProps) {
    return (
        <div 
            style={styles}
            data-component-id={id}  
            className="min-h-[100px] p-[20px]"
        >
            <h4>{title}</h4>
            <div>
                {children}
            </div>
        </div>
    );
}

export default Modal;
