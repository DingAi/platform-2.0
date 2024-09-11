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
    series: [
        {
            data: [],
            type: 'line',
            smooth: true, //平滑曲线
        }
    ]
};

export {
    lineOptionTemplate,
}