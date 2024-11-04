import {defineStore} from 'pinia';
import {getEquipmentData, postFilesList} from '@/server/request-apis.js';
import {ref} from 'vue';

export const useEquipmentStore = defineStore('equipment', () => {
    //登录后拿到的设备数据
    const SCGData = ref([])  // 单通道气体箱数据 Single Channel GasBox
    const MCGData = ref({})  // 多通道气体箱数据 Multi Channel GasBox
    const folders = ref([])  // 备份数据的文件夹名字
    const files = ref([])  // 备份数据的文件夹中的文件
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
    
    //获取备份文件列表
    const getFiles = async () => {
        try {
            const res = await postFilesList();
            folders.value = res.data.folders;
            files.value = res.data.files;
        } catch (error) {
            console.log(error)
        }
    }
    
    // 返回状态和方法
    return {
        SCGData,
        MCGData,
        folders,
        files,
        getEquipments,
        getFiles
    };
}, {
    persist: {
        storage: localStorage, // 使用 localStorage 或 sessionStorage
        paths: ['SCGData'], // 指定要持久化的状态属性
    },
});
