import apiClient from "./axiosConfig";

// 代理服务配置在 vite.config.ts
const server = '/django/' //47.108.231.242:9002
const fastapiServer = '/fastapi/' //47.108.231.242:7005
const localServer = '/local/' //127.0.0.1:8000（本机）
const comServer = '/ylzs/' //47.108.231.242:9011（公司阿里云）
const xuServer = '/xu/' //192.168.28.228（公司局域网）

const serverUrl = {
    //注册
    register: server + "register",
    
    //登录
    login: server + "login",
    
    //激活SN码设备
    interiorSN: server + "interior_sn",
    
    //注册时的手机验证码
    phoneCaptcha: server + "register_captcha",
    
    //修改密码
    modifyPassword: server + "modify_password",
    
    //单通道设置各种时间
    setTime: fastapiServer + "mqtt/set_time",
    
    //激活SN码设备
    activationEquipment: server + "activation_equipment",
    
    //获取设备列表数据
    DetailedData: server + "detailed_data",
    
    //文件列表数据
    filesList: server + "files_list",
    
    //文件下载
    filesDownload: fastapiServer + "files_download",
    
    //日志列表
    logData: server + "log",
    
    //删除设备
    deleteEquipment: server + "equipment_delete",
    
    // 获取用户列表（Admin）
    userList: server + "user_profile",
    
    // 获取所有SN列表（Admin）
    snList: server + "background_sn",
    
    // 获取用户拥有的所有SN码设备（Admin）
    userSN: server + "user_associated_device",
    
    // 文件上传
    fileUpload: server + "remote_upgrade",
    
    //获取实时数据
    RealData: server + "real_time_data",
    
    //历史数据
    history: server + "history",
    
    //历史文件下载
    historyDownload: fastapiServer + "history_download",
    
    //单通道开关
    singleChannelSwitch: fastapiServer + "mqtt/single_channel_switch",
    
    //OTA文件上传
    upload: fastapiServer + "mqtt/upload",
    
    //修改密码时的手机验证
    modifyPasswordCaptcha: server + "modify_password_captcha",
    
    //注册的时候先验证SN码有效
    registerSnVerify: server + "verify_sn",
    
    //清除所有日志
    clearLog: server + "clear_log",
    
    // 单通道数据分析
    singleAnalysisData: server + "single_analysis_data",
    
    // 多通道数据分析
    multiAnalysisData: server + "multi_analysis_data",
    
    //获取该设备的所有报警日志
    alarmLog: fastapiServer + "mistake_value",
    
    //设置报警条目已读
    alarmAlreadyRead: fastapiServer + "mistake_data_list",
    
    //进入网站的时候进行Token检查
    initTokenDetect: server + "token_test",
    
    //进入网站的时候进行Token检查
    downloadAnalysisData: server + "download_analysis_data",
    
    // 清除所有报警
    clearAlarm: server + "delete_alarm",
    
    // 修改设备名
    modifyDeviceName: server + "revamp_name",
    
    // 修改设备名
    multiChannelDataTest: server + "test_datalist",
    
    //FastAPI Token测试接口
    tokenTestAPI: localServer + "fastapi_token_test",
    
    //多通道开关
    multiChannelSwitch: fastapiServer + "/duo_switch",
    
    //修改用户手机号
    modifyUserPhone: server + "modify_user_phone",
    
    //修改用户手机号
    modifyDevicePassword: server + "modify_device_password",
    
    //修改用户手机号的时候获取验证码
    modifyPhoneCaptcha: server + "modify_phone_captcha",
    
    //获取设备流量
    deviceFlow: comServer + "flows_data",
};

/**
 * 发送用户注册请求
 *
 * @param {string} us : 用户名
 * @param {string} pwd : 密码
 * @param {string} phone : 手机号
 * @param {string} cap : 手机验证码
 * @param {string} sn : 设备SN码
 * @param {string} en : 设备名
 * @returns {Promise}
 */
const postRegister = (us, pwd, phone, cap, sn, en) =>
    apiClient.post(serverUrl.register, {us, pwd, phone, cap, sn, en,});


