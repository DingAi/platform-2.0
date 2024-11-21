<template>
	<div class="size-full">
		<div class="flex flex-col rounded w-full h-rem-30 md:h-full">
			<div class="flex flex-col w-full h-96 md:h-1/5 md:flex-row ">
				<div class="flex flex-col items-center justify-center w-full md:w-1/3 rounded-xl px-4 h-full">
					<!--						<p class="w-full text-left p-2 pb-3">选择数据：</p>-->
					<el-cascader
						:v-model="selectedValue"
						:options="selectOption"
						collapse-tags
						collapse-tags-tooltip
						:props="cascaderProps"
						placeholder="请选择"
						class="w-full"
					/>
				</div>
				<div class="flex flex-col items-center justify-center w-auto md:w-1/3 rounded-xl px-4 h-full">
					<!--						<p class="w-full text-left p-2">选择时间范围：</p>-->
					<TimeDatePicker :v-model="timeRange"/>
				</div>
				<div class="flex flex-col items-center justify-center md:flex-row w-full md:w-1/3 rounded-xl p-4">
					<div class="w-full p-2">
						<el-button class="w-full" type="primary" @click="getHistoryData" round>加载数据</el-button>
					</div>
					<div class="w-full p-2">
						<el-tooltip content="提醒:历史大数据下载建议使用数据下载界面"
						            placement="bottom"
						            effect="customized">
							<el-button class="w-full"
							           v-if="!historyLoading"
							           type="primary"
							           @click="historyDataDownload"
							           plain
							           round>数据下载
							</el-button>
						</el-tooltip>
					</div>
				</div>
			</div>
			<el-divider></el-divider>
			<div class="p-2 min-w-full h-96 md:h-4/5 bg-theme-1-color-6 ">
				<div v-if="historyLoading" class="flex flex-col justify-center items-center py-4 space-y-4 h-full">
					<DataLoading/>
				</div>
				<HistoryChart v-else :historyData="historyData" :xAxisData="xAxisData"/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {cascaderProps} from "@/utils/preset-data";
import DataLoading from "@/components/DataLoading.vue";
import HistoryChart from "@/components/echarts/HistoryChart.vue";
import TimeDatePicker from "@/components/ElementTimeDatePicker.vue";
import {onMounted, ref} from "vue";
import {selectProcessData, showMessage} from "@/utils/tools-functions";
import {postHistoryData, postHistoryDataDownload} from "@/server/request-apis";

const {sn,selectedValue,selectOption, timeRange} = defineProps({
	sn: String,
	selectedValue: Array,
	selectOption: Array,
	timeRange: Array,
})


// 存储接收到的历史数据
const historyData = ref([]);

// 历史数据的加载状态
const historyLoading = ref(false);

// 存储X轴的数据
const xAxisData = ref([]);



/**
 * 获取历史数据
 */
const getHistoryData = async () => {
	historyLoading.value = true;
	try {
		let result = selectProcessData(selectedValue)
		const res = await postHistoryData(sn, result.typeDataList, result.varDataList, timeRange)
		historyData.value = res.data.history_data;
		xAxisData.value = res.data.timest;
	} catch (e) {
		console.log(e);
		showMessage('获取历史数据错误');
	} finally {
		historyLoading.value = false;
	}
}

/**
 * 历史数据下载：
 * 收到接口返回的MinIO的URL然后下载
 */
const historyDataDownload = async () => {
	try {
		let result = selectProcessData(selectedValue)
		const res = await postHistoryDataDownload(sn, result.typeDataList, result.varDataList, timeRange);
		// 创建一个 Blob URL
		const url = res.data.url;
		
		// 创建一个链接元素
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'history_data.xlsx'); // 指定下载的文件名
		
		// 添加链接到 DOM
		document.body.appendChild(link);
		link.click(); // 模拟点击下载
		link.removeChild(link); // 下载后移除链接
	} catch (e) {
		console.log(e);
		showMessage('下载错误');
	} finally {
		historyLoading.value = false;
	}
	
}

onMounted(() =>{
	getHistoryData()
})
</script>

<style scoped>

</style>