import apiClient from "./axiosConfig";

// 代理服务配置在 vite.config.ts
const server = '/django/' //47.108.231.242:9002
const fastapiServer = '/fastapi/' //47.108.231.242:7005
const localServer = '/local/' //127.0.0.1:8000（本机）
const xuServer = '/xu/' //192.168.28.228（公司局域网）

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
    history: server + "history", //历史数据
    historyDownload: server + "history_download", //历史数据
    singleChannelSwitch: fastapiServer + "mqtt/single_channel_switch", //单通道开关
    upload: fastapiServer + "mqtt/upload", //OTA文件上传
    modifyPasswordCaptcha: server + "modify_password_captcha", //修改密码时的手机验证
    registerSnVerify: server + "verify_sn",  //注册的时候先验证SN码有效
    clearLog: server + "clear_log", //清除所有日志
    singleAnalysisData: server + "single_analysis_data",
    alarmLog: fastapiServer + "mistake_value", //获取该设备的所有报警日志
    alarmAlreadyRead: fastapiServer + "mistake_data_list", //设置报警条目已读
    initTokenDetect: server + "token_test", //进入网站的时候进行Token检查
    downloadAnalysisData: server + "download_analysis_data", //进入网站的时候进行Token检查
    clearAlarm: server + "delete_alarm", // 清除所有报警
    modifyDeviceName: server + "revamp_name", // 修改设备名
    multiChannelDataTest: server + "test_datalist", // 修改设备名
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
const getEquipmentData = () =>
    apiClient.get(apiEndpoints.DetailedData);

// 获取备份的文件列表数据
const postFilesList = (sn) =>
    apiClient.post(apiEndpoints.filesList, {sn});

// 获取要下载的文件流
const postFilesDownload = (folderName, filesList) =>
    apiClient.post(apiEndpoints.filesDownload, {folderName, filesList,}, {responseType: "blob",},);

// 下载完后，后端需要信号删除文件
const postDownloadIsComplete = (sn) =>
    apiClient.post(apiEndpoints.downloadComplete, {sn});

// 获取日志列表
const getLogData = () =>
    apiClient.get(apiEndpoints.logData);

// 清除所有日志
const getClearLog = () =>
    apiClient.get(apiEndpoints.clearLog);

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
    apiClient.post(apiEndpoints.history, {sn, type, vars, time_frame});

// 下载历史数据
const postHistoryDataDownload = (sn, type, vars, time_frame) =>
    apiClient.post(apiEndpoints.historyDownload, {sn, type, vars, time_frame}, {responseType: "blob",});

// 单通道开关
const postSwitch = (user, sn, value, index) =>
    apiClient.post(apiEndpoints.singleChannelSwitch, {user, sn, value, index});

// 修改密码的手机验证码接口
const postCaptcha = (phone) =>
    apiClient.post(apiEndpoints.modifyPasswordCaptcha, {phone});

// 修改密码
const postModifyPassword = (phone, cap, pwd) =>
    apiClient.post(apiEndpoints.modifyPassword, {phone, cap, pwd});

// 注册时SN码验证
const postRegisterSnVerify = (sn) =>
    apiClient.post(apiEndpoints.registerSnVerify, {sn});

// 单通道设置时间
const postSetTime = (value, index, sn) =>
    apiClient.post(apiEndpoints.setTime, {sn, value, index});

// 数据分析的数据
const postSingleAnalysisData = (sn, proportion, time_frame) =>
    apiClient.post(apiEndpoints.singleAnalysisData, {sn, proportion, time_frame});

// 访问界面之后检测Token
const getInitTokenDetect = () =>
    apiClient.get(apiEndpoints.initTokenDetect, {});

// 设置报警已读
const postAlarmAlreadyRead = (sn, time_list) =>
    apiClient.post(apiEndpoints.alarmAlreadyRead, {sn, time_list});

// 获取报警日志
const postAlarmLog = (sn) =>
    apiClient.post(apiEndpoints.alarmLog, {sn});

// 下载分析数据的文件(用文件流传输）
const postAnalysisDataDownload = (sn, proportion, time_frame) =>
    apiClient.post(apiEndpoints.downloadAnalysisData, {sn, proportion, time_frame}, {responseType: "blob",});

// 清除所有报警信息
const postClearAlarm = (sn) =>
    apiClient.post(apiEndpoints.clearAlarm, {sn});

// 修改设备名
const postModifyDeviceName = (sn, en) =>
    apiClient.post(apiEndpoints.modifyDeviceName, {sn, en});

// 修改设备名
const getMultiChannelDataTest = () =>
    apiClient.get(apiEndpoints.multiChannelDataTest);

// 抛出所有的API函数
export {
    server,
    xuServer,
    postRegister,
    postLogin,
    getPhoneCaptcha,
    postSnActivation,
    getEquipmentData,
    postFilesList,
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
    postAlarmAlreadyRead,
    postAlarmLog,
    getInitTokenDetect,
    postAnalysisDataDownload,
    postClearAlarm,
    postHistoryDataDownload,
    postModifyDeviceName,
    getMultiChannelDataTest,
};
