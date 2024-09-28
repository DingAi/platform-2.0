import * as echarts from 'echarts';
import 'echarts/theme/jazz.js'
import 'echarts/theme/green.js'
import 'echarts/theme/mint.js'
import 'echarts/theme/dark-bold.js'
import 'echarts/theme/forest.js'


const refInitEcharts = (ref, theme="mint") => {
    if (ref) {
        let dom = echarts.init(ref, theme);
        return dom;
    }
    return null;
}

const idInitEcharts = (id) => {
    let theDiv = document.getElementById(id);
    const dom = echarts.init(theDiv, 'mint');
    return dom;
}

const setOptionXAxis = (option, XAxisData) => {
    option.xAxis.data = XAxisData;
    return option;
}

const setSeriesData = (option, data) => {
    option.series[0].data = data;
    return option;
}

function addSeriesData(data, name, option, type='line') {
    option.series.push({
        data: data,
        type: type,
        name: name,
    });
    return option
}

function addDataZoomX(option) {
    option.dataZoom = [
        {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
            start: 0,
            end: 100
        },
    ]
}

function addDataZoomY(option) {
    option.dataZoom = [
        {
            id: 'dataZoomY',
            type: 'slider',
            yAxisIndex: [0],
            filterMode: 'empty',
            start: 100,
            end: 100
        }
    ]
}

function setChartType(option, type) {
    option.series[0].type = type;
    return option
}

function setChartTitle(option, title) {
    option.title.text = title;
}

export {
    refInitEcharts,
    idInitEcharts,
    setOptionXAxis,
    setSeriesData,
    addSeriesData,
    addDataZoomX,
    addDataZoomY,
    setChartType,
    setChartTitle,
}