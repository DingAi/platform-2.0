import apiClient from './axiosConfig'
import axios from "axios";
import {method} from "lodash";

const postInitRoll = (us, pwd, em, cap, sn, en) => {
    let url = 'mysql_dan';
    return apiClient({
        url: url,
        method: 'post',
        data: {
            'us':us,
            'pwd':pwd,
            'em':em,
            'cap': cap,
            'sn':sn,
            'en':en
        }
    })
}

const postLogin= (username, password) => {
    let url = 'generate_token';
    return apiClient({
        url: url,
        method: 'post',
        data: {
            'username':username,
            'password':password,
        }
    })
}

const postAddSN= (sn) => {
    let url = 'interior_sn';
    return apiClient({
        url: url,
        method: 'post',
        data: {
            'sn':sn,
        }
    })
}

const getEmailCaptcha = (email) => {
    let url = 'you_x';
    return apiClient({
        url: url,
        method: 'post',
        data: {
            email: email
        }
    })
}

const getTokenTest = () => {
    let url = 'analysis_token';
    return apiClient({
        url: url,
        method: 'get'
    })
}

const linkTest = () => {
    let url = 'ceshi';
    return apiClient({
        url: url,
        method: 'get'
    })
}

const postEquipmentAdd = (sn, en) => {
    let url = 'add_equipments';
    return apiClient({
        url: url,
        method: 'post',
        data: {
            sn:sn,
            en:en,
        }
    })
}

const getEquipmentData = () => {
    let url = 'register_data';
    return apiClient({
        url: url,
        method: 'get',
    })
}

const getFilesList = () => {
    let url = 'files_list';
    return apiClient({
        url: url,
        method: 'get',
    })
}

const postFilesDownload = (folderName, filesList) => {
    let url = 'files_download';
    return apiClient({
        url: url,
        method: 'post',
        data: {
            'folderName':folderName,
            'filesList':filesList
        },
        responseType: 'blob',
    })
}

const postDownloadIsComplete = (sn) => {
    let url = 'delete_zip_file';
    return apiClient({
        url: url,
        method: 'post',
        data: {
            'sn' : sn
        }
    })
}

const downloadTest = () =>{
    let url = 'dt';
    return axios({
        url: url,
        method: "get",
        responseType: 'blob',
    });
}

// const apiTest = () =>{
//     let url = '/django/tt/';
//     return axios({
//         url: url,
//         method: "get",
//     });
// }

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
    downloadTest,
}