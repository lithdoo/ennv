import { defineConfig } from 'vite'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir:false,
    lib: {
      entry: path.resolve(__dirname, 'web/entry.ts'),
      name: 'EnnvPluginGBAEmulator',
      formats: ['umd'],
      fileName: (format) => `ennv-plugin-json-editor.${format}.js`,
    },
  },
})
