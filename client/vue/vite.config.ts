import vue from "@vitejs/plugin-vue";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [
    vue(),
    viteTsConfigPaths({
      loose: true,
      root: "../../",
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5174,
  },
});
