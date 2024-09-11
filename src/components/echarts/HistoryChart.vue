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
	historyLoading: Boolean
})

const historyLine = ref(null);
let option = JSON.parse(JSON.stringify(lineOptionTemplate));
// option.dataZoom = [
// 	{
// 		show: true,
// 		start: 0,
// 		end: 100,
// 	},
// 	{
// 		type: 'inside',
// 		start: 0,
// 		end: 100,
// 	}
// ]


const refresh = (dom, option) => {
	// option = setOptionXAxis(option, props.aveData[5]);
	for(let i = 0; i < props.historyData.length; i++) {
		option.series.push({
			data: props.historyData[1][i],
			name: props.historyData[0][i],
			type: 'line',
		})
		// option = addSeriesData(props.historyData[1][i], props.historyData[0][i], option, 'line');
	}
	console.log(option)
	dom.setOption(option);
	// dom.hideLoading();
	// option.series = [];
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
	
	if (props.historyData) {
		// refresh(dom,option);
	}
	
	watch(
		() => props.historyData,
		() => {
			if (props.historyData) {
				refresh(dom, option)
			}
		},
		{deep:true}
	)
})
</script>

<style scoped>

</style>