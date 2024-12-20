import axios from "axios";
import Router from "@/router/index.js";
import {useAuthStore} from "@/stores/userStore.js";
import {showMessage} from "@/utils/tools-functions.js";
import {server, xuServer,} from "@/server/request-apis.js";


// 创建axios实例
const apiClient = axios.create({
    timeout: 60000, // 请求超时时间
    headers: {
        "Content-Type": "application/json",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    },
});

// 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.getToken(); // 调用 store 中的方法获取 token
        
        // 登录、注册、修改密码、手机验证码接口不需要 token
        const noAuthRequests = [
            `${server}login`,
            `${server}register`,
            `${server}register_captcha`,
            `${server}modify_password_captcha`,
            `${server}modify_password`,
            `${server}verify_sn`
        ];

        // 检查是否为不需要 token 的请求
        const isAuthRequest = noAuthRequests.includes(config.url);

        // const isAuthRequest = config.url === `${server}login` || config.url === `${server}register`
        //     || config.url === `${server}register_captcha` || config.url === `${server}modify_password_captcha` || config.url === `${server}modify_password`
        //     || config.url === `${server}verify_sn`;

        if (!isAuthRequest) {
            if (!token) {
                return Promise.reject(new Error("No token available"));
            }
            config.headers.Authorization = token;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.data) {
            const errorData = error.response.data;
            
            // 检查是否存在具体的错误信息（如字段验证错误）
            if (errorData.errors) {
                errorData.errors.forEach((err) => {
                    showMessage(err.message); // 显示每个具体的错误信息
                });
            } else if (errorData.message) {
                showMessage(errorData.message); // 显示通用的错误信息
            }
        } else {
            showMessage("请求失败，请检查网络连接"); // 网络连接错误或其他未知错误
        }
        
        if (error.response) {
            const status = error.response.status;
            const authStore = useAuthStore();
            
            switch (status) {
                case 401:
                    showMessage("登录过期，请重新登录");
                    authStore.logout();
                    
                    // 登录过期，跳转到登录界面
                    Router.push({path: "/login"});
                    break;
                case 403:
                    showMessage("无访问权限");
                    break;
                case 404:
                    showMessage("未找到请求资源");
                    break;
                case 500:
                    // showMessage("服务器错误，请求失败");
                    break;
                default:
                    showMessage(error.response.data || "An unknown error occurred.");
            }
        }
        
        return Promise.reject(error); // 将错误继续传递给调用者
    },
);

export default apiClient;
