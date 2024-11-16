import * as echarts from 'echarts';
import 'echarts/theme/macarons.js'

/**
 * 根据元素的ref属性来生成Echarts的dom
 *
 * @param {string} ref : 元素的ref属性
 * @param {list} theme : 表格的主题
 */
const refInitEcharts = (ref, theme="macarons") => {
    if (ref) {
        // 这里{ renderer: 'canvas' }是使用WebGL渲染Echarts，提高渲染速度
        let dom = echarts.init(ref, theme, { renderer: 'canvas' });
        return dom;
    }
    return null;
}

/**
 * 根据元素的id属性来生成Echarts的dom
 *
 * @param {string} id : 元素的ref属性
 */
const idInitEcharts = (id) => {
    let theDiv = document.getElementById(id);
    const dom = echarts.init(theDiv, 'new-blue' );
    return dom;
}


export {
    refInitEcharts,
    idInitEcharts,
}