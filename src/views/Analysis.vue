<template>
	<div class="space-y-4 text-center size-full">
		<div
			class="flex md:flex-row flex-col justify-between items-center bg-gray-900 pt-2 pb-2 h-24 rounded space-x-2">
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
		
		<div class="flex items-center p-4 rounded h-h" v-if="!isFileLoading1">
			<p class="text-5xl text-green-500 font-bold m-auto">【选择数据范围或传入文件后加载数据】</p>
		</div>
		<div class="flex w-full analysis-div space-x-4" v-else>
			<div class="w-1/3 bg-slate-800 rounded p-4 overflow-auto h-h">
				<el-timeline v-if="isFileLoading1">
					<el-timeline-item center
					                  v-for="(item) in matParsedData"
					                  :timestamp="item.Time"
					                  placement="top">
						<el-card>
							<div class="space-x-4">
								<el-tag>CK {{ item.CO2_K.toFixed(2) }}</el-tag>
								<el-tag type="info">CR {{ item.CO2_RS.toFixed(2) }}</el-tag>
								<el-tag>HK {{ item.H2O_K.toFixed(2) }}</el-tag>
								<el-tag type="info">HR {{ item.H2O_RS.toFixed(2) }}</el-tag>
							</div>
						</el-card>
					</el-timeline-item>
				</el-timeline>
			</div>
			<div class="w-3/4 h-full flex flex-col items-center space-y-4">
				<div class="w-full h-1/2 bg-slate-800 rounded">
					<AveDataChart :aveData="aveDataList"/>
				</div>
				<div class="w-full h-1/2 bg-slate-800 rounded">
					<FluxHistoryChart :flux-data="fluxList"/>
				</div>
			</div>
		
		</div>
		<div
			class="flex md:flex-row flex-col justify-between items-center bg-slate-800 pt-2 pb-2 h-28 rounded space-x-2">
			<div class="flex items-center justify-center h-full w-1/4 rounded-tl rounded-bl pl-20 pr-20">
				<file-upload @fileParsed="handleFileParsed">上传数据分析文件</file-upload>
			</div>
			<div class="flex flex-col items-center justify-center h-full w-1/4 rounded-tl rounded-bl pl-10 pr-10 space-y-4">
				<span class="font-semibold text-gray-100">箱体体积（V）</span>
				<!--				<span class="text-2xl font-bold text-green-500 mt-2">1</span>-->
				<el-input-number v-model="boxVolume" :step="0.1"/>
			</div>
			<div class="flex flex-col items-center justify-center h-full w-1/4 rounded-tl rounded-bl pl-10 pr-10 space-y-4">
				<span class="font-semibold text-gray-100">底面积（S）</span>
				<!--				<span class="text-2xl font-bold text-green-500 mt-2">0.5</span>-->
				<el-input-number v-model="boxArea" :step="0.1"/>
			</div>
			<div class="flex flex-col items-center justify-center h-full w-1/4 rounded-tl rounded-bl pl-10 pr-10">
				<submit-button>重新加载图像</submit-button>
			</div>
		</div>
		<div class="flex md:flex-row flex-col justify-between items-center bg-slate-800 pt-2 pb-2 h-28 rounded space-x-2">
			<div class="flex flex-col items-center justify-center h-full w-1/4 rounded-tl rounded-bl pl-10 pr-10">
				<file-upload @fileParsed="handleHistoryFileParsed">上传历史文件</file-upload>
			</div>
		</div>
		<div class="flex md:flex-row flex-col justify-center items-center bg-slate-800 p-10 rounded"
		     v-if="isFileLoading2">
			<el-transfer
				v-model="selectHistoryKeyList"
				:data="historyKeyList"
				filterable
				:titles="['备份的数据', '要处理的数据']"
			/>
		</div>
		<div class="flex items-center p-4 rounded h-96" v-if="!isFileLoading2">
			<p class="text-5xl text-green-500 font-bold m-auto">【传入备份的本地文件后加载数据】</p>
		</div>
	</div>
</template>

