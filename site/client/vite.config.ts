import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/client/',
  plugins: [react()],
  server: {
    port: 4001,
    // proxy: {
    //   '/file': 'http://localhost:14003',
    //   '/task': 'http://localhost:14003',
    //   '/load': 'http://localhost:14003',
    //   '/webdav': 'http://localhost:14003',
    //   '/message/connect/':{
    //     target:'http://localhost:14003',
    //     ws:true
    //   }
    // }
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
})
