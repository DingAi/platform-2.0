<template>
	<div class="space-y-4 text-center size-full">
		<div class="flex flex-col md:flex-row justify-between items-center bg-[#2f2f2f] pt-2 pb-2 h-24 rounded space-x-2">
			<div class="flex items-center justify-center h-full w-full md:w-1/4 rounded-tl rounded-bl pl-10 pr-2">
				<el-cascader
					v-model="selectedValues1"
					:options="snOption"
					collapse-tags
					collapse-tags-tooltip
					placeholder="请选择"
					class="w-full"
				/>
			</div>
			<div class="flex items-center justify-center h-full w-full md:w-1/4 rounded-tl rounded-bl pl-6 pr-2">
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
			<div class="flex items-center justify-center h-full w-full md:w-2/5 rounded-tl rounded-bl pl-6 pr-2">
				<TimeDatePicker v-model="timeRange"/>
			</div>
			<div class="flex items-center justify-center h-full w-full md:w-1/5 rounded-tl rounded-bl p-4">
				<el-button type="primary" @click="getHistoryData" class="w-full">获取历史数据</el-button>
			</div>
		</div>
		<div class="p-2 w-full history-chart rounded">
			<HistoryChart :historyData="historyData" :xAxisData="xAxisData" :historyLoading="historyLoading"/>
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

const authStore = useAuthStore();
const {SCGData} = storeToRefs(authStore);

const timeRange = ref(["2024-09-23 18:00:00", "2024-09-24 11:00:00"])
// const timeRange = ref(getTimeRange(6))
const selectedValues1 = ref([]);
const selectedValues2 = ref([]);
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
	try {
		let typeData = selectProcessData(selectedValues2.value)
		const res = await postHistoryData(selectedValues1.value[0], typeData.categories, typeData.entries, timeRange.value)
		historyData.value = res.data.history_data;
		xAxisData.value = res.data.timest;
		console.log('历史数据：', res.data)
	} catch (e){
		console.log(e);
	} finally {
		historyLoading.value = false;
	}
}

onMounted(() => {

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

/* Mobile Styles */
@media (max-width: 767px) {
	.history-chart {
		height: 28rem; /* 调整移动端的图表高度 */
	}
	
	.flex {
		flex-direction: column; /* 移动端垂直排列元素 */
	}
	
	.h-24 {
		height: auto; /* 自适应高度 */
		padding: 1rem; /* 添加内边距 */
	}
	
	.pl-10, .pl-6, .pr-2 {
		padding-left: 1rem; /* 移动端统一左右内边距 */
		padding-right: 1rem;
	}
	
	.rounded {
		border-radius: 0.375rem; /* 标准化圆角 */
	}
	
	.space-x-2 {
		margin-bottom: 1rem; /* 移动端元素之间的垂直间距 */
	}
	
	.text-center {
		text-align: center; /* 移动端居中显示文本 */
	}
	
	.w-full {
		width: 100%; /* 移动端元素占满宽度 */
	}
	
	.el-button {
		padding-left: 1.5rem; /* 提高按钮的点击区域 */
		padding-right: 1.5rem;
	}
}

</style>
