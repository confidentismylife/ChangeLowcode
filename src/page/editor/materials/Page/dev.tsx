import { CommonComponentProps } from "../../interface";
import { useMaterailDrop } from "../../hooks/useMaterailDrop";
import useComponentsDrop from "../../stores/components-drop";

function Page({ id, name, children, styles }: CommonComponentProps) {
    const { components } = useComponentsDrop();
    const {canDrop, drop } = useMaterailDrop([...components], id);
    console.log('Page', id, name, children, styles);

    return (
        <div
            data-component-id={id}
            ref={drop}
            className='p-[20px] h-[100%] box-border'
            style={{ ...styles, border: canDrop ? '2px solid blue' : 'none' }}
        >
            {children}
        </div>
    )
}

export default Page;