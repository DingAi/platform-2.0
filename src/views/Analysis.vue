<template>
	<div class="space-y-4 text-center w-full h-[1000px] md:h-full">
		<div class="flex flex-col md:flex-row justify-between items-center bg-theme-1-color-6 p-2 rounded-2xl inner-shadow smiley-sans">
			<div class="flex items-center justify-center w-full md:w-1/4 rounded-xl p-2 mt-6 sm:mt-0">
				<el-cascader
					v-model="selectedDeviceSnValues"
					:options="snOption"
					collapse-tags
					collapse-tags-tooltip
					placeholder="请选择"
					class="w-full"
				/>
			</div>
			<div class="flex items-center justify-center w-full md:w-1/4 rounded-xl p-2 mt-6 sm:mt-0" v-if="isMultiChannel">
				<el-cascader
					v-model="selectedValues2"
					:options="multiSubStationOption"
					collapse-tags
					collapse-tags-tooltip
					placeholder="请选择"
					class="w-full"
				/>
			</div>
			<!-- 时间选择器 -->
			<div class="flex items-center justify-center w-full md:w-1/4 rounded-xl p-2 mt-6 sm:mt-0">
				<TimeDatePicker v-model="timeRange"/>
			</div>
			<div class="flex items-center justify-center h-full w-full md:w-1/5 rounded-2xl p-2">
				<el-button type="primary" @click="singleAnalysisData" round>加载数据分析</el-button>
			</div>
		</div>
<!--		<div class="flex items-center p-4 rounded-2xl inner-shadow h-h" v-if="!isFileLoading1">-->
<!--			<p class="text-5xl text-[#757de8] font-bold m-auto">【选择数据范围或传入文件后加载数据】</p>-->
<!--		</div>-->
		<div class="flex flex-col md:flex-row w-full analysis-div space-x-0 md:space-x-4 overflow-auto">
			<div class="w-full md:w-1/3 h-auto min-h-[300px] sm:min-h-[420px] md:min-h-[400px] flex flex-col items-center
			space-y-4 overflow-auto p-6 smiley-sans">
				<el-timeline v-if="isFileLoading1">
					<el-timeline-item center v-for="(item, index) in matParsedData"
					                  :key="index"
					                  :timestamp="item[0] + ' - ' + item[1]"
					                  placement="top">
						<el-card>
							<div class="size-full space-y-4 p-2">
								<div class="w-full flex flex-row">
									<span class="text-gray-400 font-bold">
										Index：<span class="text-theme-1-color-4">{{ index + 1 }}</span>/{{matParsedData.length}}
									</span>
								</div>
								<div class="flex flex-row justify-between space-x-4 items-center px-4">
                                    <span class="badge open-color-auto p-2 text-white bg-pink-600 rounded w-36">
                                        K<sub>(CO<sub>2</sub>)</sub> ：{{ item[2]}}
                                    </span>
									<el-divider direction="vertical" />
									<span class="badge open-color-auto text-gray-500">
                                        R<sup>2</sup><sub>(CO<sub>2</sub>)</sub> ：{{ item[3] }}
                                    </span>
								</div>
								<div class="flex flex-row justify-between space-x-4 items-center px-4">
                                    <span class="badge open-color-auto p-2 text-white bg-[#3f51b5] rounded w-36">
                                        K<sub>(H<sub>2</sub>O)</sub>  ：{{ item[4]}}
                                    </span>
									<el-divider direction="vertical" />
									<span class="badge open-color-auto text-gray-600">
                                        R<sup>2</sup><sub>(H<sub>2</sub>O)</sub> ：{{ item[5]}}
                                    </span>
								</div>
							</div>
						</el-card>
					</el-timeline-item>
				</el-timeline>
			</div>
			<div class="w-full md:w-3/4 h-auto md:h-full flex flex-col items-center space-y-4">
				<div v-if="isLoading" class="flex flex-col justify-center items-center py-4 space-y-4 h-1/2">
					<DataLoading/>
				</div>
				<div v-else class="w-full h-[450px] md:h-1/2 bg-theme-1-color-6 rounded-2xl inner-shadow">
					<AveDataChart :aveData="aveDataList" :x-axis="xAxisData" :type="typeIndex"/>
				</div>
				<div v-if="isLoading" class="flex flex-col justify-center items-center py-4 space-y-4 h-1/2">
					<DataLoading/>
				</div>
				<div v-else class="w-full h-[450px] md:h-1/2 bg-theme-1-color-6 rounded-2xl inner-shadow">
					<FluxHistoryChart :flux-data="fluxList"/>
				</div>
			</div>
		</div>
		<div class="flex flex-col md:flex-row justify-between items-center bg-theme-1-color-6 p-3 h-auto rounded-2xl inner-shadow">
			<div class="flex items-center justify-center w-full md:w-1/4 rounded-xl mt-6 sm:mt-0">