/**
 * 登录
 *
 * @param {string} username : 用户名
 * @param {string} password : 密码
 */
const postLogin = (username, password) =>
    apiClient.post(serverUrl.login, {username, password,});


/**
 * 注册的时候获取手机验证码
 *
 * @param {string} phone : 用户名
 */
const getPhoneCaptcha = (phone) =>
    apiClient.post(serverUrl.phoneCaptcha, {phone});


/**
 * 激活SN码设备
 *
 * @param {string} sn : 要激活的SN码
 * @param {string} en : 给激活的设备设备名
 */
const postSnActivation = (sn, en) =>
    apiClient.post(serverUrl.activationEquipment, {sn, en});


/**
 * 获取设备列表数据
 *
 */
const getEquipmentData = () =>
    apiClient.get(serverUrl.DetailedData);


/**
 * 获取备份的文件列表数据
 *
 * @param {string} sn : SN码
 */
const postFilesList = (sn) =>
    apiClient.post(serverUrl.filesList, {sn});


/**
 * 获取备份的文件列表数据
 *
 * @param {string} user : 用户名
 * @param {string} folderName : 设备的SN码
 * @param {list} filesList : 要打包下载的文件列表
 */
const postFilesDownload = (user, folderName, filesList) =>
    apiClient.post(serverUrl.filesDownload, {user,folderName, filesList});


/**
 * 获取日志列表
 *
 */
const getLogData = () =>
    apiClient.get(serverUrl.logData);


/**
 * 清除所有日志
 *
 */
const getClearLog = () =>
    apiClient.get(serverUrl.clearLog);


/**
 * 删除设备
 *
 * @param {string} sn : SN码
 */
const postDeleteEquipment = (sn) =>
    apiClient.post(serverUrl.deleteEquipment, {sn});


/**
 * OTA 文件上传
 *
 * @param {string} sn : SN码
 * @param {file} file : 文件的二进制对象
 */
