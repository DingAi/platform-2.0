import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],

    server: {
        host: "0.0.0.0", //自定义主机名
        port: 5173, //自定义端口
        proxy: {
            "/local": {
                target: "http://192.168.28.33:8000",
                changeOrigin: true,
                ws: true,
                rewrite: (path) => path.replace(/^\/local/, ""),
            },
            "/django": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
                ws: true,
                rewrite: (path) => path.replace(/^\/django/, ""),
            },
            "/DjangoServer": {
                target: "http://192.168.30.119:7004",
                changeOrigin: true,
                ws: true,
                rewrite: (path) => path.replace(/^\/DjangoServer/, ""),
            },
            "/ServerTest": {
                target: "http://47.121.29.85:7004",
                changeOrigin: true,
                ws: true,
                rewrite: (path) => path.replace(/^\/ServerTest/, ""),
            },
            "/mqtt": {
                target: "http://192.168.30.119:6001",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/mqtt/, ""),
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
})