import apiClient from "./axiosConfig";

const apiEndpoints = {
  initRoll: "mysql_dan",
  login: "generate_token",
  addSN: "interior_sn",
  emailCaptcha: "you_x",
  tokenTest: "analysis_token",
  linkTest: "ceshi",
  equipmentAdd: "add_equipments",
  equipmentData: "register_data",
  filesList: "files_list",
  filesDownload: "files_download",
  downloadComplete: "delete_zip_file",
  logData: "log",
  deleteEquipment: "equipment_delete",
  userList: "user_profile",
  snList: "background_sn",
  userSN: "user_associated_device",
  fileUpload: "remote_upgrade",
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
  apiClient.post(apiEndpoints.login, {
    username,
    password,
  });

const postAddSN = (sn) => apiClient.post(apiEndpoints.addSN, { sn });

const getEmailCaptcha = (email) =>
  apiClient.post(apiEndpoints.emailCaptcha, { email });

const getTokenTest = () => apiClient.get(apiEndpoints.tokenTest);

const linkTest = () => apiClient.get(apiEndpoints.linkTest);

const postEquipmentAdd = (sn, en) =>
  apiClient.post(apiEndpoints.equipmentAdd, { sn, en });

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
  apiClient.post(apiEndpoints.downloadComplete, { sn });

const getLogData = () => apiClient.get(apiEndpoints.logData);

const postDeleteEquipment = (sn) =>
  apiClient.post(apiEndpoints.deleteEquipment, { sn });

const getUserList = () => apiClient.get(apiEndpoints.userList);

const getSNList = () => apiClient.get(apiEndpoints.snList);

const postUserSN = (username) =>
  apiClient.post(apiEndpoints.userSN, { username });

const postFileUpload = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.post(apiEndpoints.fileUpload, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 导出所有的API函数
export {
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
};
