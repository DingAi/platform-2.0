// src/stores/userStore.js

import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import {getEquipmentData, postLogin} from '@/server/request-apis.js';
import {ref} from 'vue';
import Router from "@/router/index.js";
import {ElMessage} from "element-plus";

export const useAuthStore = defineStore('auth', () => {
    
    // 设置 Cookie 的超时时间
    const COOKIE_EXPIRES_DAYS = 7; // 7 天
    const COOKIE_EXPIRES_HOURS = 1 / 24; // 1 小时
    const COOKIE_EXPIRES_MINS = 1 / 144; // 10 分钟
    // 状态定义
    const token = ref(Cookies.get('token') || null);
    const user = ref(Cookies.get('user') || null);
    
    //登录后拿到的设备数据
    const SCGData = ref([]) // 单通道气体箱数据 Single Channel GasBox
    const MCGData = ref({}) // 多通道气体箱数据 Multi Channel GasBox
    
    // 登录方法
    const login = async (username, password) => {
        try {
            const response = await postLogin(username, password);
            if (response.status === 200) {
                token.value = response.data.token;
                user.value = response.data.user;
                SCGData.value = response.data.ed;
                console.log(SCGData)
                Cookies.set('token', token.value, {expires: COOKIE_EXPIRES_DAYS});
                Cookies.set('user', username, {expires: COOKIE_EXPIRES_DAYS}); // 存储 username 到 Cookie
                ElMessage({
                    showClose: true,
                    duration: 2000,
                    message: '登录成功！',
                    type: 'success'
                });
                Router.push({path: '/'})
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    
    // 登出方法
    const logout = () => {
        token.value = null;
        user.value = null;
        Cookies.remove('token');
        Cookies.remove('user');
        // 清除所有持久化的状态
        localStorage.clear();
        Router.push({path: '/login'})
        ElMessage({
            duration: 2000,
            message: '用户已登出！',
            type: 'info'
        })
    };
    
    //数据获取方法
    const getEquipments = async () => {
        try {
            const res = await getEquipmentData();
            // if(res.data.length === 0){
            //
            // }
            SCGData.value = res.data['ed'];
            return SCGData;
        } catch (error) {
            console.log(error)
        }
    }
    
    
    // 返回状态和方法
    return {
        token,
        SCGData,
        MCGData,
        login,
        logout,
        getEquipments
    };
},{
    persist: {
        storage: localStorage, // 使用 localStorage 或 sessionStorage
            paths: ['SCGData'], // 指定要持久化的状态属性
    },
});
