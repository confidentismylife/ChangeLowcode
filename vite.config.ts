import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
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
})
