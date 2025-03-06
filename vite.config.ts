import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path'; // 导入 path 模块

export default defineConfig({
  plugins: [react()],
  base: '/ChangeLowcode/', // 确保 base 路径正确
  optimizeDeps: {
    exclude: ['fsevents'],
    esbuildOptions: {
      platform: 'browser',
      supported: {
        'dynamic-import': true
      },
    }
  },
  build: {
    outDir: 'dist', // 确保输出目录正确
    assetsDir: 'assets', // 确保资源目录正确
    rollupOptions: {
      external: ['fsevents'],
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
    target: 'esnext',
    chunkSizeWarningLimit: 2000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'fsevents': resolve(__dirname, 'src/utils/empty-module.ts')
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