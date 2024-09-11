<template>
	<div class="space-y-4 text-center size-full">
		<div class="flex md:flex-row flex-col justify-between items-center bg-slate-900 pt-2 pb-2 h-24 rounded space-x-2">
			<div class="flex items-center justify-center h-full w-1/4 rounded-tl rounded-bl pl-10 pr-2">
				<el-cascader
					v-model="selectedValues1"
					:options="snOption"
					collapse-tags
					collapse-tags-tooltip
					placeholder="请选择"
					class="w-full"
				/>
			</div>
			<div class="flex items-center justify-center h-full w-1/4 rounded-tl rounded-bl pl-6 pr-2">
				<el-cascader
					v-model="selectedValues2"
					:options="equipmentOption"
					collapse-tags
					collapse-tags-tooltip
					:props="cascaderProps"
					placeholder="请选择"
					class="w-full"
				/>
			</div>
			<div class="flex items-center justify-center h-full w-2/5 rounded-tl rounded-bl pl-6 pr-2">
				<TimeDatePicker v-model="timeRange"/>
			</div>
			<div class="flex items-center justify-center h-full w-1/5 rounded-tl rounded-bl p-4">
				<el-button type="primary" @click="getHistoryData">获取历史数据
				</el-button>
			</div>
		</div>
		<div class=" bg-slate-800 p-2 w-full history-chart rounded">
			<HistoryChart :history-data="historyData" :history-loading="historyLoading"/>
		</div>
	</div>
</template>

<script setup>
import {getTimeRange, selectProcessData} from '@/utils/tools-functions.js'
import {computed, onMounted, ref} from "vue";
import TimeDatePicker from "@/components/ElementTimeDatePicker.vue";
import {lineOptionTemplate} from "@/assets/echarts-template/line-chart.js";
import {refInitEcharts, setChartType, setOptionXAxis, setSeriesData} from "@/utils/eharts-init.js";
import {useAuthStore} from "@/stores/userStore.js";
import {storeToRefs} from "pinia";
import {getEquipmentVarArray, postHistory} from "@/server/request-apis.js";
import HistoryChart from "@/components/echarts/HistoryChart.vue";

const authStore = useAuthStore();
const {SCGData} = storeToRefs(authStore);

const timeRange = ref(["2024-09-06 09:00:00", "2024-09-06 11:00:00"])
// const timeRange = ref(getTimeRange(6))
const selectedValues1 = ref([]);
const selectedValues2 = ref([]);
const historyData = ref([]);
const historyLoading = ref(false);
const tempChartRef = ref(null);


const snOption = computed(() => {
	let option = []
	console.log(SCGData)
	for (let i = 0; i < SCGData.value[0].length; i++) {
		option.push({
			value: SCGData.value[0][i],
			label: SCGData.value[1][i]
		})
	}
	return option
});

let option = lineOptionTemplate;


const equipmentOption = ref([]);

const getHistoryData = async () => {
	let typeData = selectProcessData(selectedValues2.value)
	const res = await postHistory(selectedValues1.value[0], typeData.categories, typeData.entries, timeRange.value)
	historyData.value = res.data.history_data
	console.log(res.data)
}

const getHistoryVarList = async () => {
	const res = await getEquipmentVarArray()
	equipmentOption.value = res.data.data
}

onMounted(() => {
	getHistoryVarList();
})

// 定义级联选择器的属性
const cascaderProps = {
	multiple: true,
	value: 'value', // 选项的值字段
	label: 'label', // 选项的标签字段
	children: 'children' // 子级字段
}
</script>

<style scoped lang="less">
.history-chart {
	height: 43rem;
	height: calc(100vh - 370px);
}

</style>