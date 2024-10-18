<template>
	<div class="space-y-4 text-center size-full">
		<div class="flex flex-col md:flex-row justify-between items-stretch bg-[#f5f5f5] rounded-2xl py-2 space-y-4 md:space-y-0 md:space-x-2 inner-shadow">
			
			<!-- SN 选择器 -->
			<div class="flex items-center justify-center w-full md:w-1/4 rounded-xl px-4 mt-6 sm:mt-0">
				<el-cascader
					v-model="selectedValues1"
					:options="snOption"
					collapse-tags
					collapse-tags-tooltip
					placeholder="请选择"
					class="w-full"
				/>
			</div>
			
			<!-- 设备选择器 -->
			<div class="flex items-center justify-center w-full md:w-1/4 rounded-xl px-4">
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
			
			<!-- 时间选择器 -->
			<div class="flex items-center justify-center w-full md:w-2/5 rounded-xl px-4">
				<TimeDatePicker v-model="timeRange"/>
			</div>
			
			<!-- 获取历史数据按钮 -->
			<div class="flex items-center justify-center w-full md:w-1/5 rounded-xl p-4">
				<el-button type="primary" @click="getHistoryData" class="w-full" round>获取历史数据</el-button>
			</div>
		</div>
		
		<!-- 历史图表 -->
		<div class="p-2 w-full history-chart rounded-2xl inner-shadow">
			<div v-if="historyLoading" class="flex flex-col justify-center items-center py-4 space-y-4 h-full">
				<DataLoading/>
			</div>
			<HistoryChart v-else :historyData="historyData" :xAxisData="xAxisData" :historyLoading="historyLoading"/>
		</div>
	</div>
</template>

<script setup>
import {getTimeRange, selectProcessData} from '@/utils/tools-functions.js'
import {computed, onMounted, ref} from "vue";
import TimeDatePicker from "@/components/ElementTimeDatePicker.vue";
import {useAuthStore} from "@/stores/userStore.js";
import {storeToRefs} from "pinia";
import {postHistoryData} from "@/server/request-apis.js";
import HistoryChart from "@/components/echarts/HistoryChart.vue";
import DataLoading from "@/components/DataLoading.vue";

const authStore = useAuthStore();
const {SCGData} = storeToRefs(authStore);

// const timeRange = ref(["2024-09-29 18:00:00", "2024-09-30 11:00:00"])
const timeRange = ref(getTimeRange(3))
const selectedValues1 = ref(["AE0XAOJY18G2409000003"]);
const selectedValues2 = ref([["sensors", "co2_conc_during_meas"],["sensors", "co2_concentration"]]);
const selectedLabels = ref([])
const historyData = ref([]);
const historyLoading = ref(false);
const xAxisData = ref([]);


const snOption = computed(() => {
	let option = []
	for (let i = 0; i < SCGData.value[0].length; i++) {
		option.push({
			value: SCGData.value[0][i],
			label: SCGData.value[1][i]
		})
	}
	return option
});

const equipmentOption = ref(JSON.parse(localStorage.getItem("sensorData")));

//获取历史数据
const getHistoryData = async () => {
	historyLoading.value = true;
	console.log(selectedValues2.value)
	try {
		let typeData = selectProcessData(selectedValues2.value)
		const res = await postHistoryData(selectedValues1.value[0], typeData.categories, typeData.entries, timeRange.value)
		historyData.value = res.data.history_data;
		xAxisData.value = res.data.timest;
	} catch (e){
		console.log(e);
	} finally {
		historyLoading.value = false;
	}
}

// 定义级联选择器的属性
const cascaderProps = {
	multiple: true,
	value: 'value', // 选项的值字段
	label: 'label', // 选项的标签字段
	children: 'children' // 子级字段
}

onMounted(()=>{
	getHistoryData();
})
</script>

<style scoped lang="less">
.history-chart {
	height: 43rem;
	height: calc(100vh - 370px);
}

</style>
