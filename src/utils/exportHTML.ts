import { Component } from '../page/editor/stores/components';
import { ComponentConfig } from '../page/editor/stores/component-config';
import JSZip from 'jszip';

interface ExportConfig {
    components: Component[];
    componentConfig: Record<string, ComponentConfig>;
}

// 将Ant Design组件转换为HTML
function convertAntdToHTML(componentType: string, props: any): string {
    switch (componentType) {
        case 'Button':
            return `<button class="ant-btn ant-btn-${props.type || 'default'}" ${props.onClick ? 'onclick="handleClick(this)"' : ''}>
                ${props.children || props.text || ''}
            </button>`;
        
        case 'Input':
            return `<input class="ant-input" 
                type="text" 
                placeholder="${props.placeholder || ''}" 
                value="${props.value || ''}"
                style="${props.style ? Object.entries(props.style).map(([k, v]) => `${k}:${v}`).join(';') : ''}"
            />`;
        
        case 'Card':
            return `<div class="ant-card" style="${props.style ? Object.entries(props.style).map(([k, v]) => `${k}:${v}`).join(';') : ''}">
                ${props.title ? `<div class="ant-card-head">${props.title}</div>` : ''}
                <div class="ant-card-body">${props.children || ''}</div>
            </div>`;
        
        case 'Space':
            return `<div class="ant-space ant-space-${props.direction || 'horizontal'}" style="${props.style ? Object.entries(props.style).map(([k, v]) => `${k}:${v}`).join(';') : ''}">
                ${props.children || ''}
            </div>`;

        case 'Typography.Text':
        case 'Text':
            return `<span class="ant-typography" style="${props.style ? Object.entries(props.style).map(([k, v]) => `${k}:${v}`).join(';') : ''}">${props.children || props.text || ''}</span>`;

        case 'Typography.Title':
        case 'Title': {
            const level = props.level || 1;
            return `<h${level} class="ant-typography" style="${props.style ? Object.entries(props.style).map(([k, v]) => `${k}:${v}`).join(';') : ''}">${props.children || props.text || ''}</h${level}>`;
        }

        case 'Container':
            return `<div class="ant-container" style="${props.style ? Object.entries(props.style).map(([k, v]) => `${k}:${v}`).join(';') : ''}">${props.children || ''}</div>`;

        case 'Page':
            return `<div class="ant-page" style="min-height: 100vh; ${props.style ? Object.entries(props.style).map(([k, v]) => `${k}:${v}`).join(';') : ''}">${props.children || ''}</div>`;

        default:
            return `<div class="ant-component ant-${componentType.toLowerCase()}" style="${props.style ? Object.entries(props.style).map(([k, v]) => `${k}:${v}`).join(';') : ''}">${props.children || props.text || ''}</div>`;
    }
}

// 生成组件的HTML结构
function generateComponentsHTML(components: Component[], componentConfig: Record<string, ComponentConfig>): string {
    return components.map(component => {
        const config = componentConfig[component.name];
        if (!config) return '';

        const style = {
            position: 'absolute',
            left: `${component.x ?? 0}px`,
            top: `${component.y ?? 0}px`,
            ...component.styles,
        };

        const styleString = Object.entries(style)
            .map(([key, value]) => `${key}: ${value}`)
            .join(';');

        const props = { ...config.defaultProps, ...component.props };
        const html = convertAntdToHTML(component.name, props);
        
        return `<div id="${component.id}" style="${styleString}">${html}</div>`;
    }).join('\n');
}

// 生成事件处理函数
function generateEventHandlers(components: Component[]): string {
    let handlers = '';
    components.forEach(component => {
        if (component.props.onClick) {
            handlers += `
                if (element.id === '${component.id}') {
                    ${component.props.onClick}
                }
            `;
        }
    });
    return handlers;
}

// 生成自定义样式
function generateCustomStyles(components: Component[]): string {
    let styles = '';
    components.forEach(component => {
        if (component.styles) {
            styles += `
#${component.id} {
    ${Object.entries(component.styles)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n    ')}
}`;
        }
    });
    return styles;
}

// 处理事件对象，将其转换为可执行的函数代码
function processEventHandler(handler: any): string {
    if (typeof handler === 'string') {
        return handler;
    }
    if (typeof handler === 'function') {
        return handler.toString();
    }
    if (Array.isArray(handler)) {
        return handler.map(h => processEventHandler(h)).join(';');
    }
    if (typeof handler === 'object' && handler !== null) {
        if (handler.type === 'showMessage') {
            return `message.${handler.config.type}("${handler.config.text}")`;
        }
        if (handler.type === 'goToLink') {
            return `window.location.href = "${handler.url}"`;
        }
        if (handler.type === 'customJS') {
            return handler.code;
        }
        if (handler.actions && Array.isArray(handler.actions)) {
            return handler.actions.map((action: any) => {
                if (action.type === 'showMessage') {
                    return `message.${action.config.type}("${action.config.text}")`;
                }
                if (action.type === 'goToLink') {
                    return `window.location.href = "${action.url}"`;
                }
                if (action.type === 'customJS') {
                    return action.code;
                }
                if (action.type === 'componentMethod') {
                    return `document.querySelector('#${action.config.componentId}')?.${action.config.method}?.()`;
                }
                return '';
            }).filter(Boolean).join(';');
        }
    }
    return '';
}

