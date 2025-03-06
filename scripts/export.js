import { rollup } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import virtual from '@rollup/plugin-virtual';
import fs from 'fs';
import path from 'path';

async function build(config) {
    const bundle = await rollup({
        input: 'virtual-entry',
        plugins: [
            virtual({
                'virtual-entry': `
                    import './styles.css';
                    import { createApp } from './runtime';
                    const app = createApp(${JSON.stringify(config)});
                    app.mount('#root');
                `
            }),
            typescript({
                tsconfig: false,
                module: 'esnext',
            }),
            resolve(),
            commonjs(),
            postcss({
                extract: true,
                minimize: true,
            }),
            terser()
        ]
    });

    const { output } = await bundle.generate({
        dir: 'dist',
        format: 'iife',
        name: 'app',
        sourcemap: true
    });

    await bundle.close();

    return {
        js: output[0].code,
        css: output[1] && output[1].source || ''
    };
}

// 读取配置文件
const config = JSON.parse(fs.readFileSync('export-config.json', 'utf-8'));

// 构建
build(config).then(({ js, css }) => {
    // 生成HTML
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>导出页面</title>
    <style>${css}</style>
</head>
<body>
    <div id="root"></div>
    <script>${js}</script>
</body>
</html>`;

    // 写入文件
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }
    fs.writeFileSync('dist/index.html', html);
    console.log('Export completed: dist/index.html');
});