<!--				<file-upload @fileParsed="handleFileParsed">上传数据分析文件</file-upload>-->
			</div>
			<div class="flex flex-row items-center justify-center w-full md:w-1/4 rounded-xl mt-6 sm:mt-0">
				<span class="font-semibold">体积(m³)：</span>
				<div>
					<el-input-number v-model="boxVolume" :step="0.1"/>
				</div>
			</div>
			<div class="flex flex-row items-center justify-center w-full md:w-1/4 rounded-xl mt-6 sm:mt-0">
				<span class="font-semibold">底面积(㎡)：</span>
				<el-input-number v-model="boxArea" :step="0.1"/>
			</div>
			<div class="flex items-center justify-center w-full md:w-1/4 rounded-xl mt-6 sm:mt-0">
				<el-button round @click="analysisDataDownload">下载数据</el-button>
			</div>
		</div>
		<!--		<div class="flex flex-col md:flex-row justify-between items-center bg-slate-800 pt-2 pb-2 h-28 rounded space-x-2">-->
		<!--			<div class="flex flex-col items-center justify-center h-full w-full md:w-1/4 rounded-2xl rounded-bl pl-10 pr-10">-->
		<!--				<file-upload @fileParsed="handleHistoryFileParsed">上传历史文件</file-upload>-->
		<!--			</div>-->
		<!--		</div>-->
		
		<!--		<div class="flex flex-col md:flex-row justify-center items-center bg-slate-800 p-10 rounded" v-if="isFileLoading2">-->
		<!--			<el-transfer-->
		<!--				v-model="selectHistoryKeyList"-->
		<!--				:data="historyKeyList"-->
		<!--				filterable-->
		<!--				:titles="['备份的数据', '要处理的数据']"-->
		<!--			/>-->
		<!--		</div>-->
		<!--		<div class="flex items-center p-4 rounded h-96" v-if="!isFileLoading2">-->
		<!--			<p class="text-5xl text-green-500 font-bold m-auto">【传入备份的本地文件后加载数据】</p>-->
		<!--		</div>-->
	</div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import FluxHistoryChart from "@/components/echarts/FluxChart.vue";
import AveDataChart from "@/components/echarts/AveDataLineChart.vue";
import FileUpload from "@/components/FileUpload.vue";
import {excelTimestampToDate, getTimeRange, showMessage, transposeMatrix} from "@/utils/tools-functions.js";
import * as XLSX from 'xlsx';
import {useAuthStore} from "@/stores/userStore.js";
import {storeToRefs} from "pinia";
import TimeDatePicker from "@/components/ElementTimeDatePicker.vue";
import {postAnalysisDataDownload, postSingleAnalysisData} from "@/server/request-apis.js";
import DataLoading from "@/components/DataLoading.vue";

// Pinia数据
const authStore = useAuthStore();
const {SCGData} = storeToRefs(authStore);

// 数据加载状态
const isLoading = ref(false);

//
const selectedDeviceSnValues = ref(["AE0XAOJY18G2409000003"]); //设备的SN码
const selectedValues2 = ref([]);
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
// 判断选择的是否是多通道数据
const isMultiChannel = computed(() => {
	return selectedDeviceSnValues.value[0][0] === 'B';
})

// 组装多通道选择器的Option
const multiSubStationOption = computed(() => {
	let i = 1
	const numbersInWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
	let option = []
	while (i < 10){
		option.push({
			value: 'slave_' + numbersInWords ,
			label: '子站 0' + i.toString()
		})
		i++;
	}
	option.push({
		value: 'slave_ten' ,
		label: '子站 10'
	})
	return option;
})
// 固定的时间范围
// const timeRange = ref(["2024-10-18 05:38:40", "2024-10-18 10:20:40"])

// 时间范围
const timeRange = ref(getTimeRange(72))

