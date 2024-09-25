import { create } from 'zustand';
import ContainerDev from '../materials/Container/dev';
import ContainerProd from '../materials/Container/prod';
import ButtonDev from '../materials/Button/dev';
import ButtonProd from '../materials/Button/prod';
import PageDev from '../materials/Page/dev';
import PageProd from '../materials/Page/prod';
import ModalProd from '../materials/Modal/prod';
import ModalDev from '../materials/Modal/dev';
import TableDev from '../materials/Table/dev';
import TableProd from '../materials/Table/prod';
import TableColumnDev from '../materials/TableColumn/dev';
import TableColumnProd from '../materials/TableColumn/prod';
import FormDev from '../materials/Form/dev';
import FormProd from '../materials/Form/prod';
import FormItemDev from '../materials/FormItem/dev';
import FormItemProd from '../materials/FormItem/prod';
import SpaceDev from '../materials/Space/dev';
import SpaceProd from '../materials/Space/prod';
import CardDev from '../materials/Card/dev';
import CardProd from '../materials/Card/prod';
export interface ComponentSetter {
    name: string;
    label: string;
    type: string;
    [key: string]: any;
}

export interface ComponentEvent {
    name: string
    label: string
}

export interface ComponentMethod {
    name: string
    label: string
}

export interface ComponentConfig {
    name: string;
    defaultProps: Record<string, any>,
    desc: string;
    setter?: ComponentSetter[];
    stylesSetter?: ComponentSetter[];
    events?: ComponentEvent[];
    methods?: ComponentMethod[]
    dev: any;
    prod: any;
}

interface State {
    componentConfig: { [key: string]: ComponentConfig };
}

interface Action {
    registerComponent: (name: string, componentConfig: ComponentConfig) => void
}

