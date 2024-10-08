// src/stores/userStore.js

import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import {getEquipmentData, postLogin} from '@/server/request-apis.js';
import {ref} from 'vue';
import Router from "@/router/index.js";
import {ElMessage} from "element-plus";

export const useAuthStore = defineStore('auth', () => {
    
    // 设置项目前缀
    const PROJECT_NAME = 'platform';
    
    // 设置 Cookie 的超时时间
    const COOKIE_EXPIRES_DAYS = 7; // 7 天
    const COOKIE_EXPIRES_HOURS = 1 / 24; // 1 小时
    const COOKIE_EXPIRES_MINS = 1 / 144; // 10 分钟
    // 状态定义
    const token = ref(Cookies.get(`${PROJECT_NAME}_token`) || null);
    const user = ref(Cookies.get(`${PROJECT_NAME}_user`) || null);
    
    //登录后拿到的设备数据
    const SCGData = ref([]) // 单通道气体箱数据 Single Channel GasBox
    const MCGData = ref({}) // 多通道气体箱数据 Multi Channel GasBox
    
    //设备的传感器结构
    const sensorData = ref([])
    
    
    // 登录方法
    const login = async (username, password) => {
        try {
            const response = await postLogin(username, password);
            if (response.status === 200) {
                console.log(response)
                token.value = response.data.token;
                user.value = response.data.user;
                let expTime = response.data.time;
                SCGData.value = response.data.ed;
                sensorData.value = response.data.data_list;
                localStorage.setItem('sensorData', JSON.stringify(sensorData.value))
                localStorage.setItem('data_point', JSON.stringify(response.data.data_ser))
                console.log(SCGData)
                Cookies.set(`${PROJECT_NAME}_token`, token.value, {expires: expTime});
                Cookies.set(`${PROJECT_NAME}_user`, username, {expires: COOKIE_EXPIRES_DAYS}); // 存储 username 到 Cookie
                ElMessage({
                    showClose: true,
                    duration: 2000,
                    message: '登录成功！',
                    type: 'success'
                });
                await Router.push({path: '/'})
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
        Cookies.remove(`${PROJECT_NAME}_token`);
        Cookies.remove(`${PROJECT_NAME}_user`);
        // 清除所有持久化的状态
        localStorage.clear();
        Router.push({path: '/login'})
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
    
    //提供token数据
    const getToken = () => {
        return Cookies.get(`${PROJECT_NAME}_token`) || token.value;
    };
    
    // 返回状态和方法
    return {
        token,
        SCGData,
        MCGData,
        login,
        logout,
        getToken,
        getEquipments
    };
},{
    persist: {
        storage: localStorage, // 使用 localStorage 或 sessionStorage
        paths: ['SCGData'], // 指定要持久化的状态属性
    },
});