// 用于存储解析后的数据
const xlsxFileData1 = ref(null);
const xlsxFileData2 = ref(null);

const matParsedData = ref([]);
const isFileLoading1 = ref(false);
const isFileLoading2 = ref(false);

// 用来区分是来自接口的数据还是本地文件的数据
const typeIndex = ref(0);

//X轴以及通量数据、平均温湿度数据
const xAxisData = ref([])
const fluxList = ref({})
const aveDataList = ref([])

// 箱子的体积
const boxVolume = ref(1)

// 箱子的底面积
const boxArea = ref(1)

const historyKeyList = ref([])
const selectedData = ref({})
const timeRangeList = ref([])

// 获取分析的数据并处理
const singleAnalysisData = async () => {
	try {
		isLoading.value = true;
		typeIndex.value = 0;
		const res = await postSingleAnalysisData(selectedDeviceSnValues.value[0], boxVolume.value / boxArea.value, timeRange.value);
		xAxisData.value = []
		timeRangeList.value = []
		for (let i = 0; i < res.data.analyze_data[0].length; i++) {
			// 图标用X轴
			xAxisData.value.push(res.data.analyze_data[8][i] + ' - ' + res.data.analyze_data[9][i]);
			// 时间线用轴
			timeRangeList.value.push([res.data.analyze_data[9][i], res.data.analyze_data[9][i]])
		}
		aveDataList.value = [res.data.analyze_data[6], res.data.analyze_data[7]]
		fluxList.value = { ec: res.data.analyze_data[2], ew: res.data.analyze_data[5], time: xAxisData }
		let timeLineData = [
			res.data.analyze_data[8],
			res.data.analyze_data[9],
			res.data.analyze_data[0],
			res.data.analyze_data[1],
			res.data.analyze_data[3],
			res.data.analyze_data[4],
		]
		matParsedData.value = transposeMatrix(timeLineData)
		isFileLoading1.value = true;
	} catch (e) {
		console.log(e)
	} finally {
		isLoading.value = false;
	}
	
}

// 处理传递过来的数据分析数据
const handleFileParsed = (data) => {
	xlsxFileData1.value = data
	//用于时间线列表解析的数据
	let timeLineData = [data['开始时间'], data['结束时间'], data['二氧化碳_K值'], data['二氧化碳_R²'], data['水分绝对浓度_K值'], data['水分绝对浓度_R²'],]
	matParsedData.value = transposeMatrix(timeLineData)
	
	//平均值图表使用的数据
	let xAxisData = []  //X轴
	for (let i = 0; i < data['开始时间'].length - 1; i++) {
		xAxisData.push(excelTimestampToDate(data['开始时间'][i]) + ' - ' + excelTimestampToDate(data['结束时间'][i]))
		timeRangeList.value.push([excelTimestampToDate(data['开始时间'][i]), excelTimestampToDate(data['结束时间'][i])])
	}
	aveDataList.value = [
		xAxisData,
		data['箱内温度'],
		data['箱内湿度'],
		data['箱外温度'],
		data['箱外湿度'],
		data['二氧化碳'],
		data['饱和水气压'],
		data['箱外饱和水气压'],
		data['水分绝对浓度'],
		data['VPD'],
		data['VPD-out'],
		data['二氧化碳_K值'],
		data['二氧化碳_R²'],
		data['水分绝对浓度_K值'],
		data['水分绝对浓度_R²'],
	];
	
	//通量图表数据
	fluxList.value = {ec: data['碳通量'], ew: data['水通量'], time: xAxisData}
	isFileLoading1.value = true;
};

//修改体积面积比值后对通量数值进行处理
const modifyVSProportion = () => {
	let proportion = boxVolume.value / boxArea.value;
	fluxList.value.ec = fluxList.value.ec.map(value => value * proportion)
	fluxList.value.ew = fluxList.value.ew.map(value => value * proportion)
}

// 处理传递过来的历史数据（第二个Excel）
const handleHistoryFileParsed = (data) => {
	if (!isFileLoading1.value) {
		showMessage('先上传第一个数据分析的文件')
	} else {
		xlsxFileData2.value = data;
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
		console.log('历史文件解析后生成的具体数据:', xlsxFileData2.value)
		isFileLoading2.value = true;
	}
};

