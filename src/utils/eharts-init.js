import * as echarts from 'echarts';
import 'echarts/theme/jazz.js'
import 'echarts/theme/green.js'
import 'echarts/theme/jazz'
import 'echarts/theme/mint.js'
import 'echarts/theme/dark-bold.js'


const refInitEcharts = (ref,) => {
    let dom = echarts.init(ref, 'green');
    return dom;
}

export {
    refInitEcharts,
}