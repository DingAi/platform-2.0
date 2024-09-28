//数组转置函数
import moment from "moment";
import {ElMessage} from "element-plus";

function transposeMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

// 返回从当前时间开始向后hour个小时的时间范围
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
    const timeRange = [formattedTwentyFourHoursAgo, formattedCurrentTime];
    return timeRange;
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

function chartDataFlow(value, dataList, xLength) {
    dataList.push(value);
    if (dataList.length === xLength) {
        dataList.shift()
    }
    return dataList;
}

function showMessage(message, type = "error", duration = 2000) {
    ElMessage({
        message,
        type,
        duration,
    });
}

function getCurrentTime() {
    return moment().format('YY-MM-DD HH:mm:ss');
}

function selectProcessData(data) {
    // 初始化分类集合和分类对应的条目对象
    const categoriesSet = new Set();
    const categoriesMap = {};
    
    // 遍历数据，分类数据
    data.forEach(([category, item]) => {
        categoriesSet.add(category); // 收集分类
        if (!categoriesMap[category]) {
            categoriesMap[category] = []; // 初始化分类对应的条目数组
        }
        categoriesMap[category].push(item); // 添加条目到对应分类
    });
    
    // 将 Set 转换为数组，得到第一个数组
    const categoriesArray = Array.from(categoriesSet);
    
    // 将分类条目对象转换为数组，得到第二个数组
    const entriesArray = Object.values(categoriesMap);
    // 返回结果
    return {
        categories: categoriesArray,  // 分类数组
        entries: entriesArray          // 分类对应的条目数组
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

export {
    transposeMatrix,
    getTimeRange,
    tableTransformData,
    chartDataFlow,
    showMessage,
    getCurrentTime,
    selectProcessData,
    excelTimestampToDate
};
