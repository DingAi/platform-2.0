// src/stores/userStore.js

import {defineStore} from 'pinia';
import Cookies from 'js-cookie';
import {getEquipmentData, postAlarmLog, postLogin} from '@/server/request-apis.js';
import {ref} from 'vue';
import Router from "@/router/index.js";
import {showMessage, transposeMatrix} from "@/utils/tools-functions.js";
import {ElNotification} from "element-plus";

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
                token.value = response.data.token;
                user.value = response.data.user;
                let expTime = response.data.time; // token超时时间
                SCGData.value = response.data.ed; // 用户已经拥有的设备信息
                
                //将传感器的详细数据放到本地
                sensorData.value = response.data.data_list;
                localStorage.setItem('sensorData', JSON.stringify(sensorData.value))
                localStorage.setItem('data_point', JSON.stringify(response.data.data_ser))
                
                // 存储 username和token 到 Cookie
                Cookies.set(`${PROJECT_NAME}_token`, token.value, {expires: expTime});
                Cookies.set(`${PROJECT_NAME}_user`, username, {expires: COOKIE_EXPIRES_DAYS});
                
                // 检测是否有报警
                await isExistenceAlarm(SCGData.value);
                
                showMessage('登录成功', 'success')
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
            SCGData.value = res.data['ed'];
            return SCGData;
        } catch (error) {
            console.log(error)
        }
    }
    
    async function isExistenceAlarm(SCGData) {
        for (let i = 0; i < SCGData[0].length; i++) {
            const item = SCGData[0][i];
            try {
                const res = await postAlarmLog(item); // 使用 await
                let alarmList = transposeMatrix(res.data['value']);

                // 检查 alarmList 中是否包含 0
                if (alarmList[3].includes(0)) {
                    ElNotification({
                        title: '报警统治',
                        message: '设备 【' + SCGData[1][i] + '】' + ' 有报警！',
                        type: 'warning',
                        offset: 100
                    })
                    // showMessage('设备 【' + SCGData[1][i] + '】' + ' 有报警！', 'error', 4000);
                }
            } catch (error) {
                console.error(`设备 【${SCGData[1][i]}】 报警请求失败:`, error);
            }
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
}, {
    persist: {
        storage: localStorage, // 使用 localStorage 或 sessionStorage
        paths: ['SCGData'], // 指定要持久化的状态属性
    },
});