// Element Plus穿梭框当数据从左侧移动到右侧时触发
const handleTransferChange = (newTargetKeys, direction, moveKeys) => {
	console.log('右侧的Key', moveKeys)
	for (let key of moveKeys) {
		console.log(key)
		selectedData.value[key] = xlsxFileData2.value[key]
	}
	console.log('选中后的数据：' + selectedData)
	
};

//最后的按钮用来生成xlsx文件
const lastProcess = () => {
	if (Object.keys(selectedData.value).length === 0) {
		showMessage('请先在穿梭框中选择要处理的数据对象')
	} else {
		const newData = findNearestTimePoints(timeRangeList.value, xlsxFileData2.value['存储时间']);
		const seriesNameList = ['箱内温度', '箱内湿度', '箱外温度', '箱外湿度', '二氧化碳', '饱和水气压', '箱外饱和水气压', '水分绝对浓度',
			'VPD', 'VPD-out', '二氧化碳_K值', '二氧化碳_R²', '水分绝对浓度_K值', '水分绝对浓度_R²'];
		let exportXlsxFileData = [];
		for (let i = 0; i < seriesNameList.length; i++) {
			exportXlsxFileData.push(xlsxFileData1.value[seriesNameList[i]]);
		}
		let startTimeList = []
		let endTimeList = []
		for (let item of timeRangeList.value) {
			startTimeList.push(new Date(item[0].replace(' ', 'T')));
			endTimeList.push(new Date(item[1].replace(' ', 'T')));
		}
		exportXlsxFileData.unshift(endTimeList);
		exportXlsxFileData.unshift(startTimeList);
		exportXlsxFileData.push(fluxList.value.ec);
		exportXlsxFileData.push(fluxList.value.ew);
		
		seriesNameList.unshift('结束时间');
		seriesNameList.unshift('开始时间');
		seriesNameList.push('碳通量');
		seriesNameList.push('水通量');
		
		for (let i = 0; i < exportXlsxFileData.length; i++) {
			exportXlsxFileData[i].unshift(seriesNameList[i]);
		}
		exportXlsxFileData.push(...newData)
		showMessage('数据处理完成', 'info')
		exportToExcel(transposeMatrix(exportXlsxFileData))
	}
}

//时间点对其时间段的处理函数
function findNearestTimePoints(timeRanges, timePoints) {
	let processedData = []
	let objectNameList = Object.keys(selectedData.value)
	for (let rangeIndex = 0; rangeIndex < timeRanges.length; rangeIndex++) {
		const [start, end] = timeRanges[rangeIndex];
		
		for (let pointIndex = 0; pointIndex < timePoints.length; pointIndex++) {
			const pointDate = new Date(timePoints[pointIndex]);
			const startDate = new Date(start);
			const endDate = new Date(end);
			
			// 计算距离
			if (pointDate >= startDate && pointDate <= endDate) {
				// 如果在范围内，距离为0
				let tempItem = []
				for (let objectName of objectNameList) {
					tempItem.push(selectedData.value[objectName][pointIndex]);
				}
				processedData.push(tempItem);
				break; // 找到最近的点，退出内层循环
			}
		}
	}
	processedData.unshift(objectNameList)
	return transposeMatrix(processedData)
}

// 生成工作表
const exportToExcel = (data, filename = 'PagePrecessed.xlsx') => {
	
	const worksheet = XLSX.utils.aoa_to_sheet(data);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
	
	// 写入文件
	XLSX.writeFile(workbook, filename);
	showMessage('数据已导出', 'success')
}

/**
 * 数据下载
 */
const analysisDataDownload = async () =>{
	try {
		showMessage('数据开始下载', 'info')
		const res = await postAnalysisDataDownload(selectedDeviceSnValues.value[0], boxVolume.value / boxArea.value, timeRange.value);
		// 创建一个 Blob URL
		const url = window.URL.createObjectURL(new Blob([res.data]));
		
		// 创建一个链接元素
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'data.xlsx'); // 指定下载的文件名
		
		// 添加链接到 DOM
		document.body.appendChild(link);
		link.click(); // 模拟点击下载
		link.parentNode.removeChild(link); // 下载后移除链接
	} catch (e) {
		console.log('数据下载错误：',e)
		showMessage('数据下载错误')
	} finally {
	}
	
}

onMounted(() => {
	singleAnalysisData();
})
</script>


<style scoped>

.analysis-div {
	height: calc(100vh - 370px);
}
</style>
