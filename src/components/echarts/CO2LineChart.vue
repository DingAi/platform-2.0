<template>
	<div class="size-full" ref="co2Line">
	
	</div>
</template>

<script setup>
import {refInitEcharts, setOptionXAxis, setSeriesData} from "@/utils/eharts-init.js";
import {lineOptionTemplate} from "@/assets/echarts-template/line-chart.js";
import {onMounted, ref, watch} from "vue";
import {getCurrentTime} from "@/utils/tools-functions.js";

const props = defineProps({
	co2Value: Number,
})

const co2Line = ref(null);
let option = JSON.parse(JSON.stringify(lineOptionTemplate));;
// option = setChartTitle(option, 'CO2传感器数据')

let dataList = [];
let timeList = [];

function chartDataFlow(value, dataList, xLength) {
	dataList.push(value);
	if (dataList.length === xLength) {
		dataList.shift()
	}
	return dataList;
}

const refresh = (dom, option, value) => {
	let currentTime = getCurrentTime()
	dataList = chartDataFlow(value, dataList, option);
	timeList = chartDataFlow(currentTime, timeList, option);
	option = setSeriesData(setOptionXAxis(option, timeList), dataList);
	dom.setOption(option);
}

onMounted(() => {
	const dom = refInitEcharts(co2Line.value, 'green');
	
	window.addEventListener('resize', function () {
		dom.resize();
	});
	
	watch(
		() => props.co2Value,
		() => {
			if (props.co2Value) {
				refresh(dom, option, props.co2Value)
			}
		}
	)
})
</script>

<style scoped>

</style>