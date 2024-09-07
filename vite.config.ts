import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('antd')) {
              // 将 Ant Design 和它的依赖库分到一个独立的 chunk 中
              return 'antd';
            }
            if (id.includes('lodash')) {
              return 'lodash';
            }
            // 将所有其他来自 node_modules 的模块分到一个单独的 chunk 中
            return 'vendor';
          }
        }
      }
    },

    chunkSizeWarningLimit: 2000 // 设置为 2000KB 或其他合适的值
  },

})