export const useComponentConfigStore = create<State & Action>((set) => ({
    componentConfig: {
        Container: {
            name: 'Container',
            defaultProps: {},
            desc: '容器',
            dev: ContainerDev,
            prod: ContainerProd
        },
        Button: {
            name: 'Button',
            defaultProps: {
                type: 'primary',
                text: '按钮'
            },
            setter: [
                {
                    name: 'type',
                    label: '按钮类型',
                    type: 'select',
                    options: [
                        { label: '主按钮', value: 'primary' },
                        { label: '次按钮', value: 'default' },
                        { label: 'dashed', value: 'dashed' },
                        { label: 'link', value: 'link' },
                        { label: 'text', value: 'text' },
                    ],
                },
                {
                    name: 'text',
                    label: '文本',
                    type: 'input',
                },
                {
                    name: 'icon',
                    label: '图标',
                    type: 'input',
                },
                {
                    name: 'size',
                    label: '大小',
                    type: 'select',
                    options: [
                        { label: '大', value: 'large' },
                        { label: '中', value: 'middle' },
                        { label: '小', value: 'small' },
                    ],
                },
                {
                    name:"link",
                   label:"Icon链接",
                   type:'show' 
                }
                // {
                //     name: 'color',
                //     label: '颜色',
                //     type: 'select',
                //     options: [
                //         { label: 'default', value: 'default' },
                //         { label: 'primary', value: 'primary' },
                //         { label: 'danger', value: 'danger' },
                //     ],
                // },
            ],
            stylesSetter: [
                {
                    name: 'width',
                    label: '宽度',
                    type: 'inputNumber',
                },
                {
                    name: 'height',
                    label: '高度',
                    type: 'inputNumber',
                }
            ],
            events: [
                {
                    name: 'onClick',
                    label: '点击事件',
                },
                {
                    name: 'onDoubleClick',
                    label: '双击事件'
                },
            ],
            desc: '按钮',
            dev: ButtonDev,
            prod: ButtonProd
        },
        Modal: {
            name: 'Modal',
            defaultProps: {
                title: '弹窗'
            },
            setter: [
                {
                    name: 'title',
                    label: '标题',
                    type: 'input'
                }
            ],
            stylesSetter: [],
            events: [
                {
                    name: 'onOk',
                    label: '确认事件',
                },
                {
                    name: 'onCancel',
                    label: '取消事件'
                },
            ],
            methods: [
                {
                    name: 'open',
                    label: '打开弹窗',
                },
                {
                    name: 'close',
                    label: '关闭弹窗'
                }
            ],
            desc: '弹窗',
            dev: ModalDev,
            prod: ModalProd
        },
        Page: {
            name: 'Page',
            defaultProps: {},
            desc: '页面',
            dev: PageDev,
            prod: PageProd
        },
        Table: {
            name: 'Table',
            defaultProps: {},
            desc: '表格',
            setter: [
                {
                    name: 'url',
                    label: 'url',
                    type: 'input',
                },
            ],
            dev: TableDev,
            prod: TableProd
        },
        TableColumn: {
            name: 'TableColumn',
            desc: '表格列',
            defaultProps: {
                dataIndex: `col_${new Date().getTime()}`,
                title: '列名'
            },
            setter: [
                {
                    name: 'type',
                    label: '类型',
                    type: 'select',
                    options: [
                        {
                            label: '文本',
                            value: 'text',
                        },
                        {
                            label: '日期',
                            value: 'date',
                        },
                    ],
                },
                {
                    name: 'title',
                    label: '标题',
                    type: 'input',
                },
                {
                    name: 'dataIndex',
                    label: '字段',
                    type: 'input',
                },
            ],
            dev: TableColumnDev,
            prod: TableColumnProd,
        },
        Form: {
            name: 'Form',
            defaultProps: {},
            desc: '表单',
            setter: [
                {
                    name: 'title',
                    label: '标题',
                    type: 'input',
                },
            ],
            events: [
                {
                    name: 'onFinish',
                    label: '提交事件',
                }
            ],
            methods: [
                {
                    name: 'submit',
                    label: '提交',
                }
            ],
            dev: FormDev,
            prod: FormProd
        },
        FormItem: {
            name: 'FormItem',
            desc: '表单项',
            defaultProps: {
                name: new Date().getTime(),
                label: '姓名'
            },
            dev: FormItemDev,
            prod: FormItemProd,
            setter: [
                {
                    name: 'type',
                    label: '类型',
                    type: 'select',
                    options: [
                        {
                            label: '文本',
                            value: 'input',
                        },
                        {
                            label: '日期',
                            value: 'date',
                        },
                    ],
                },
                {
                    name: 'label',
                    label: '标题',
                    type: 'input',
                },
                {
                    name: 'name',
                    label: '字段',
                    type: 'input',
                },
                {
                    name: 'rules',
                    label: '校验',
                    type: 'select',
                    options: [
                        {
                            label: '必填',
                            value: 'required',
                        },
                    ],
                }
            ]
        },
        Space: {
            name: 'Space',
            defaultProps: {},
            desc: 'Space',
            dev: SpaceDev,
            prod: SpaceProd,
            setter: [
                {
                    name: 'align',
                    label: '排列',
                    type: 'select',
                    options: [
                        {
                            label: 'start',
                            value: 'start',
                        },
                        {
                            label: 'end',
                            value: 'end',
                        },
                        {
                            label: 'center',
                            value: 'center',
                        },
                        {
                            label: 'baseline',
                            value: 'baseline',
                        },
                    ],
                    
                },
                {
                    name: 'direction',
                    label: '方向',
                    type: 'select',
                    options: [
                        {
                            label: 'verticalt',
                            value: 'verticalt',
                        },
                        {
                            label: 'horizontal',
                            value: 'horizontal',
                        },
                    ],
                },
                {
                    name: 'size',
                    label: '大小',
                    type: 'select',
                    options: [
                        {
                            label: 'large',
                            value: 'large',
                        },
                        {
                            label: 'middle',
                            value: 'middle',
                        },
                        {
                            label: 'small',
                            value: 'small',
                        },
                    ],
                },
                {
                    name: 'wrap',
                    label: '换行',
                    type: 'select',
                    options: [
                        {
                            label: 'true',
                            value: 'true',
                        },
                        {
                            label: 'false',
                            value: 'false',
                        },
                    ],
                }
            ],
        },
        Card: {
            name: 'Card',
            defaultProps: {
                with:'300px'
            },
            desc: "Card",
            dev: CardDev,
            prod: CardProd,
            setter: [
                {
                    name: 'title',
                    label: '标题',
                    type: 'input',
                },
                {
                    name: 'extra',
                    label: 'extra',
                    type: 'input', // 输入格式为 "url:value"
                },
                // {
                //     name: 'style',
                //     label: '样式',
                //     type: 'input', // 可以传入 CSS 样式
                // },
                {
                    name: 'bordered',
                    label: '边框',
                    type: 'select',
                    options: [
                        { label: 'true', value: true }, // 修正为布尔值
                        { label: 'false', value: false }
                    ]
                },
                {
                    name: 'cover',
                    label: '封面图片',
                    type: 'input', // 输入封面图片的 URL
                },
                {
                    name: 'actions',
                    label: '操作按钮',
                    type: 'input', // 输入格式为 JSON 字符串，例如: '[{"label":"编辑","icon":"edit"}]'
                },
                {
                    name: 'avatar',
                    label: '头像',
                    type: 'input', // 输入头像图片的 URL
                },
                {
                    name: 'description',
                    label: '描述',
                    type: 'input', // 输入描述文本
                },
            ],
            stylesSetter: [
                {
                    name: 'width',
                    label: '宽度',
                    type: 'inputNumber',
                },
                {
                    name: 'height',
                    label: '高度',
                    type: 'inputNumber',
                }
            ],
        }
        
    },
    registerComponent: (name, componentConfig) => set((state) => {
        return {
            ...state,
            componentConfig: {
                ...state.componentConfig,
                [name]: componentConfig
            }
        }
    })
}));

// 动态添加远程组件配置
