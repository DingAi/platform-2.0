<template>
	<div class="size-full" ref=thLine>
	
	</div>
</template>

<script setup>
import {refInitEcharts, setOptionXAxis, setSeriesData} from "@/utils/eharts-init.js";
import {lineOptionTemplate} from "@/assets/echarts-template/line-chart.js";
import {onMounted, ref, watch} from "vue";
import ThLineChart from "@/components/echarts/ThLineChart.vue";

const props = defineProps({
	thValue: Array,
	currentTime: String,
})

const thLine = ref(null);
const nameList = ['箱内温度', '箱内湿度', '箱外温度', '箱外湿度']
let option = JSON.parse(JSON.stringify(lineOptionTemplate));
let dataList1 = []
let dataList2 = []
let dataList3 = []
let dataList4 = []
let timeList = []

function chartDataFlow(value, dataList, xLength) {
	dataList.push(value);
	if (dataList.length === xLength) {
		dataList.shift()
	}
	return dataList;
}

const refresh = (dom) => {
	dataList1 = chartDataFlow(props.thValue[0], dataList1, 20);
	dataList2 = chartDataFlow(props.thValue[1], dataList2, 20);
	dataList3 = chartDataFlow(props.thValue[2], dataList3, 20);
	dataList4 = chartDataFlow(props.thValue[3], dataList4, 20);
	option.series = [
		{data: dataList1, name: nameList[0], type: 'line',},
		{data: dataList2, name: nameList[1], type: 'line',},
		{data: dataList3, name: nameList[2], type: 'line',},
		{data: dataList4, name: nameList[3], type: 'line',}
	]
	option.xAxis.data = chartDataFlow(props.currentTime, timeList, 20)
	dom.setOption(option);
}

onMounted(() => {
	const dom = refInitEcharts(thLine.value, 'green');
	window.addEventListener('resize', function () {
		dom.resize();
	});
	
	watch(
		() => props.thValue,
		() => {
			if (props.thValue) {
				refresh(dom)
			}
		},
		{deep: true}
	)
})
</script>

<style scoped>

</style>