import {template} from "lodash";

const lineOptionTemplate = {
    title: {
        // text: "TITLE",
    },
    legend:{},
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