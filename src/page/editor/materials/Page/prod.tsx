import { CommonComponentProps } from "../../interface";

function Page({ id, name, children, styles }: CommonComponentProps) {
    console.log('Page', id, styles, name);


    return (
        <div
            className='p-[20px]'
            style={{ ...styles }}
        >
            {children}
        </div>
    )
}

export default Page;