<script setup>
import {computed, ref} from 'vue';
import FluxHistoryChart from "@/components/echarts/FluxChart.vue";
import AveDataChart from "@/components/echarts/AveDataLineChart.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import FileUpload from "@/components/FileUpload.vue";
import TimeDatePicker from "@/components/ElementTimeDatePicker.vue";
import MultiSelect from "@/components/ElementMultiSelect.vue";
import {getTimeRange, selectProcessData} from "@/utils/tools-functions.js";
import {values} from "lodash";
import {useAuthStore} from "@/stores/userStore.js";
import {storeToRefs} from "pinia";
import {postHistory} from "@/server/request-apis.js";

const authStore = useAuthStore();
const {SCGData} = storeToRefs(authStore);

//从数据库查询数据范围的变量
const selectedValues = ref([]);
const timeRange = ref(["2024-09-06 09:00:00", "2024-09-06 11:00:00"])
// const timeRange = ref(getTimeRange(6))
const selectedValues1 = ref([]);
const selectedValues2 = ref([]);
const historyData = ref([]);
const historyLoading = ref(false);
const tempChartRef = ref(null);

// 用于存储解析后的数据
const parsedData = ref(null);
const historyParsedData = ref(null);
const matParsedData = ref([]);
const historyMatParsedData = ref([]);
const isFileLoading1 = ref(false);
const isFileLoading2 = ref(false);
const fluxList = ref([])
const aveDataList = ref([])
const boxVolume = ref(1)
const boxArea = ref(0.5)
const historyKeyList = ref([])
const selectHistoryKeyList = ref([])
const localTimeRangeList = ref([])
const equipmentOption = ref([]);

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

// 定义级联选择器的属性
const cascaderProps = {
	multiple: true,
	value: 'value', // 选项的值字段
	label: 'label', // 选项的标签字段
	children: 'children' // 子级字段
}
//获取历史数据
const getHistoryData = async () => {
	let typeData = selectProcessData(selectedValues2.value)
	const res = await postHistory(selectedValues1.value[0], typeData.categories, typeData.entries, timeRange.value)
	historyData.value = res.data.history_data
	console.log(res.data)
}

// 处理传递过来的数据分析数据
const handleFileParsed = (data) => {
	for (let i = 0; i < Object.values(data)[0].length; i++) {
		const entry = {};
		for (const key in data) {
			entry[key] = data[key][i];
		}
		matParsedData.value.push(entry);
	}
	aveDataList.value = [
		data.Ave_exHumidity,
		data.Ave_exTemperature,
		data.Ave_inBox_CO2,
		data.Ave_inHumidity,
		data.Ave_inTemperature
	];
	fluxList.value = {ec: data.CO2_flux, ew: data.H2O_flux, time: data.Time}
	// timeArrayProcessing(data.Time)
	console.log('从子组件接收到的数据:', data.value);
	console.log('matParsedData:', data.value);
	isFileLoading1.value = true;
};

// 处理传递过来的历史数据
const handleHistoryFileParsed = (data) => {
	historyParsedData.value = data;
	let objectList = Object.keys(data)
	for (let item of objectList) {
		historyKeyList.value.push(
			{
				key: item,
				label: item,
				disabled: false
			}
		)
	}
	console.log(historyKeyList.value)
	console.log(historyParsedData.value)
	isFileLoading2.value = true;
};

// function timeArrayProcessing(jsonData){
// 	const timeList = values[jsonData.length - 1];
// 	console.log(timeList)
// 	for(let item of timeList){
// 		localTimeRangeList.value.push(item.split(' - '));
// 	}
// 	console.log(localTimeRangeList.value)
// }

function localHistoryProcessing() {
	if (localTimeRangeList.value.length > 0 && historyParsedData.value.length > 0 && selectedValues.value.length > 0) {
	
	}
}

</script>

<style scoped>

.analysis-div {
	height: calc(100vh - 370px);
}

.h-h {
	height: calc(100vh - 370px);
}

.transfer-h {
	height: 40rem;
}
</style>
