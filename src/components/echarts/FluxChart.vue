<template>
	<div ref="fluxDom" class="size-full p-4">
	
	</div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {fluxOption} from "@/assets/echarts-template/flux-chart.js";
import {refInitEcharts} from "@/utils/eharts-init.js";


const {fluxData} = defineProps({
	fluxData: Object,
})

const fluxDom = ref(null)
let option = JSON.parse(JSON.stringify(fluxOption));

/**
 * 图表的数据刷新
 * @param {echartDom} dom ： 开关触发后的状态值
 * @param {list} ec ： 碳通量
 * @param {list} ew ： 水通量
 * @param {list} timeRangeList ： X轴的时间数组
 */
const refresh = (dom, ec, ew, timeRangeList) => {
	option.series[0].data = ec;
	option.series[1].data = ew;
	option.xAxis.data = timeRangeList;
	dom.setOption(option);
	dom.hideLoading();
}

onMounted(() => {
	const dom = refInitEcharts(fluxDom.value);
	window.addEventListener('resize', function () {
		dom.resize();
	});
	
	dom.showLoading();
	if (fluxData) {
		refresh(dom, fluxData.ec, fluxData.ew, fluxData.time);
	}
	
	watch(
		() => fluxData,
		() => {
			if (fluxData) {
				refresh(dom, fluxData.ec, fluxData.ew, fluxData.time);
			}
		},
		{deep:true}
	)
})
</script>

<style scoped>

</style>