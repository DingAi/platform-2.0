import {template} from "lodash";

const lineOptionTemplate = {
    legend:{},
    tooltip: {
        trigger: 'axis'
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