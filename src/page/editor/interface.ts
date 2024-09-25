import { CSSProperties, PropsWithChildren } from "react";
export type SizeType = 'small' | 'middle' | 'large' | undefined;
export interface CommonComponentProps extends PropsWithChildren{
    id: number;
    name: string;
    styles?: CSSProperties
    [key: string]: any
    size?: SizeType
    color?:string
}