// 生成组件的React代码
function generateReactComponent(component: Component, componentConfig: Record<string, ComponentConfig>): string {
    const config = componentConfig[component.name];
    if (!config) return '';

    const style = {
        position: 'absolute' as const,
        left: `${component.x ?? 0}px`,
        top: `${component.y ?? 0}px`,
        ...component.styles,
    };

    const props = { ...config.defaultProps, ...component.props };
    
    // 处理事件
    const events: Record<string, string> = {};
    if (props.onClick) {
        const processedHandler = processEventHandler(props.onClick);
        if (processedHandler) {
            events.onClick = `() => { ${processedHandler} }`;
        }
    }
    if (props.onChange) {
        const processedHandler = processEventHandler(props.onChange);
        if (processedHandler) {
            events.onChange = `(value) => { ${processedHandler} }`;
        }
    }
    
    // 生成props字符串
    const propsArray = Object.entries(props)
        .filter(([key]) => !['children', 'onClick', 'onChange'].includes(key))
        .map(([key, value]) => {
            if (typeof value === 'string') {
                return `${key}="${value}"`;
            } else if (typeof value === 'object' && value !== null) {
                return `${key}={${JSON.stringify(value)}}`;
            }
            return `${key}={${value}}`;
        });

    // 添加事件处理
    Object.entries(events).forEach(([event, handler]) => {
        propsArray.push(`${event}={${handler}}`);
    });

    // 添加样式
    propsArray.push(`style={${JSON.stringify(style)}}`);

    const propsString = propsArray.join(' ');

    // 处理子组件
    let childrenContent = '';
    if (component.children && component.children.length > 0) {
        childrenContent = component.children.map(child => 
            generateReactComponent(child, componentConfig)
        ).join('\n');
    } else if (props.children || props.text) {
        childrenContent = props.children || props.text;
    }

    return `<${component.name} ${propsString}>${childrenContent}</${component.name}>`;
}

// 生成组件树的React代码
function generateComponentsTree(components: Component[], componentConfig: Record<string, ComponentConfig>): string {
    return components.map(component => generateReactComponent(component, componentConfig)).join('\n');
}

// 生成完整的React应用代码
function generateReactApp(components: Component[], componentConfig: Record<string, ComponentConfig>): string {
    // 收集所有使用的组件名称（包括子组件）
    const imports = new Set<string>();
    function collectComponentNames(comps: Component[]) {
        comps.forEach(component => {
            imports.add(component.name);
            if (component.children) {
                collectComponentNames(component.children);
            }
        });
    }
    collectComponentNames(components);

    // 生成组件导入语句
    const importStatements = Array.from(imports)
        .map(name => `import ${name} from './materials/${name}/prod';`)
        .join('\n');

    const code = `import React from 'react';
${importStatements}
import 'antd/dist/reset.css';

export default function App() {
    return (
        <div className="preview-container" style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            overflow: 'hidden'
        }}>
            ${generateComponentsTree(components, componentConfig)}
        </div>
    );
}`;

    return code;
}

// 生成项目文件内容
function generateProjectFiles(components: Component[], componentConfig: Record<string, ComponentConfig>): Record<string, string> {
    const reactCode = generateReactApp(components, componentConfig);

    // 收集所有使用的组件
    const usedComponents = new Set<string>();
    function collectComponents(comps: Component[]) {
        comps.forEach(component => {
            usedComponents.add(component.name);
            if (component.children) {
                collectComponents(component.children);
            }
        });
    }
    collectComponents(components);

    // 创建文件映射
    const files: Record<string, string> = {
        'src/App.tsx': reactCode,
        'src/index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);`,
        'src/interface/index.ts': `import { CSSProperties } from 'react';

export interface CommonComponentProps {
    id?: string;
    text?: string;
    children?: React.ReactNode;
    styles?: CSSProperties;
    [key: string]: any;
}`,
        'package.json': JSON.stringify({
            name: 'exported-lowcode-project',
            version: '1.0.0',
            private: true,
            type: "module",
            dependencies: {
                'react': '^18.2.0',
                'react-dom': '^18.2.0',
                'antd': '^5.0.0',
                'prop-types': '^15.8.1'
            },
            devDependencies: {
                '@types/react': '^18.2.0',
                '@types/react-dom': '^18.2.0',
                '@types/prop-types': '^15.7.5',
                '@babel/core': '^7.22.0',
                '@babel/template': '^7.22.0',
                '@babel/traverse': '^7.22.0',
                '@babel/generator': '^7.22.0',
                '@types/babel__core': '^7.20.0',
                '@types/babel__template': '^7.4.1',
                '@types/babel__traverse': '^7.18.3',
                '@types/babel__generator': '^7.6.4',
                '@vitejs/plugin-react': '^4.0.0',
                'typescript': '^5.0.0',
                'vite': '^4.0.0'
            },
            scripts: {
                'dev': 'vite',
                'build': 'vite build',
                'preview': 'vite preview'
            }
        }, null, 2),
        'index.html': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>导出的低代码项目</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
</body>
</html>`,
        'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    },
    server: {
        port: 5173,
        open: true
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            }
        }
    }
});`,
        'tsconfig.json': JSON.stringify({
            compilerOptions: {
                target: "ESNext",
                useDefineForClassFields: true,
                lib: ["DOM", "DOM.Iterable", "ESNext"],
                allowJs: false,
                skipLibCheck: true,
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                strict: true,
                forceConsistentCasingInFileNames: true,
                module: "ESNext",
                moduleResolution: "bundler",
                resolveJsonModule: true,
                isolatedModules: true,
                noEmit: true,
                jsx: "react-jsx",
                baseUrl: ".",
                paths: {
                    "@/*": ["./src/*"]
                }
            },
            include: ["src"],
            references: [{ path: "./tsconfig.node.json" }]
        }, null, 2),
        'tsconfig.node.json': JSON.stringify({
            compilerOptions: {
                composite: true,
                module: "ESNext",
                moduleResolution: "bundler",
                allowSyntheticDefaultImports: true
            },
            include: ["vite.config.ts"]
        }, null, 2),
        'README.md': `# 导出的低代码项目

## 开发

\`\`\`bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
\`\`\`

## 构建

\`\`\`bash
npm run build
\`\`\`
`
    };

    // 为每个使用的组件创建目录和文件
    usedComponents.forEach(componentName => {
        files[`src/materials/${componentName}/prod.tsx`] = generateComponentCode(componentName);
    });

    return files;
}

