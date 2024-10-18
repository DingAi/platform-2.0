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

const props = defineProps({
	historyData: Array,
	xAxisData: Array,
	historyLoading: Boolean
});

const historyLine = ref(null);
const loading = ref(false);

const refresh = (dom) => {
	if (props.historyData.length > 0){
		let option = JSON.parse(JSON.stringify(lineOptionTemplate));
		try {
			option.xAxis.data = props.xAxisData;
			let data = JSON.parse(localStorage.getItem("sensorData"));
			let dataList = [...data[0].children, ...data[1].children];
			const result = dataList.reduce((acc, item) => {
				acc[item.value] = item.label;
				return acc;
			}, {});
			for (let i = 0; i < props.historyData[1].length; i++) {
				option.series.push({
					data: props.historyData[1][i],
					name: result[props.historyData[0][0][i]],
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
	const dom = refInitEcharts(historyLine.value, 'new-blue');
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
