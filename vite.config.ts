import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path'; // 导入 path 模块
export default defineConfig({
  plugins: [react()],
  base: '/ChangeLowcode/', // 确保 base 路径正确
  build: {
    outDir: 'dist', // 确保输出目录正确
    assetsDir: 'assets', // 确保资源目录正确
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('antd')) {
              return 'antd';
            }
            if (id.includes('lodash')) {
              return 'lodash';
            }
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 2000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 配置路径别名
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 目标服务器地址
        changeOrigin: true, // 改变请求源
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
      }
    }
  }
});