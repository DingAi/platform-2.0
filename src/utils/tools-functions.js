//数组转置函数
import moment from "moment";
import {ElMessage} from "element-plus";

// 二维数组转置
function transposeMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}


/**
 * 返回从当前时间开始向后 hour 个小时的时间范围
 * @param {number} hour ： 小时
 * @return {[string, string]} 时间范围数组
 */
function getTimeRange(hour) {
    const currentTime = moment();
    // 获取24小时前的时间
    const twentyFourHoursAgo = moment().subtract(hour, "hours");
    // 格式化时间为指定格式（年月日 时分秒）
    const formattedCurrentTime = currentTime.format("YYYY-MM-DD HH:mm:ss");
    const formattedTwentyFourHoursAgo = twentyFourHoursAgo.format(
        "YYYY-MM-DD HH:mm:ss",
    );
    // 构建时间范围数组
    return [formattedTwentyFourHoursAgo, formattedCurrentTime];
}

//表格的数据转换
function tableTransformData(data, keyNames) {
    const [nameKey, emailKey, dateKey] = keyNames;
    const tableData = [];
    
    for (let i = 0; i < data[0].length; i++) {
        tableData.push({
            [nameKey]: data[0][i],
            [emailKey]: data[1][i],
            [dateKey]: data[2][i],
        });
    }
    return tableData;
}

// 使用Element Plus获取报警
function showMessage(message, type = "error", duration = 2000) {
    ElMessage({
        message,
        type,
        duration,
    });
}

// 历史数据加工
function selectProcessData(data) {
    const firstValuesSet = new Set();
    const mapping = {};
    
    data.forEach(subArray => {
        if (subArray.length >= 2) {
            const firstValue = subArray[0];
            const secondValue = subArray[1];
            firstValuesSet.add(firstValue);
            if (!mapping[firstValue]) {
                mapping[firstValue] = [];
            }
            mapping[firstValue].push(secondValue);
        }
    });
    const firstValuesArray = Array.from(firstValuesSet);
    const secondValuesArray = Object.values(mapping);
    
    return {
        typeDataList: firstValuesArray,
        varDataList: secondValuesArray
    };
}

//Excel的xlsx文件时间戳转换函数
function excelTimestampToDate(excelTimestamp) {
    // Excel 的起点日期是 1899-12-30
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    
    // 将天数转换为毫秒
    const daysInMilliseconds = Math.floor(excelTimestamp) * 24 * 60 * 60 * 1000;
    const fractionalDayInMilliseconds = (excelTimestamp % 1) * 24 * 60 * 60 * 1000;
    
    // 基准时间加上天数和当天的时间
    let exactDate = new Date(excelEpoch.getTime() + daysInMilliseconds + fractionalDayInMilliseconds);
    
    // 将秒数向上取整处理
    const millisecondsInDay = (excelTimestamp % 1) * 24 * 60 * 60 * 1000;
    const roundedSeconds = Math.ceil(millisecondsInDay / 1000);
    
    // 重新计算小时、分钟和秒
    exactDate.setUTCHours(Math.floor(roundedSeconds / 3600));
    exactDate.setUTCMinutes(Math.floor((roundedSeconds % 3600) / 60));
    exactDate.setUTCSeconds(roundedSeconds % 60);
    
    // 返回格式化后的时间
    return exactDate.toISOString().replace('T', ' ').substring(0, 19);
}

function elementTableDataConversion(headList, lineDataList){
    let outcome = []
    for (let item of lineDataList){
        let aLine = {
            alarmEquipment: item[0],
            alarmContent: item[1],
            alarmTime: item[2],
            alarmState: item[3]
        }
        outcome.push(aLine);
    }
    return outcome;
}



export {
    transposeMatrix,
    getTimeRange,
    tableTransformData,
    showMessage,
    selectProcessData,
    excelTimestampToDate,
    elementTableDataConversion,
};
