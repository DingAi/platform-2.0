let gaugeData = [
    {
        value: 20,
        name: '箱内气压',
        title: {
            offsetCenter: ['-30%', '80%']
        },
        detail: {
            offsetCenter: ['-30%', '95%']
        }
    },
    {
        value: 40,
        name: '箱外气压',
        title: {
            offsetCenter: ['30%', '80%']
        },
        detail: {
            offsetCenter: ['30%', '95%']
        }
    },
];

let gaugeOption = {
    tooltip: {
        trigger: 'axis'
    },
    series: [
        {
            type: 'gauge',
            anchor: {
                show: true,
                showAbove: true,
                size: 18,
                itemStyle: {
                    color: '#FAC858'
                }
            },
            pointer: {
                icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                width: 5,
                length: '80%',
                offsetCenter: [0, '8%']
            },
            progress: {
                show: true,
                overlap: true,
                roundCap: true
            },
            axisLine: {
                roundCap: true
            },
            data: gaugeData,
            title: {
                fontSize: 14
            },
            detail: {
                width: 50,
                height: 13,
                fontSize: 13,
                color: '#fff',
                backgroundColor: 'inherit',
                borderRadius: 3,
                formatter: '{value}KPa'
            },
            min: -300,
            max: 300,
        }
    ]
};


const setGaugeData = (value_1, value_2, name1, name2) => {
    gaugeData[0].value = value_1;
    gaugeData[1].value = value_2;
    gaugeData[0].name = name1;
    gaugeData[1].name = name2;
    gaugeOption.series[0].data = gaugeData;
    return gaugeOption
}

export {
    setGaugeData,
}