const postFileUpload = (sn, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sn", sn);
    return apiClient.post(serverUrl.upload, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};


/**
 * 设备实时数据（单通道多通道共用）
 *
 * @param {string} sn : SN码
 */
const postRealData = (sn) =>
    apiClient.post(serverUrl.RealData, {sn});


/**
 * 获取历史数据
 *
 * @param {string} sn :  SN码
 * @param {list} type : ['sensors']或者['equipment']
 * @param {list} vars : 数据点的二维数组
 * @param {list} time_frame : 时间范围数组【开始时间，结束时间】
 */
const postHistoryData = (sn, type, vars, time_frame) =>
    apiClient.post(serverUrl.history, {sn, type, vars, time_frame});


/**
 * 下载历史数据（请求和获取历史数据一样）
 *
 * @param {string} sn : SN码
 * @param {list} type_name : ['sensors']或者['equipment']
 * @param {list} vars_name : 数据点的二维数组
 * @param {list} time_frame : 时间范围数组【开始时间，结束时间】
 */
const postHistoryDataDownload = (sn, type_name, vars_name, time_frame) =>
    apiClient.post(serverUrl.historyDownload, {sn, type_name, vars_name, time_frame});


/**
 * 单通道开关
 *
 * @param {string} user : 用户名
 * @param {string} sn : SN码
 * @param {string} value : 执行的开关值
 * @param {string} index : 数据点的二维数组
 */
const postSingleSwitch = (user, sn, value, index) =>
    apiClient.post(serverUrl.singleChannelSwitch, {user, sn, value, index});


/**
 * 多通道开关
 *
 * @param {string} user : 用户名
 * @param {string} sn : SN码
 * @param {string} station_index : 索引指明主站还是从站
 * @param {string} switch_index : 开关索引
 * @param {string} switch_value : 执行的开关值
 */
const postMultiSwitch = (user, sn, station_index, switch_index, switch_value) =>
    apiClient.post(serverUrl.multiChannelSwitch, {user, sn, station_index, switch_index, switch_value});


/**
 * 修改密码的手机验证码接口
 *
 * @param {string} phone : 手机号
 */
const postCaptcha = (phone) =>
    apiClient.post(serverUrl.modifyPasswordCaptcha, {phone});


/**
 * 修改密码
 *
 * @param {string} phone : 手机号
 * @param {string} cap : 手机验证码
 * @param {string} pwd : 新修改的密码
 */
const postModifyPassword = (phone, cap, pwd) =>
    apiClient.post(serverUrl.modifyPassword, {phone, cap, pwd});


/**
 * 注册时SN码验证
 *
 * @param {string} sn : SN码
 */
const postRegisterSnVerify = (sn) =>
    apiClient.post(serverUrl.registerSnVerify, {sn});


/**
 * 单通道设置时间
 *
 * @param {string} sn : SN码
 * @param {string} value : 要设置的时间值
 * @param {list} index : 要设置的索引
 */
const postSetTime = (value, index, sn) =>
    apiClient.post(serverUrl.setTime, {sn, value, index});


/**
 * 单通道数据分析的数据
 *
 * @param {string} sn : SN码
 * @param {list} proportion : 箱子体积面积比
 * @param {list} time_frame : 时间范围
 */
const postSingleAnalysisData = (sn, proportion, time_frame) =>
    apiClient.post(serverUrl.singleAnalysisData, {sn, proportion, time_frame});


/**
 * 访问界面之后检测Token
 *
 */
const getInitTokenDetect = () =>
    apiClient.get(serverUrl.initTokenDetect, {});


/**
 * 设置报警已读
 *
 * @param {string} sn : SN码
 * @param {list} time_list : 要已读的报警时间数组
 */
const postAlarmAlreadyRead = (sn, time_list) =>
    apiClient.post(serverUrl.alarmAlreadyRead, {sn, time_list});


/**
 * 获取报警日志
 *
 * @param {string} sn : SN码
 */
const postAlarmLog = (sn) =>
    apiClient.post(serverUrl.alarmLog, {sn});


/**
 * 下载分析数据的文件(用文件流传输）
 * @param {string} sn : SN码
 * @param {list} proportion : 体积面积比
 * @param {list} time_frame : 时间范围数组
 */
const postAnalysisDataDownload = (sn, proportion, time_frame) =>
    apiClient.post(serverUrl.downloadAnalysisData, {sn, proportion, time_frame}, {responseType: "blob"});

/**
 * 清除所有报警信息
 *
 * @param {string} sn : SN码
 */
const postClearAlarm = (sn) =>
    apiClient.post(serverUrl.clearAlarm, {sn});


/**
 * 修改设备名
 *
 * @param {string} sn : SN码
 * @param {string} en : 修改后的设备名
 */
const postModifyDeviceName = (sn, en) =>
    apiClient.post(serverUrl.modifyDeviceName, {sn, en});

/**
 * 修改主站设备的密码（暂未使用）
 *
 */
const postModifyDevicePassword = (sn, en) =>
    apiClient.post(serverUrl.modifyDevicePassword, {sn, en});

/**
 * 修改用户手机号时获取验证码
 *
 * @param {string} phone : 用户名
 */
const postModifyPhoneCaptcha= (phone) =>
    apiClient.post(serverUrl.modifyPhoneCaptcha, {phone});


/**
 * 修改用户手机号
 *
 * @param {string} phone : 手机号
 * @param {string} cap : 手机验证码
 */
const postModifyUserPhone = (phone, cap) =>
    apiClient.post(serverUrl.modifyUserPhone, {phone, cap});


/**
 * 访问界面之后检测Token，检测Cookie中的Token是否过期
 *
 */
const getFastAPITokenTest = () =>
    apiClient.get(serverUrl.tokenTestAPI, {});


/**
 * 修改用户手机号时获取验证码
 *
 * @param {string} sn : SN码
 */
const postDeviceFlow= (sn) =>
    apiClient.post(serverUrl.deviceFlow, {sn});

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
    getLogData,
    postDeleteEquipment,
    postFileUpload,
    postRealData,
    postHistoryData,
    postSingleSwitch,
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
    getFastAPITokenTest,
    postMultiSwitch,
    postModifyDevicePassword,
    postModifyPhoneCaptcha,
    postModifyUserPhone,
    postDeviceFlow,
};
