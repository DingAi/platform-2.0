<template>
	<div class="space-y-4 text-center size-full">
		<div
			class="flex md:flex-row flex-col justify-between items-center bg-slate-800 pt-2 pb-2 h-28 rounded space-x-2">
			<div class="flex items-center justify-center h-full w-1/4 rounded-tl rounded-bl pl-20 pr-20">
				<file-upload @fileParsed="handleFileParsed">上传数据分析文件</file-upload>
			</div>
			<div class="flex flex-col items-center justify-center h-full w-1/4 rounded-tl rounded-bl pl-10 pr-10 space-y-4">
				<span class="font-semibold text-gray-100">箱体体积（V）</span>
				<el-input-number v-model="boxVolume" :step="0.1"/>
			</div>
			<div class="flex flex-col items-center justify-center h-full w-1/4 rounded-tl rounded-bl pl-10 pr-10 space-y-4">
				<span class="font-semibold text-gray-100">底面积（S）</span>
				<el-input-number v-model="boxArea" :step="0.1"/>
			</div>
			<div class="flex flex-col items-center justify-center h-full w-1/4 rounded-tl rounded-bl pl-10 pr-10">
				<el-button type="primary" @click="modifyVSProportion">重新加载</el-button>
			</div>
		</div>
		
		<div class="flex items-center p-4 rounded h-h" v-if="!isFileLoading1">
			<p class="text-5xl text-green-500 font-bold m-auto">【选择数据范围或传入文件后加载数据】</p>
		</div>
		
		<div class="flex w-full analysis-div space-x-4" v-else>
			<div class="w-1/3 bg-slate-800 rounded p-4 overflow-auto h-h">
				<el-timeline v-if="isFileLoading1">
					<el-timeline-item center
					                  v-for="(item, index) in matParsedData"
					                  :timestamp="(excelTimestampToDate(item[0]) + ' - ' + excelTimestampToDate(item[1]))"
					                  placement="top">
						<div style="width: 100%;">
							<el-text type="success">INDEX：{{ index + 1 }}</el-text>
						</div>
						<el-card>
							<div class="size-full space-y-2">
								<p>
                                    <span class="badge open-color-auto m-1 text-pink-600">
	                                    K                                                                                                                <sub>(CO<sub>2</sub>) </sub>：{{item[2].toFixed(6) }}
                                    </span>
									<span class="badge open-color-auto m-1">
										R<sup>2</sup><sub>(CO<sub>2</sub>)</sub>：{{item[3].toFixed(6) }}
									</span>
								</p>
								<p>
									<span class="badge open-color-auto m-1 text-green-500">
										K<sub>(H<sub>2</sub>O)</sub>：{{item[4].toFixed(6) }}
									</span>
									<span class="badge open-color-auto m-1">
										R<sup>2</sup><sub>(H<sub>2</sub>O)</sub>：{{item[5].toFixed(6) }}
									</span>
								</p>
<!--								<div class="space-x-6">-->
<!--									<el-tag>二氧化碳K值 {{ item[2].toFixed(4) }}</el-tag>-->
<!--									<el-tag type="info">二氧化碳拟合度 {{ item[3].toFixed(4) }}</el-tag>-->
<!--								</div>-->
<!--								<div class="space-x-6">-->
<!--									<el-tag>水分绝对浓度K值 {{ item[4].toFixed(4) }}</el-tag>-->
<!--									<el-tag type="info">水分绝对浓度拟合度 {{ item[5].toFixed(4) }}</el-tag>-->
<!--								</div>-->
							</div>
						</el-card>
					</el-timeline-item>
				</el-timeline>
			</div>
			<div class="w-3/4 h-full flex flex-col items-center space-y-4">
				<div class="w-full h-1/2 bg-[#333333] rounded">
					<AveDataChart :aveData="aveDataList"/>
				</div>
				<div class="w-full h-1/2 bg-[#333333] rounded">
					<FluxHistoryChart :flux-data="fluxList"/>
				</div>
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
				:titles="['备份的数据', '要处理的数据']"
				@change="handleTransferChange"
			/>
		</div>
		<div class="flex items-center p-4 rounded h-96" v-if="!isFileLoading2">
			<p class="text-5xl text-green-500 font-bold m-auto">【传入备份的本地文件后加载数据】</p>
		</div>
		<div class="flex items-center p-4 rounded h-24" v-if="!isFileLoading2">
			<el-button>dfadasd</el-button>
		</div>
	</div>
</template>

<script setup>
import {computed, ref} from 'vue';
import FluxHistoryChart from "@/components/echarts/FluxChart.vue";
import AveDataChart from "@/components/echarts/AveDataLineChart.vue";
import FileUpload from "@/components/FileUpload.vue";
import {excelTimestampToDate, transposeMatrix} from "@/utils/tools-functions.js";
import {useAuthStore} from "@/stores/userStore.js";
import {storeToRefs} from "pinia";

const authStore = useAuthStore();
const {SCGData} = storeToRefs(authStore);

// 用于存储解析后的数据
const historyParsedData = ref(null);
const matParsedData = ref([]);
const isFileLoading1 = ref(false);
const isFileLoading2 = ref(false);
const fluxList = ref([])
const aveDataList = ref([])
const boxVolume = ref(1)
const boxArea = ref(1)
const historyKeyList = ref([])
const selectHistoryKeyList = ref([])

const displayParsedData = ref(null); // 用于存储显示区的文件数据
const displayDataWithHistory = ref([]); // 带有插入历史数据的显示文件

