<template>
	<div class="size-full p-4" ref="aveLine">
	
	</div>
</template>

<script setup>
import {refInitEcharts} from "@/utils/eharts-init.js";
import {lineOptionTemplate} from "@/assets/echarts-template/line-chart.js";
import {computed, onMounted, ref, watch} from "vue";

const { aveData, xAxis, type } = defineProps({
	aveData: Array,
	xAxis: Array,
	type: Number,
})

const aveLine = ref(null);
let option = JSON.parse(JSON.stringify(lineOptionTemplate));
option.color = ["#db2777", "#3F51B5",];
const seriesNameList = [
	'X',
	'箱内温度',
	'箱内湿度',
	'箱外温度',
	'箱外湿度',
	'二氧化碳',
	'饱和水气压',
	'箱外饱和水气压',
	'水分绝对浓度',
	'VPD',
	'VPD-out',
	'二氧化碳_K值',
	'二氧化碳_R²',
	'水分绝对浓度_K值',
	'水分绝对浓度_R²'
]

const backUpNameList = ['平均箱内温度','平均箱内湿度'];

const indexNameList = computed(() => {
	if (type === 0){
		return backUpNameList;
	} else {
		return seriesNameList;
	}
})

const refresh = (dom, option) => {
	let seriesList = []
	for (let i = 0; i < aveData.length; i++) {
		seriesList.push({
			data: aveData[i],
			name: indexNameList.value[i],
			type: 'line',
			smooth: false,  //曲线平滑
			// symbol: 'none', // 隐藏数据点
			// areaStyle: {}, //面积图
		})
	}
	option.xAxis.data = xAxis;
	console.log(aveData)
	option.series = seriesList
	dom.setOption(option);
	dom.hideLoading();
}

onMounted(() => {
	const dom = refInitEcharts(aveLine.value);
	window.addEventListener('resize', function () {
		dom.resize();
	});
	
	// dom.showLoading();
	if (aveData) {
		refresh(dom, option);
	}
	
	watch(
		() => aveData,
		() => {
			if (aveData) {
				refresh(dom, option, aveData)
			}
		},
		{deep: true}
	)
})
</script>

<style scoped>

</style>