<template>
	<div class="size-full p-4" ref="historyLine">
		<!-- 加载指示器 -->
		<div v-if="loading" class="loading-indicator">
			Loading...
		</div>
	</div>
</template>

<script setup lang="js">
import { onMounted, ref, watch } from "vue";
import { refInitEcharts } from "@/utils/eharts-init.js";
import { lineOptionTemplate } from "@/assets/echarts-template/line-chart.js";

const {historyData, xAxisData} = defineProps({
	historyData: Array,
	xAxisData: Array,
});

const historyLine = ref(null);
const loading = ref(false);


/**
 * 图表的数据刷新
 * @param {echartDom} dom ： Echarts声明的Dom
 */
const refresh = (dom) => {
	if (historyData.length > 0){
		let option = JSON.parse(JSON.stringify(lineOptionTemplate));
		option.title.text = '历史图表'
		option.color = ["#db2777", "#3F51B5",];
		try {
			option.xAxis.data = xAxisData;
			let singleHistoryOption = JSON.parse(localStorage.getItem("single_history_option"));
			let multiHistoryOption = JSON.parse(localStorage.getItem("multi_history_option"));
			//把是所有历史数据结构组合在一起，用于将英文变量翻译为汉字
			let dataList = [
				...singleHistoryOption.flatMap(option => option.children),
				...multiHistoryOption.flatMap(option => option.children)
			];
			
			const result = dataList.reduce((acc, item) => {
				acc[item.value] = item.label;
				return acc;
			}, {});
			for (let i = 0; i < historyData[1].length; i++) {
				option.series.push({
					data: historyData[1][i],
					name: result[historyData[0][0][i]],
					type: 'line',
					symbol: 'none', // 隐藏数据点
				});
			}
			dom.setOption(option);
		} catch (e) {
			console.error(e);
		}
	}
}

onMounted(() => {
	const dom = refInitEcharts(historyLine.value);
	window.addEventListener('resize', function () {
		dom.resize();
	});
	refresh(dom);
});
</script>

<style scoped>
.loading-indicator {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 1.5rem;
	color: #fff; /* 可根据需求修改颜色 */
}
</style>
