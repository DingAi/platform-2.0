import apiClient from "./axiosConfig";

const server = '/xu/'

const apiEndpoints = {
    initRoll: server + "mysql_dan",
    login: server + "generate_token",
    addSN: server + "interior_sn",
    emailCaptcha: server + "you_x",
    tokenTest: server + "analysis_token",
    linkTest: server + "ceshi",
    equipmentAdd: server + "add_equipments",
    equipmentData: server + "register_data",
    filesList: server + "files_list",
    filesDownload: server + "files_download",
    downloadComplete: server + "delete_zip_file",
    logData: server + "log",
    deleteEquipment: server + "equipment_delete",
    userList: server + "user_profile",
    snList: server + "background_sn",
    userSN: server + "user_associated_device",
    fileUpload: server + "remote_upgrade",
    SSE: server + 'sse',
    RealData: server + "real_time_data",
    ASwitch: server + "control_switch",
    History: server + "past_records",
    EquipmentVar: server + "history_table",
};

// 定义API请求函数
const postInitRoll = (us, pwd, em, cap, sn, en) =>
    apiClient.post(apiEndpoints.initRoll, {
        us,
        pwd,
        em,
        cap,
        sn,
        en,
    });

const postLogin = (username, password) =>
    apiClient.post(apiEndpoints.login, {username, password,});

const postAddSN = (sn) => apiClient.post(apiEndpoints.addSN, {sn});

const getEmailCaptcha = (email) =>
    apiClient.post(apiEndpoints.emailCaptcha, {email});

const getTokenTest = () => apiClient.get(apiEndpoints.tokenTest);

const linkTest = () => apiClient.get(apiEndpoints.linkTest);

const postEquipmentAdd = (sn, en) =>
    apiClient.post(apiEndpoints.equipmentAdd, {sn, en});

const getEquipmentData = () => apiClient.get(apiEndpoints.equipmentData);

const getFilesList = () => apiClient.get(apiEndpoints.filesList);

const postFilesDownload = (folderName, filesList) =>
    apiClient.post(
        apiEndpoints.filesDownload,
        {
            folderName,
            filesList,
        },
        {
            responseType: "blob",
        },
    );

const postDownloadIsComplete = (sn) =>
    apiClient.post(apiEndpoints.downloadComplete, {sn});

const getLogData = () => apiClient.get(apiEndpoints.logData);

const postDeleteEquipment = (sn) =>
    apiClient.post(apiEndpoints.deleteEquipment, {sn});

const getUserList = () => apiClient.get(apiEndpoints.userList);

const getSNList = () => apiClient.get(apiEndpoints.snList);

const postUserSN = (username) =>
    apiClient.post(apiEndpoints.userSN, {username});

const postFileUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    return apiClient.post(apiEndpoints.fileUpload, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const postSSE = (sn) =>
    apiClient.post(apiEndpoints.SSE, {sn});

//单通道设备实时数据表
const postRealData = (sn) =>
    apiClient.post(apiEndpoints.RealData, {sn});

//单通道设备控制开关
const postASwitch = (id, value) =>
    apiClient.post(apiEndpoints.ASwitch, {id, value});

//获取历史数据
const postHistory = (sn, type, vars, time_frame) =>
    apiClient.post(apiEndpoints.History, {sn, type, vars, time_frame});

//获取设备传感器数据点
const getEquipmentVarArray = () =>
    apiClient.get(apiEndpoints.EquipmentVar);

// 导出所有的API函数
export {
    server,
    postInitRoll,
    postLogin,
    postAddSN,
    getEmailCaptcha,
    getTokenTest,
    linkTest,
    postEquipmentAdd,
    getEquipmentData,
    getFilesList,
    postFilesDownload,
    postDownloadIsComplete,
    getLogData,
    postDeleteEquipment,
    getUserList,
    getSNList,
    postUserSN,
    postFileUpload,
    postSSE,
    postRealData,
    postASwitch,
    postHistory,
    getEquipmentVarArray
};
