<template>
	<div class="size-full p-4" ref="historyLine">
	
	</div>
</template>

<script setup lang="js">
import {onMounted, ref, watch} from "vue";
import {refInitEcharts} from "@/utils/eharts-init.js";
import {lineOptionTemplate} from "@/assets/echarts-template/line-chart.js";

const props = defineProps({
	historyData: Array,
	xAxisData: Array,
	historyLoading: Boolean
})

const historyLine = ref(null);


const refresh = (dom, historyData, xAxis) => {
	let option = JSON.parse(JSON.stringify(lineOptionTemplate));
	try {
		console.log('图表数据：', props.historyData)
		option.xAxis.data = props.xAxisData
		let data = JSON.parse(localStorage.getItem("sensorData"))
		let dataList = [...data[0].children, ...data[1].children];
		const result = dataList.reduce((acc, item) => {
			acc[item.value] = item.label;
			return acc;
		}, {});
		for(let i = 0; i < props.historyData[1].length; i++) {
			option.series.push({
				data: props.historyData[1][i],
				name: result[props.historyData[0][0][i]],
				type: 'line',
				symbol: 'none', // 隐藏数据点
			})
		}
	} catch (e){
		console.error(e)
	} finally {
		dom.setOption(option);
		dom.hideLoading();
	}
	
	
}


onMounted(() => {
	console.log(props.historyData)
	const dom = refInitEcharts(historyLine.value,'green');
	window.addEventListener('resize', function () {
		dom.resize();
	});
	if (props.historyLoading){
		dom.showLoading();
	}
	watch(
		() => props.historyData,
		() => {
			if (!props.historyLoading) {
				refresh(dom)
			}
		},
		{deep:true}
	)
})
</script>

<style scoped>

</style>