const fluxOption = {
    color: ["#ec4899", "#22c55e",],
    title: {
        text: '通量历史记录',
        left: 'center'
    },
    xAxis: {
        type: 'category',
        // axisLine: { onZero: true },
        // boundaryGap: true,
        data: []
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
    grad: {
        containLabel:true
    },
    legend: {
        top: '7%',
        // data: ['CO₂通量', 'H₂O通量'],
    },
    tooltip: {
        trigger: 'axis',
        textStyle:{
            align:'left'  // 文字左对齐
        }
    },
    yAxis: {
        type: 'value'
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
            // label: {show: true, fontSize: 16},
            name: 'CO₂ 通量',
            type: 'bar',
            smooth: false,  //曲线平滑
            areaStyle: {},
        },
        {
            data: [],
            name: 'H₂O 通量',
            type: 'bar',
            smooth: false,  //曲线平滑
            areaStyle: {}
        }
    ]
};

export {
    fluxOption
}