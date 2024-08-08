import {EChartsOption} from "echarts";

const option = {
    title:'TITLE',
    legend:{},
    tooltip:{},
    xAxis: {
        type: 'category',
        name: '',
        data: []
    },
    yAxis: {
        type: 'value',
        name: '',
    },
    dataZoom: [
        {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
            start: 0,
            end: 100
        },
        {
            id: 'dataZoomY',
            type: 'slider',
            yAxisIndex: [0],
            filterMode: 'empty',
            start: 100,
            end: 100
        }
    ],
    series: [
        {
            data: [],
            type: 'line',
            smooth: true, //平滑曲线
        }
    ]
};

function setSeries(data , name, option) {
    option.series.push({
        data: data,
        type: 'line',
        name: name,
    });
    return option
}

export {
    option,
    setSeries
}