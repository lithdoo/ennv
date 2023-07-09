import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/client/',
  plugins: [react()],
  server: {
    port: 4001,
    proxy: {
      '/file': 'http://localhost:4002',
      '/message/connect/':{
        target:'http://localhost:4002',
        ws:true
      }
    }
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
})
