import apiClient from "./axiosConfig";

const server = '/django/'
const fastapiServer = '/fastapi/'
const localServer = '/local/' //127.0.0.1:8000
const xuServer = '/xu/' //192.168.28.228:

const apiEndpoints = {
    register: server + "register", //注册
    login: server + "login",  //登录
    interiorSN: server + "interior_sn",  //激活SN码设备
    phoneCaptcha: server + "register_captcha",  //注册时的手机验证码
    modifyPassword: server + "modify_password",  //修改密码
    setTime: fastapiServer + "mqtt/set_time",  //单通道设置各种时间
    activationEquipment: server + "activation_equipment",  //激活SN码设备
    DetailedData: server + "detailed_data",  //获取设备列表数据
    filesList: server + "files_list",  //文件列表数据
    filesDownload: server + "files_download",  //文件下载
    downloadComplete: server + "delete_zip_file",  //下载完成之后给后端信号
    logData: server + "log",  //日志列表
    deleteEquipment: server + "equipment_delete",  //删除设备
    userList: server + "user_profile",  // 获取用户列表（Admin）
    snList: server + "background_sn", // 获取所有SN列表（Admin）
    userSN: server + "user_associated_device", // 获取用户拥有的所有SN码设备（Admin）
    fileUpload: server + "remote_upgrade", // 文件上传
    RealData: server + "real_time_data", //单通道获取实时数据
    History: server + "history", //历史数据
    singleChannelSwitch: fastapiServer + "mqtt/single_channel_switch", //单通道开关
    upload: fastapiServer + "mqtt/upload", //OTA文件上传
    modifyPasswordCaptcha: server + "modify_password_captcha", //修改密码时的手机验证
    registerSnVerify: server + "verify_sn",  //注册的时候先验证SN码有效
    clearLog: server + "clear_log", //清除所有日志
    singleAnalysisData: server + "single_analysis_data" //清除所有日志
};

// 定义API请求函数
const postRegister = (us, pwd, phone, cap, sn, en) =>
    apiClient.post(apiEndpoints.register, {us, pwd, phone, cap, sn, en,});

const postLogin = (username, password) =>
    apiClient.post(apiEndpoints.login, {username, password,});

// 注册的时候获取手机验证码
const getPhoneCaptcha = (phone) =>
    apiClient.post(apiEndpoints.phoneCaptcha, {phone});

// 激活SN码设备
const postSnActivation = (sn, en) =>
    apiClient.post(apiEndpoints.activationEquipment, {sn, en});

// 获取设备列表
const getEquipmentData = () => apiClient.get(apiEndpoints.DetailedData);

// 获取要下载的文件列表数据
const getFilesList = (sn) => apiClient.post(apiEndpoints.filesList, {sn});

// 获取要下载的文件流
const postFilesDownload = (folderName, filesList) =>
    apiClient.post(apiEndpoints.filesDownload, {folderName, filesList,}, {responseType: "blob",},);

const postDownloadIsComplete = (sn) =>
    apiClient.post(apiEndpoints.downloadComplete, {sn});

// 获取日志列表
const getLogData = () => apiClient.get(apiEndpoints.logData);

// 清除所有日志
const getClearLog = () => apiClient.get(apiEndpoints.clearLog);

// 删除设备
const postDeleteEquipment = (sn) =>
    apiClient.post(apiEndpoints.deleteEquipment, {sn});

// OTA 文件上传
const postFileUpload = (sn, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sn", sn);
    return apiClient.post(apiEndpoints.upload, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// 单通道设备实时数据
const postRealData = (sn) =>
    apiClient.post(apiEndpoints.RealData, {sn});

// 获取历史数据
const postHistoryData = (sn, type, vars, time_frame) =>
    apiClient.post(apiEndpoints.History, {sn, type, vars, time_frame});

// 获取设备传感器数据点
const getEquipmentVarArray = () => apiClient.get(apiEndpoints.equipmentVar);

// 单通道开关
const postSwitch = (sn, value, index) =>
    apiClient.post(apiEndpoints.singleChannelSwitch, {sn, value, index});

// 修改密码的手机验证码接口
const postCaptcha = (phone) =>
    apiClient.post(apiEndpoints.modifyPasswordCaptcha, {phone});

// 修改密码
const postModifyPassword = (phone, cap, pwd) =>
    apiClient.post(apiEndpoints.modifyPassword, {phone, cap, pwd});

// 注册时SN码验证
const postRegisterSnVerify = (sn) => apiClient.post(apiEndpoints.registerSnVerify, {sn});

// 单通道设置时间
const postSetTime = (value, index, sn) => apiClient.post(apiEndpoints.setTime, {sn, value, index});

// 数据分析的数据
const postSingleAnalysisData = (sn, time_frame) => apiClient.post(apiEndpoints.singleAnalysisData, {sn, time_frame});


// 导出所有的API函数
export {
    server,
    xuServer,
    postRegister,
    postLogin,
    getPhoneCaptcha,
    postSnActivation,
    getEquipmentData,
    getFilesList,
    postFilesDownload,
    postDownloadIsComplete,
    getLogData,
    postDeleteEquipment,
    postFileUpload,
    postRealData,
    postHistoryData,
    postSwitch,
    postCaptcha,
    postModifyPassword,
    postRegisterSnVerify,
    postSetTime,
    getClearLog,
    postSingleAnalysisData,
};
