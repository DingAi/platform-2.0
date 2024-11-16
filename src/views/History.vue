<template>
	<div class="space-y-4 text-center size-full">
		<div class="flex flex-col md:flex-row justify-between items-stretch bg-theme-1-color-6 rounded-2xl py-2 space-y-4
		md:space-y-0 md:space-x-2 inner-shadow smiley-sans">
			
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
			<div class="flex items-center justify-center w-full md:w-1/4 rounded-xl px-4" v-if="isMultiChannel">
				<el-cascader
					v-model="selectedValues2"
					:options="multiDeviceOption"
					collapse-tags
					collapse-tags-tooltip
					:props="cascaderProps"
					placeholder="请选择"
					class="w-full"
				/>
			</div>
			
			<div class="flex items-center justify-center w-full md:w-1/4 rounded-xl px-4" v-else>
				<el-cascader
					v-model="selectedValues2"
					:options="singleDeviceOption"
					collapse-tags
					collapse-tags-tooltip
					:props="cascaderProps"
					placeholder="请选择"
					class="w-full"
				/>
			</div>
			
			<!-- 时间选择器 -->
			<div class="flex items-center justify-center w-auto md:w-1/4 rounded-xl px-4">
				<TimeDatePicker v-model="timeRange"/>
			</div>
			
			<!-- 获取历史数据按钮 -->
			<div class="flex flex-col items-center justify-center md:flex-row w-full md:w-1/5 rounded-xl ">
				<div class="p-2 w-full md:1/2">
					<el-button type="primary" @click="getHistoryData" round >加载数据</el-button>
				</div>
				<div class="p-2 w-full md:1/2">
					<el-tooltip content="提醒:历史大数据下载建议使用数据下载界面" placement="bottom" effect="customized">
						<el-button v-if="!historyLoading" type="primary" @click="historyDataDownload" plain round>数据下载</el-button>
					</el-tooltip>
				</div>
			</div>
		</div>
		
		<!-- 历史图表 -->
		<div class="p-2 w-full history-chart bg-theme-1-color-6 rounded-2xl inner-shadow">
			<div v-if="historyLoading" class="flex flex-col justify-center items-center py-4 space-y-4 h-full">
				<DataLoading/>
			</div>
			<HistoryChart v-else :historyData="historyData" :xAxisData="xAxisData" :historyLoading="historyLoading"/>
		</div>
	</div>
</template>

<script setup>
import {getTimeRange, selectProcessData, showMessage} from '@/utils/tools-functions.js'
import {computed, onMounted, ref} from "vue";
import TimeDatePicker from "@/components/ElementTimeDatePicker.vue";
import {useAuthStore} from "@/stores/userStore.js";
import {storeToRefs} from "pinia";
import {postHistoryData, postHistoryDataDownload} from "@/server/request-apis.js";
import HistoryChart from "@/components/echarts/HistoryChart.vue";
import DataLoading from "@/components/DataLoading.vue";

const authStore = useAuthStore();
const {SCGData} = storeToRefs(authStore);

// const timeRange = ref(["2024-09-29 18:00:00", "2024-09-30 11:00:00"])

// 时间日期选择器绑定的值
const timeRange = ref(getTimeRange(3))

// 第一个选择器绑定的值（SN码）
const selectedValues1 = ref(["AE0XAOJY18G2409000003"]);

// 第二个选择器绑定的值
const selectedValues2 = ref([["sensors", "co2_conc_during_meas"],["sensors", "co2_concentration"]]);

// 判断第一个选择器选择的值是不是多通道设备
const isMultiChannel = computed(() =>{
	return selectedValues1.value[0].charAt(0) === 'B';
})

// 存储接收到的历史数据
const historyData = ref([]);

// 历史数据的加载状态
const historyLoading = ref(false);

// 存储X轴的数据
const xAxisData = ref([]);

//第一个选择器的Elemnet Plus Option属性
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

// 单通道数据的option
const singleDeviceOption = ref(JSON.parse(localStorage.getItem("single_history_option")));

// 多通道数据的option
const multiDeviceOption = ref(JSON.parse(localStorage.getItem("multi_history_option")));

/**
 * 获取历史数据
 */
const getHistoryData = async () => {
	historyLoading.value = true;
	try {
		let result = selectProcessData(selectedValues2.value)
		const res = await postHistoryData(selectedValues1.value[0], result.typeDataList, result.varDataList, timeRange.value)
		historyData.value = res.data.history_data;
		xAxisData.value = res.data.timest;
	} catch (e){
		console.log(e);
		showMessage('获取历史数据错误');
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

/**
 * 历史数据下载：
 * 收到接口返回的MinIO的URL然后下载
 */
const historyDataDownload = async () => {
	try {
		let result = selectProcessData(selectedValues2.value)
		const res = await postHistoryDataDownload(selectedValues1.value[0], result.typeDataList, result.varDataList, timeRange.value);
		// 创建一个 Blob URL
		const url = res.data.url;
		
		// 创建一个链接元素
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'history_data.xlsx'); // 指定下载的文件名
		
		// 添加链接到 DOM
		document.body.appendChild(link);
		link.click(); // 模拟点击下载
		link.parentNode.removeChild(link); // 下载后移除链接
	} catch (e){
		console.log(e);
		showMessage('下载错误');
	} finally {
		historyLoading.value = false;
	}
	
}

onMounted(()=>{
	// 加载界面的时候根据缺省值先生成一下图表数据
	getHistoryData();
})
</script>

<style scoped lang="less">
.history-chart {
	height: 43rem;
	height: calc(100vh - 370px);
}

</style>
