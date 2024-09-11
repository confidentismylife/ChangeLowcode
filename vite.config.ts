import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // 确保 base 路径正确
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
  }
});