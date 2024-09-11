<template>
	<div ref="fluxDom" class="size-full p-4">
	
	</div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {fluxOption} from "@/assets/echarts-template/flux-chart.js";
import {refInitEcharts} from "@/utils/eharts-init.js";


const props = defineProps({
	fluxData: Object,
})

const fluxDom = ref(null)
let option = JSON.parse(JSON.stringify(fluxOption));;


const refresh = (dom, ec, ew, timeRangeList) => {
	option.series[0].data = ec;
	option.series[1].data = ew;
	option.xAxis.data = timeRangeList;
	dom.setOption(option);
	dom.hideLoading();
}

onMounted(() => {
	const dom = refInitEcharts(fluxDom.value, 'dark-bold');
	window.addEventListener('resize', function () {
		dom.resize();
	});
	
	dom.showLoading();
	if (props.fluxData) {
		refresh(dom, props.fluxData.ec, props.fluxData.ew, props.fluxData.time);
	}
	
	watch(
		() => props.fluxData,
		() => {
			if (props.fluxData) {
				refresh(dom, props.fluxData.ec, props.fluxData.ew, props.fluxData.time);
			}
		},
		{deep: true}
	)
})
</script>

<style scoped>

</style>