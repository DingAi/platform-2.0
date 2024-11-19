import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  server: {
    host: "0.0.0.0", //自定义主机名
    port: 5173, //自定义端口
    proxy: {
      "/xu": {
        target: "http://192.168.28.228:8000",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/xu/, ""),
      },
      "/local": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/local/, ""),
      },
      "/django": {
        target: "http://47.108.231.242:9002",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/django/, ""),
      },
      "/fastapi": {
        target: "http://47.108.231.242:7005",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/fastapi/, ""),
      },
      "/ylzs": {
        target: "http://47.108.231.242:9011",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/ylzs/, ""),
      },
      "/fws": {
        target: "ws://127.0.0.1:8000",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/fws/, ""),
      },
    },
  },
  resolve: {
    // 配置路径别名
    alias: [
      // @代替src
      {
        find: "@",
        replacement: path.resolve("./src"),
      },
    ],
  },
});
