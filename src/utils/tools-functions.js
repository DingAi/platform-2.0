//数组转置函数
import moment from "moment";

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

export { transposeMatrix, getTimeRange, tableTransformData };
