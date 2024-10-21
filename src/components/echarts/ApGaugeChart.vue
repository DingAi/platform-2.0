<script setup>
import {setGaugeData} from "@/assets/echarts-template/gauges-chart.js";
import {onMounted, ref, watch} from "vue";
import {refInitEcharts} from "@/utils/eharts-init.js";

const props = defineProps({
	apData: Array,
})

const apGauge = ref(null)

const refresh = (dom) => {
	let option = setGaugeData(
		Number((props.apData[0] / 1000).toPrecision(3)),
		Number((props.apData[1] / 1000).toPrecision(3)),
		'进气气压',
		'出气气压'
	);
	option.color = ["#db2777", "#3F51B5",];
	dom.setOption(option)
}

onMounted(() => {
	let dom = refInitEcharts(apGauge.value);
	window.addEventListener('resize', function () {
		dom.resize();
	});
	
	
	watch(
		() => props.apData,
		() => {
			refresh(dom);
		}
	)
})

</script>

<template>
	<div class="size-full" ref="apGauge"></div>
</template>

<style scoped>

</style>