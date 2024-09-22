import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // 或者 '0.0.0.0'，监听所有地址
    port: 5173, // 可选：自定义端口
  },
})
