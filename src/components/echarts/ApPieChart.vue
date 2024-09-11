<template>
	<div class="size-full p-4" ref="apPie">
	
	</div>
</template>

<script setup>
import {refInitEcharts} from "@/utils/eharts-init.js";
import {onMounted, ref, watch} from "vue";
import {pieOptionTemplate} from "@/assets/echarts-template/pie-chart.js";

const props = defineProps({
	apData: Array,
})

const apPie = ref(null);
let option = JSON.parse(JSON.stringify(pieOptionTemplate));;

const refresh = (dom, option) => {
	option.series[0].data = [{ value: props.apData[0], name: '进气气压' }, { value: props.apData[1], name: '出气气压' }]
	dom.setOption(option);
	// dom.hideLoading();
}

onMounted(() => {
	const dom = refInitEcharts(apPie.value, 'green');
	window.addEventListener('resize', function () {
		dom.resize();
	});
	
	// dom.showLoading();
	if (props.apData) {
		refresh(dom, option);
	}
	
	watch(
		() => props.apData,
		() => {
			if (props.apData) {
				refresh(dom, option, props.apData)
			}
		},
		{deep: true}
	)
})
</script>

<style scoped>

</style>