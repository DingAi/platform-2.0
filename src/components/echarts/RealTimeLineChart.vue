<!--温湿度图表-->
<template>
	<div class="size-full" ref=thLine>
	
	</div>
</template>

<script setup>
import {refInitEcharts} from "@/utils/eharts-init.js";
import {lineOptionTemplate} from "@/assets/echarts-template/line-chart.js";
import {onMounted, ref, watch} from "vue";

const { thValue, currentTime } = defineProps({
	thValue : Array,
	currentTime: String,
})

const thLine = ref(null);
const nameList = ['箱内温度', '箱内湿度', '箱外温度', '箱外湿度','二氧化碳浓度']

let option = JSON.parse(JSON.stringify(lineOptionTemplate)); //这里的option需要建立一个新的对象
option.color = ["#db2777", "#3F51B5",];
let dataList1 = []
let dataList2 = []
let dataList3 = []
let dataList4 = []
let dataList5 = []
let timeList = []

/**
 * 数据数组的更新（到达xLength长度之后新添加一个就总头部删除一个）
 * @param {number} value ： 要添加到数组中的新值
 * @param {list} dataList ： 原来的数据数组
 * @param {number} xLength ： 数组要维持的长度
 */
function chartDataFlow(value, dataList, xLength) {
	dataList.push(value);
	if (dataList.length === xLength) {
		dataList.shift()
	}
	return dataList;
}


/**
 * 图表的数据刷新
 * @param {echartDom} dom ： Echarts声明的Dom
 */
const refresh = (dom) => {
	if (thValue.length > 0){
		dataList1 = chartDataFlow(thValue[0], dataList1, 20);
		dataList2 = chartDataFlow(thValue[1], dataList2, 20);
		dataList3 = chartDataFlow(thValue[2], dataList3, 20);
		dataList4 = chartDataFlow(thValue[3], dataList4, 20);
		dataList5 = chartDataFlow(thValue[4], dataList4, 20);
		option.series = [
			{data: dataList1, name: nameList[0], type: 'line',},
			{data: dataList2, name: nameList[1], type: 'line',},
			{data: dataList3, name: nameList[2], type: 'line',},
			{data: dataList4, name: nameList[3], type: 'line',},
			{data: dataList5, name: nameList[4], type: 'line',}
		]
		option.xAxis.data = chartDataFlow(currentTime, timeList, 20)
	} else {
		option.series = [
			{data: [], name: nameList[0], type: 'line',},
			{data: [], name: nameList[1], type: 'line',},
			{data: [], name: nameList[2], type: 'line',},
			{data: [], name: nameList[3], type: 'line',},
			{data: [], name: nameList[4], type: 'line',}
		]
		option.xAxis.data = []; // 清空 x 轴数据
	}
	dom.setOption(option);
}

onMounted(() => {
	const dom = refInitEcharts(thLine.value);
	window.addEventListener('resize', function () {
		dom.resize();
	});
	
	watch(
		() => thValue,
		() => {
			if (thValue.length === 0) {
				dataList1 = [];
				dataList2 = [];
				dataList3 = [];
				dataList4 = [];
				timeList = [];
			}
			refresh(dom)
		},
		{deep: true}
	)
})
</script>

<style scoped>

</style>