// 生成组件代码
function generateComponentCode(componentName: string): string {
    switch (componentName) {
        case 'Button':
            return `import { Button as AntdButton } from 'antd';
import { CommonComponentProps } from '../../interface';

const Button = ({id, type, text, styles, ...props}: CommonComponentProps) => {
    return <AntdButton type={type} style={styles} {...props}>{text}</AntdButton>;
};

export default Button;`;

        case 'Container':
            return `import React from 'react';
import { CommonComponentProps } from '../../interface';

const Container = ({id, children, styles, ...props}: CommonComponentProps) => {
    return <div style={styles} {...props}>{children}</div>;
};

export default Container;`;

        case 'TableColumn':
            return `import { Table } from 'antd';
import { CommonComponentProps } from '../../interface';

const TableColumn = ({id, dataIndex, title, styles, ...props}: CommonComponentProps) => {
    return <Table.Column dataIndex={dataIndex} title={title} style={styles} {...props} />;
};

export default TableColumn;`;

        case 'Waterfall':
            return `import React, { useRef, useEffect } from 'react';
import { CommonComponentProps } from '../../interface';

interface WaterfallProps extends CommonComponentProps {
    waterfallType?: 'column';
    columnWidth?: number;
    gapSize?: number;
    maxColumns?: number;
}

const Waterfall = ({
    id,
    children,
    styles,
    waterfallType = 'column',
    columnWidth = 200,
    gapSize = 10,
    maxColumns = 5,
    ...props
}: WaterfallProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const containerWidth = container.offsetWidth;
        const numColumns = Math.min(Math.floor(containerWidth / (columnWidth + gapSize)), maxColumns);
        const columnHeights = Array(numColumns).fill(0);
        const items = Array.from(container.children);
        
        items.forEach((item: Element) => {
            const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
            if (item instanceof HTMLElement) {
                item.style.position = 'absolute';
                item.style.left = \`\${shortestColumn * (columnWidth + gapSize)}px\`;
                item.style.top = \`\${columnHeights[shortestColumn]}px\`;
                item.style.width = \`\${columnWidth}px\`;
                columnHeights[shortestColumn] += item.offsetHeight + gapSize;
            }
        });
    }, [children, columnWidth, gapSize, maxColumns]);

    return (
        <div ref={containerRef} style={{ position: 'relative', ...styles }} {...props}>
            {children}
        </div>
    );
};

export default Waterfall;`;

        case 'Page':
            return `import React from 'react';
import { CommonComponentProps } from '../../interface';

const Page = ({id, children, styles, ...props}: CommonComponentProps) => {
    return (
        <div style={{ minHeight: '100vh', ...styles }} {...props}>
            {children}
        </div>
    );
};

export default Page;`;

        default:
            return `import { ${componentName} as Antd${componentName} } from 'antd';
import { CommonComponentProps } from '../../interface';

const ${componentName} = ({id, text, styles, ...props}: CommonComponentProps) => {
    return <Antd${componentName} style={styles} {...props}>{text}</Antd${componentName}>;
};

export default ${componentName};`;
    }
}

export async function exportHTML(config: ExportConfig): Promise<void> {
    const { components, componentConfig } = config;

    // 生成项目文件
    const files = generateProjectFiles(components, componentConfig);

    // 创建ZIP文件
    const zip = new JSZip();
    Object.entries(files).forEach(([path, content]) => {
        zip.file(path, content);
    });

    // 下载ZIP文件
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported-project.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
} 