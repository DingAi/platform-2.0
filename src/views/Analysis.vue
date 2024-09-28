<template>
	<div class="space-y-4 text-center size-full">
		<div class="flex flex-col md:flex-row justify-between items-center bg-gray-900 pt-2 pb-2 h-24 rounded space-x-2">
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
				<el-button type="primary" @click="getHistoryData">获取历史数据</el-button>
			</div>
		</div>
		
		<div class="flex items-center p-4 rounded h-h" v-if="!isFileLoading1">
			<p class="text-5xl text-green-500 font-bold m-auto">【选择数据范围或传入文件后加载数据】</p>
		</div>
		<div class="flex flex-col md:flex-row w-full analysis-div space-x-0 md:space-x-4" v-else>
			<div class="w-full md:w-1/3 bg-slate-800 rounded p-4 overflow-auto h-h">
				<el-timeline v-if="isFileLoading1">
					<el-timeline-item center
					                  v-for="(item, index) in matParsedData"
					                  :key="index"
					                  :timestamp="(excelTimestampToDate(item[0]) + ' - ' + excelTimestampToDate(item[1]))"
					                  placement="top">
						<el-card>
							<div style="width: 100%;">
								<el-text type="success">INDEX：{{ index + 1 }}</el-text>
							</div>
							<div class="size-full space-y-2">
								<p>
                                    <span class="badge open-color-auto m-1 text-pink-600">
                                        K<sub>(CO<sub>2</sub>)</sub>：{{ item[2].toFixed(6) }}
                                    </span>
									<span class="badge open-color-auto m-1">
                                        R<sup>2</sup><sub>(CO<sub>2</sub>)</sub>：{{ item[3].toFixed(6) }}
                                    </span>
								</p>
								<p>
                                    <span class="badge open-color-auto m-1 text-green-500">
                                        K<sub>(H<sub>2</sub>O)</sub>：{{ item[4].toFixed(6) }}
                                    </span>
									<span class="badge open-color-auto m-1">
                                        R<sup>2</sup><sub>(H<sub>2</sub>O)</sub>：{{ item[5].toFixed(6) }}
                                    </span>
								</p>
							</div>
						</el-card>
					</el-timeline-item>
				</el-timeline>
			</div>
			<div class="w-full md:w-3/4 h-full flex flex-col items-center space-y-4">
				<div class="w-full h-1/2 bg-slate-800 rounded">
					<AveDataChart :aveData="aveDataList"/>
				</div>
				<div class="w-full h-1/2 bg-slate-800 rounded">
					<FluxHistoryChart :flux-data="fluxList"/>
				</div>
			</div>
		</div>
		
		<div class="flex flex-col md:flex-row justify-between items-center bg-slate-800 pt-2 pb-2 h-28 rounded space-x-2">
			<div class="flex items-center justify-center h-full w-full md:w-1/4 rounded-tl rounded-bl pl-20 pr-20">
				<file-upload @fileParsed="handleFileParsed">上传数据分析文件</file-upload>
			</div>
			<div class="flex flex-col items-center justify-center h-full w-full md:w-1/4 rounded-tl rounded-bl pl-10 pr-10 space-y-4">
				<span class="font-semibold text-gray-100">箱体体积（V）</span>
				<el-input-number v-model="boxVolume" :step="0.1"/>
			</div>
			<div class="flex flex-col items-center justify-center h-full w-full md:w-1/4 rounded-tl rounded-bl pl-10 pr-10 space-y-4">
				<span class="font-semibold text-gray-100">底面积（S）</span>
				<el-input-number v-model="boxArea" :step="0.1"/>
			</div>
			<div class="flex flex-col items-center justify-center h-full w-full md:w-1/4 rounded-tl rounded-bl pl-10 pr-10">
				<submit-button>重新加载图像</submit-button>
			</div>
		</div>
		
		<div class="flex flex-col md:flex-row justify-between items-center bg-slate-800 pt-2 pb-2 h-28 rounded space-x-2">
			<div class="flex flex-col items-center justify-center h-full w-full md:w-1/4 rounded-tl rounded-bl pl-10 pr-10">
				<file-upload @fileParsed="handleHistoryFileParsed">上传历史文件</file-upload>
			</div>
		</div>
		
		<div class="flex flex-col md:flex-row justify-center items-center bg-slate-800 p-10 rounded" v-if="isFileLoading2">
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
import {ref} from 'vue';
import FluxHistoryChart from "@/components/echarts/FluxChart.vue";
import AveDataChart from "@/components/echarts/AveDataLineChart.vue";
import FileUpload from "@/components/FileUpload.vue";
import {excelTimestampToDate, showMessage, transposeMatrix} from "@/utils/tools-functions.js";
import * as XLSX from 'xlsx';


// 用于存储解析后的数据
const xlsxFileData1 = ref(null);
const xlsxFileData2 = ref(null);

const matParsedData = ref([]);
const isFileLoading1 = ref(false);
const isFileLoading2 = ref(false);
const fluxList = ref({})
const aveDataList = ref([])
const boxVolume = ref(1)
const boxArea = ref(1)
const historyKeyList = ref([])
const selectedData = ref({})
const selectHistoryKeyList = ref([])
const timeRangeList = ref([])


// 处理传递过来的数据分析数据
const handleFileParsed = (data) => {
	xlsxFileData1.value = data
	console.log('从子组件接收到的数据:', data);
	//用于时间线列表解析的数据
	let timeLineData = [data['开始时间'], data['结束时间'], data['二氧化碳_K值'], data['二氧化碳_R²'], data['水分绝对浓度_K值'], data['水分绝对浓度_R²'],]
	console.log('timeline:', timeLineData)
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
	console.log('时间范围数组数据:', timeRangeList.value);
	
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

const exportToExcel = (data, filename = 'PagePrecessed.xlsx') => {
	// 生成工作表
	const worksheet = XLSX.utils.aoa_to_sheet(data);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
	
	// 写入文件
	XLSX.writeFile(workbook, filename);
	showMessage('数据已导出', 'success')
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
