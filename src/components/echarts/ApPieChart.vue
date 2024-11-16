<!--气压饼图-->
<template>
	<div class="size-full p-4" ref="apPie">
	
	</div>
</template>

<script setup>
import {refInitEcharts} from "@/utils/eharts-init.js";
import {onMounted, ref, watch} from "vue";
import {pieOptionTemplate} from "@/assets/echarts-template/pie-chart.js";

const { apData } = defineProps({
	apData: Array,
})

const apPie = ref(null);
let option = JSON.parse(JSON.stringify(pieOptionTemplate));

/**
 * 图表的数据刷新
 * @param {echartDom} dom ： Echarts声明的Dom
 * @param {echartOption} option ： Echarts图表格式配置
 */
const refresh = (dom, option) => {
	option.series[0].data = [
		{ value: Math.floor(apData[0]/1000), name: '进气气压' },
		{ value: Math.floor(apData[1]/1000), name: '出气气压' }
	]
	dom.setOption(option);
}

onMounted(() => {
	const dom = refInitEcharts(apPie.value, 'new-blue');
	window.addEventListener('resize', function () {
		dom.resize();
	});
	
	// dom.showLoading();
	if (apData) {
		refresh(dom, option);
	}
	
	watch(
		() => apData,
		() => {
			if (apData) {
				refresh(dom, option, apData)
			}
		},
		{deep: true}
	)
})
</script>

<style scoped>

</style>