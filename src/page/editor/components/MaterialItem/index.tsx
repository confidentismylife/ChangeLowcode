import { useDrag } from "react-dnd";

export interface MaterialItemProps {
    name: string;
    desc: string;
}

export function MaterialItem(props: MaterialItemProps) {
    const { name, desc } = props;

    const [_, drag] = useDrag({
        type: name,
        item: { type: name },
    });
    console.log(_)
    return (
        <div
            ref={drag}
            className='
                border
                border-gray-300
                w-24       /* 较小的固定宽度 */
                h-14       /* 较小的固定高度 */
                p-2        /* 适中的内边距 */
                m-1        /* 较小的外边距 */
                cursor-move
                inline-flex /* 使用 inline-flex 布局 */
                flex-col
                justify-center /* 垂直居中 */
                items-center   /* 水平居中 */
                bg-white
                rounded-md
                shadow-sm
                transition-transform
                transform-gpu
                hover:shadow-md
                hover:scale-105
                hover:bg-gray-100
                text-center    /* 文本居中 */
            '
        >
            <div className="text-xs font-medium text-gray-800">
                {name}
            </div>
            <div className="text-xxs text-gray-500 mt-1">
                {desc}
            </div>
        </div>
    );
}
