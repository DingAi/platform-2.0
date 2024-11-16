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
    
    // 状态定义，使用Cookie的值，Cookie没有值就使用null
    const token = ref(Cookies.get(`${PROJECT_NAME}_token`) || null);
    const user = ref(Cookies.get(`${PROJECT_NAME}_user`) || null);
    
    //登录后拿到的设备数据
    const SCGData = ref([]) // 单通道气体箱数据 Single Channel GasBox
    
    // 登录方法
    /**
     * 更新页内导航选中的索引
     * @param {string} username ： 登录用户名
     * @param {string} password ： 登录密码
     */
    const login = async (username, password) => {
        try {
            const response = await postLogin(username, password);
            if (response.status === 200) {
                token.value = response.data.token;
                user.value = response.data.user;
                let expTime = response.data.time; // token超时时间
                SCGData.value = response.data.ed; // 用户已经拥有的设备信息
                
                //将传感器的详细数据放到本地
                localStorage.setItem('single_history_option', JSON.stringify(response.data.data_list))
                localStorage.setItem('single_data_point', JSON.stringify(response.data.data_ser))
                localStorage.setItem('single_data_unit', JSON.stringify(response.data.dan_unit))
                localStorage.setItem('multi_data_unit', JSON.stringify(response.data.duo_unit))
                localStorage.setItem('phone', JSON.stringify(response.data.phone))
                
                // 这部分是为了方式在登录的时候多通道数据结构传输的数据过大，将从站的数据在这里生成
                // 主站数据
                let masterStationData = response.data.data_duo.slice(0, 68);
                // 一份从站数据
                let subStationData = response.data.data_duo.slice(68, 90);
                // 主站历史数据结构
                let masterHistoryOption = [response.data.duo_table[0]];
                // 一份从站历史数据结构
                let subHistoryOption = response.data.duo_table[1];
                
                let subStationKeys = [
                    "slave_one",
                    "slave_two",
                    "slave_three",
                    "slave_four",
                    "slave_five",
                    "slave_six",
                    "slave_seven",
                    "slave_eight",
                    "slave_nine",
                    "slave_ten"
                ];
                
                // 循环生成1到10号站的数据
                for (let i = 1; i <= 10; i++) {
                    // 修改主站数据
                    subStationData.forEach(station => {
                        const modifiedStation = station.replace(/^一/, i.toString());
                        masterStationData.push(modifiedStation);
                    });
                    // 生成每个子站的数据并存储到 masterHistoryOption
                    if (i <= subStationKeys.length) { // 确保索引不超过子站数量
                        // 创建 originalData 的副本
                        const data = JSON.parse(JSON.stringify(subHistoryOption));
                        // 更新 value
                        data.value = subStationKeys[i - 1]; // 使用 i - 1 获取正确的 key
                        // 修改 label 的第一个字符
                        data.label = data.label.replace(/^1/, i.toString());
                        // 修改 children 的 label
                        data.children.forEach(child => {
                            child.label = child.label.replace(/^1/, i.toString());
                            child.value = child.value.replace(/1/g, i.toString());
                        });
                        // 将修改后的结果添加到 masterHistoryOption
                        masterHistoryOption.push(data);
                    }
                }
                
                localStorage.setItem('multi_data_point', JSON.stringify(masterStationData));
                localStorage.setItem('multi_history_option', JSON.stringify(masterHistoryOption))
                
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
    
    /**
     * 登出函数
     */
    const logout = () => {
        // 清除Cookie Token和本地数据
        token.value = null;
        user.value = null;
        Cookies.remove(`${PROJECT_NAME}_token`);
        Cookies.remove(`${PROJECT_NAME}_user`);
        // 清除所有持久化的状态
        localStorage.clear();
        Router.push({path: '/login'})
    };
    
    /**
     * 判断是否有设备报警
     * @param {json} SCGData ： 本地的用户设备数据
     */
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
                }
            } catch (error) {
                console.error(`设备 【${SCGData[1][i]}】 报警请求失败:`, error);
            }
        }
    }
    
    const getToken = () => {
        return token.value;
    };

    
    // 返回状态和方法
    return {
        token,
        SCGData,
        login,
        logout,
        getToken
    };
}, {
    persist: {
        storage: localStorage, // 使用 localStorage 或 sessionStorage
        paths: ['SCGData'], // 指定要持久化的状态属性
    },
});
