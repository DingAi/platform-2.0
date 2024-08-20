import axios from 'axios';
import {ElMessage, ElNotification} from "element-plus";
import Router from "@/router/index.js";
import {useAuthStore} from "@/stores/userStore.js";

// 创建axios实例
const apiClient = axios.create({
    // baseURL: '/django',
    baseURL: 'xu',
    timeout: 60000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json',
    },
});



// 请求拦截器
apiClient.interceptors.request.use(
    config => {
        //添加统一的token
        const authStore = useAuthStore(); // 重新获取最新的 store 状态
        if (authStore.token) {
            config.headers.Authorization = `${authStore.token}`;
        } else {
            console.warn('Token is missing');
        }
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
apiClient.interceptors.response.use(
    response => {
        // 对响应数据处理
        // ElMessage({
        //     duration: 2000,
        //     message: '访问服务器失败',
        //     type: 'warning'
        // })
        return response;
    },
    error => {
        // 对响应错误处理
        
        if (error.response) {
            if (error.response.status >= 500 && error.response.status < 600) {
                ElMessage({
                    duration: 2000,
                    message: '服务器错误，请求失败',
                    type: 'error'
                })
            } else if (error.response.status === 404) {
                ElMessage({
                    duration: 2000,
                    message: '未找到请求资源',
                    type: 'error'
                })
            } else if (error.response.status === 403) {
                // const authStore = useAuthStore();
                // authStore.logout();
                ElMessage({
                    duration: 2000,
                    message: '无访问权限',
                    type: 'error'
                })
            } else if (error.response.status === 401) {
                ElMessage({
                    duration: 2000,
                    message: 'Token expired or invalid. Please log in again.',
                    type: 'error'
                });
                const authStore = useAuthStore();
                authStore.logout();
                Router.push({path: '/login'})
            } else {
                ElMessage({
                    duration: 2000,
                    message: error.response.data,
                    type: 'error'
                })
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
