<template>
	<div class="size-full p-4" ref="aveLine">
	
	</div>
</template>

<script setup>
import {refInitEcharts} from "@/utils/eharts-init.js";
import {lineOptionTemplate} from "@/assets/echarts-template/line-chart.js";
import {onMounted, ref, watch} from "vue";

const props = defineProps({
	aveData: Array,
})

const aveLine = ref(null);
let option = JSON.parse(JSON.stringify(lineOptionTemplate));
const seriesNameList = ['箱内温度', '箱内湿度', '箱外温度', '箱外湿度', '二氧化碳', '饱和水气压', '箱外饱和水气压', '水分绝对浓度', 'VPD', 'VPD-out',]

const refresh = (dom, option) => {
	let seriesList = []
	for (let i = 0; i < props.aveData.length - 1; i++) {
		seriesList.push({
			data: props.aveData[i],
			name: seriesNameList[i],
			type: 'line',
			smooth: false,  //曲线平滑
			symbol: 'none', // 隐藏数据点
			// areaStyle: {}, //面积图
		})
	}
	option.xAxis.data = props.aveData[props.aveData.length -1];
	option.series = seriesList
	dom.setOption(option);
	dom.hideLoading();
}

onMounted(() => {
	const dom = refInitEcharts(aveLine.value, 'dark-bold');
	window.addEventListener('resize', function () {
		dom.resize();
	});
	
	// dom.showLoading();
	if (props.aveData) {
		refresh(dom, option);
	}
	
	watch(
		() => props.aveData,
		() => {
			if (props.aveData) {
				refresh(dom, option, props.aveData)
			}
		},
		{deep: true}
	)
})
</script>

<style scoped>

</style>