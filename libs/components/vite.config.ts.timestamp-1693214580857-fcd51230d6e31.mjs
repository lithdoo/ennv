// vite.config.ts
import { defineConfig } from "file:///C:/Users/lithd/Desktop/ennv/node_modules/.pnpm/vite@4.3.2_sass@1.62.1/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/lithd/Desktop/ennv/node_modules/.pnpm/@vitejs+plugin-react@4.0.0_vite@4.3.2/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///C:/Users/lithd/Desktop/ennv/node_modules/.pnpm/vite-plugin-dts@2.3.0_vite@4.3.2/node_modules/vite-plugin-dts/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\lithd\\Desktop\\ennv\\libs\\components";
var vite_config_default = defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "packages/index.ts"),
      name: "EnnvComponents",
      formats: ["es", "umd"],
      fileName: (format) => `ennv-components.${format}.js`
    },
    rollupOptions: {
      external: ["react", "react-dom", "styled-components"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "styled-components": "styled"
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxsaXRoZFxcXFxEZXNrdG9wXFxcXGVubnZcXFxcbGlic1xcXFxjb21wb25lbnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxsaXRoZFxcXFxEZXNrdG9wXFxcXGVubnZcXFxcbGlic1xcXFxjb21wb25lbnRzXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9saXRoZC9EZXNrdG9wL2VubnYvbGlicy9jb21wb25lbnRzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKSwgZHRzKHsgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSB9KV0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIGxpYjoge1xyXG4gICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3BhY2thZ2VzL2luZGV4LnRzJyksXHJcbiAgICAgIG5hbWU6ICdFbm52Q29tcG9uZW50cycsXHJcbiAgICAgIGZvcm1hdHM6IFsnZXMnLCAndW1kJ10sXHJcbiAgICAgIGZpbGVOYW1lOiAoZm9ybWF0KSA9PiBgZW5udi1jb21wb25lbnRzLiR7Zm9ybWF0fS5qc2AsXHJcbiAgICB9LFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogWydyZWFjdCcsICdyZWFjdC1kb20nLCAnc3R5bGVkLWNvbXBvbmVudHMnXSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgZ2xvYmFsczoge1xyXG4gICAgICAgICAgcmVhY3Q6ICdSZWFjdCcsXHJcbiAgICAgICAgICAncmVhY3QtZG9tJzogJ1JlYWN0RE9NJyxcclxuICAgICAgICAgICdzdHlsZWQtY29tcG9uZW50cyc6ICdzdHlsZWQnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVUsU0FBUyxvQkFBb0I7QUFDOVYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsa0JBQWtCLEtBQUssQ0FBQyxDQUFDO0FBQUEsRUFDbEQsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTyxLQUFLLFFBQVEsa0NBQVcsbUJBQW1CO0FBQUEsTUFDbEQsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBLE1BQ3JCLFVBQVUsQ0FBQyxXQUFXLG1CQUFtQjtBQUFBLElBQzNDO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsU0FBUyxhQUFhLG1CQUFtQjtBQUFBLE1BQ3BELFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxVQUNQLGFBQWE7QUFBQSxVQUNiLHFCQUFxQjtBQUFBLFFBQ3ZCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
