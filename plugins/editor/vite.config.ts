import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/plugin/static/text-editor/',
  plugins: [react()],
  server: {
    port: 4001,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './web/') }
  }
})