// 定义级联选择器的属性
const cascaderProps = {
	multiple: true,
	value: 'value', // 选项的值字段
	label: 'label', // 选项的标签字段
	children: 'children' // 子级字段
}

// 处理传递过来的数据分析数据
const handleFileParsed = (data) => {
	displayParsedData.value = data;
	console.log('上传文件的数据:', displayParsedData);
	let timeLineData = [data['开始时间'], data['结束时间'], data['二氧化碳_K值'], data['二氧化碳_R²'], data['水分绝对浓度_K值'], data['水分绝对浓度_R²'],]
	matParsedData.value = transposeMatrix(timeLineData)
	let xAxisData = []
	for (let i = 0; i < data['开始时间'].length - 1; i++) {
		xAxisData.push(excelTimestampToDate(data['开始时间'][i]) + ' - ' + excelTimestampToDate(data['结束时间'][i]))
	}
	aveDataList.value = [
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
		xAxisData
	];
	
	fluxList.value = { ec: data['碳通量'], ew: data['水通量'], time: xAxisData }
	console.log('从子组件接收到的数据:', data);
	console.log('matParsedData:', data.value);
	isFileLoading1.value = true;
};

const modifyVSProportion = () =>{
	let proportion = boxVolume.value / boxArea.value;
	fluxList.value.ec = fluxList.value.ec.map(value => value * proportion)
	fluxList.value.ew = fluxList.value.ew.map(value => value * proportion)
}

// 处理传递过来的历史数据
const handleHistoryFileParsed = (data) => {
	historyParsedData.value = data;
	// // 备份的数据，六个选项
	// historyKeyList.value = [
	// 	{ key: 'time', label: '存储时间' },
	// 	{ key: 'wind_speed', label: '风速' },
	// 	{ key: 'net_radiation', label: '净辐射' },
	// 	{ key: 'temperature', label: '温度' },
	// 	{ key: 'pressure', label: '大气压力' },
	// 	{ key: 'illumination', label: '光照' }
	// ];
	// console.log('历史文件解析后生成的选项:', historyKeyList.value);
	
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
	console.log('历史文件解析后生成的选项列表:',historyKeyList.value)
	console.log('历史文件解析后生成的具体数据:', historyParsedData.value)
	isFileLoading2.value = true;
};


// 处理时间对比并找到最近的时间区间
const findClosestInterval = (storageTime, displayData) => {
	const storageDate = new Date(storageTime); // 将存储时间转换为 Date 对象
	let closestInterval = null; // 用于存储最近的时间区间
	let closestDiff = Infinity; // 用于记录最近的时间差
	
	displayData.forEach(row => {
		const startTime = new Date(row['开始时间']); // 获取每行的开始时间
		const endTime = new Date(row['结束时间']); // 获取每行的结束时间
		
		// 判断存储时间是否在开始时间和结束时间之间
		if (storageDate >= startTime && storageDate <= endTime) {
			const diff = Math.min(Math.abs(storageDate - startTime), Math.abs(storageDate - endTime));
			
			// 如果找到更近的时间区间，更新
			if (diff < closestDiff) {
				closestDiff = diff;
				closestInterval = row; // 存储该区间的行数据
			}
		}
	});
	
	return closestInterval; // 返回最近的时间区间
};


// 当数据从左侧移动到右侧时触发
const handleTransferChange = (newTargetKeys, direction, moveKeys) => {
	const selectedData = {};  // 存储选中的 key 对应的具体数据
	
	// 遍历每个选择的 key，去 historyParsedData 中找到对应的数据
	selectHistoryKeyList.value.forEach((key) => {
		// 检查 historyParsedData.value 中是否存在这个 key
		if (historyParsedData.value && historyParsedData.value[key]) {
			selectedData[key] = historyParsedData.value[key];  // 获取对应的值
		} else {
			console.log(`未找到 ${key} 对应的数据`);
		}
	});
	
	// 打印出选中的 key 和其对应的具体内容
	console.log('当前选中的要处理的数据:', selectHistoryKeyList.value);  // 选中的 key 名字
	console.log('选中数据对应的具体内容:', selectedData);  // key 对应的数据
	
	
	//将用户从备份文件中选中的数据与显示区文件进行时间对比，然后将历史文件数据插入到显示文件中
	
	const updatedData = [];
	
	// 遍历每个选择的 key，找到历史文件中的数据
	selectHistoryKeyList.value.forEach((key) => {
		if (historyParsedData.value && historyParsedData.value[key]) {
			// 遍历每条历史数据，根据时间找到对应的显示区区间
			historyParsedData.value[key].forEach(historyRow => {
				const storageTime = historyRow['存储时间']; // 获取存储时间
				const closestInterval = findClosestInterval(storageTime, displayParsedData.value);
				
				if (closestInterval) {
					// 将历史数据插入到显示文件中对应的区间
					closestInterval[key] = historyRow[key];
				}
			});
		}
	});
	
	//更新显示数据
	displayDataWithHistory.value = [...displayParsedData.value]; // 将带有历史数据的显示文件保存
	console.log('带有历史数据的显示文件:', displayDataWithHistory.value);
	
};

// function timeArrayProcessing(jsonData){
// 	const timeList = values[jsonData.length - 1];
// 	console.log(timeList)
// 	for(let item of timeList){
// 		localTimeRangeList.value.push(item.split(' - '));
// 	}
// 	console.log(localTimeRangeList.value)
// }


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
