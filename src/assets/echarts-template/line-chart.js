// ====================================================================================
// Echarts图表样式，多个界面使用
// ====================================================================================
const lineOptionTemplate = {
    title: {
        text: "TITLE",
        left: 'center'
    },
    legend:{top: '7%',},
    tooltip: {
        trigger: 'axis',
        textStyle:{
            align:'left'  // 文字左对齐
        }
    },
    toolbox: {
        show: true,
        feature: {
            dataView: {readOnly: true},
            magicType: { type: ['bar', 'line'] },
            saveAsImage: {},
            restore: {},
        }
    },
    xAxis: {
        data: []
    },
    yAxis: {
        type: 'value',
        name: '',
    },
    dataZoom: [
        {
            show: true,
            start: 0,
            end: 100,
        },
        {
            type: 'inside',
            start: 0,
            end: 100,
        }
    ],
    series: []
};

export {
    lineOptionTemplate,
}