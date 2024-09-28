<template>
	<div class="space-y-4 text-center size-full">
		<div class="flex flex-col md:flex-row justify-between items-center bg-[#2f2f2f] p-4 h-16 rounded">
			<span class="text-xl text-green-500">{{ equipmentName }}</span>
			<span class="text-xl text-white">：{{ sn }}</span>
		</div>
		<div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 h-96 rounded bg-[#2f2f2f]">
			<div class="rounded w-full md:w-3/12 h-full p-2">
				<ApPieChart :ap-data="apValue"/>
			</div>
			<div class="rounded w-full md:w-7/12 h-full p-4">
				<ThLineChart :th-value="thValue" :current-time="currentTime"/>
			</div>
			<div class="rounded w-full md:w-2/12 h-full space-y-4 flex flex-col overflow-hidden">
				<div class="h-1/6 rounded overflow-hidden flex items-center p-6 justify-center">
					<el-button type="primary" @click="dialogShow">时间设置</el-button>
				</div>
				<!-- 时间设置弹窗 -->
				<el-dialog v-model="dialogVisible" title="时间间隔状态" width="90%">
					<div class="flex-col size-full space-y-4 justify-center items-center mb-12 h-96 overflow-auto bg-[#212121]">
						<div class="flex p-4 space-x-4" v-for="(item, index) in setTimeList" :key="index">
							<div class="w-1/4 flex items-center justify-center">
								<p class="text-sm">{{ setTimeNameList[index] }}</p>
							</div>
							<div class="w-2/4">
								<el-input-number v-model="setTimeList[index]" :step="1"/>
							</div>
							<div class="w-1/4 flex justify-center">
								<el-button type="primary" @click="setTimeValue(setTimeList[index], index)">设置</el-button>
							</div>
						</div>
					</div>
					<template #footer>
						<div class="dialog-footer">
							<el-button @click="dialogVisible = false">取消</el-button>
							<el-button type="primary" @click="">保存配置</el-button>
						</div>
					</template>
				</el-dialog>
				
				<div v-for="(item, index) in switchList" :key="index" class="h-1/6 rounded overflow-hidden flex items-center p-6">
					<el-switch
						v-model="switchList[index]"
						:active-value="1"
						:inactive-value="0"
						size="large"
						:loading="loadingList[index]"
						@change="switchTrigger(index)"
					>
						<template #active-action>
							<span class="custom-active-action">T</span>
						</template>
						<template #inactive-action>
							<span class="custom-inactive-action">F</span>
						</template>
					</el-switch>
					<span class="text-sm text-white p-2">-{{ switchNameList[index] }}</span>
				</div>
			</div>
		</div>
		<div class="justify-between items-center bg-[#2f2f2f] p-6 h-full rounded pb-10">
			<div class="flex items-center flex-col md:flex-row">
				<h1 class="text-4xl text-white mb-6">传感器数据列表</h1>
				<p class="ml-auto rounded text-gray-300 hover:text-green-500">
					从站编号：{{ subStationId }}
				</p>
			</div>
			<table-template :column="sensorCol"
			                :header="sensorHeader"
			                :is-loading="sensorLoading"
			                :page-row-number="10"/>
		</div>
	</div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {showMessage, transposeMatrix} from "@/utils/tools-functions.js";
import TableTemplate from "@/components/TableTemplate.vue";
import {postRealData, postSetTime, postSwitch} from "@/server/request-apis.js";
import ApPieChart from "@/components/echarts/ApPieChart.vue";
import ThLineChart from "@/components/echarts/ThLineChart.vue";

const route = useRoute()

const sn = ref(route.params.id);
const thValue = ref([])
const apValue = ref([])
const currentTime = ref('')
const isLoading = ref(false)
const SCGData = JSON.parse(localStorage.getItem('auth')).SCGData;
const dataPointNameList = JSON.parse(localStorage.getItem('data_point'));

// 找到SN码在SCGData中的索引index
let index = SCGData[0].indexOf(sn.value);
// 使用索引来找到对应的设备名
const equipmentName = ref(SCGData[1][index]);
const sensorLoading = ref(false);
const sensorHeader = ref(['传感器', '值'])
const sensorCol = ref([])
const subStationId = ref('')
const switchList = ref([])
const switchNameList = ref(['传感器开关', '电机开关', '风扇开关', '气泵开关'])
const loadingList = ref(Array(switchList.value.length).fill(false)); // 初始加载状态
const setTimeList = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,])
const setTimeNameList = ref(['转速', 'SD卡1写延时', 'SD卡2写延时', '熄屏时间', '开关箱时间', '风扇启动延时', '气体搅拌时间',
	'读二氧化碳时间', '抽真空时间', '循环时间'])

// 弹窗
const dialogVisible = ref(false);

function dialogShow(rowIndex) {
	//在组件中已经声明了行索引所以可以直接在这里调用
	dialogVisible.value = true;
}


let pollingActive = true;  //是否接收到数据
const getRealData = async () => {
	if (!pollingActive) return;
	isLoading.value = true;
	try {
		const res = await postRealData(sn.value);
		let all_data = res.data.data_big;
		currentTime.value = res.data.timest;
		sensorCol.value = transposeMatrix([dataPointNameList, all_data[0]]);
		subStationId.value = all_data[2];
		switchList.value = decimalToBinaryArray(all_data[0][32]);
		// 温湿度图表数据
		thValue.value = [
			all_data[0][53].toFixed(2),
			all_data[0][54].toFixed(2),
			all_data[0][55].toFixed(2),
			all_data[0][56].toFixed(2)
		];
		// 气压图表数据
		apValue.value = [all_data[0][42].toFixed(2), all_data[0][43].toFixed(2)];
	} catch (e) {
		console.error(e);
		pollingActive = false; // Stop polling on error
		showMessage('请求数据失败！')
	} finally {
		isLoading.value = true;
	}
}

function decimalToBinaryArray(decimal) {
	if (decimal < 0 || decimal > 15) {
		throw new Error('请输入0到15之间的正整数');
	}
	// 将十进制转为二进制，并用padStart补齐4位
	const binaryString = decimal.toString(2).padStart(4, '0');
	// 将二进制字符串转为数组，并将每个字符转换为数字
	const binaryStrList = binaryString.split('').map(Number);
	return binaryStrList;
}


const switchTrigger = async (index) => {
	loadingList.value[index] = true;
	let strValue = '';
	for (let item of switchList.value) {
		strValue += item.toString()
	}
	try {
		const res = await postSwitch(sn.value,strValue,'01')
		console.log(switchList.value[index])
		if (res.data.state) {
			switchList.value[index] = switchList.value[index] === 1 ? 1 : 0; // 如果 res.data.state 为 true，则切换状态
		}
		loadingList.value[index] = false; // 停止加载
		showMessage(res.data, 'info')
	} catch (e) {
		console.error(e);
	} finally {
	
	}
}

const setTimeValue = async (value, index) => {
	const res = await postSetTime(value, index, sn.value)
}

let intervalId;
onMounted(async () => {
	await getRealData()
	intervalId = setInterval(getRealData, 20000)
});

// 切换界面后停止轮询
onBeforeUnmount(() => {
	clearInterval(intervalId);
});

// 监听路由参数变化，更新设备ID
watch(() => route.params.id, (newId) => {
	sn.value = newId
	// 在这里可以执行数据获取或其他操作
	let index = SCGData[0].indexOf(sn.value);
	equipmentName.value = ref(SCGData[1][index]);
	sensorCol.value = []
})
</script>

<style scoped>
/* General styles for buttons and backgrounds */
.checkbox {
	width: 20px;
	height: 20px;
	cursor: pointer;
	accent-color: #4caf50;
	margin-left: 8px;
}

.bg-gray-800 {
	background-color: #2d3748; /* Dark gray background */
}

.bg-gray-600 {
	background-color: #4a5568; /* Medium gray background */
}

.table-min {
	min-height: 40rem;
}

/* Mobile Styles */
@media (max-width: 767px) {
	.flex {
		flex-direction: column; /* Stack items vertically */
		margin-left: 0; /* Remove left margin */
	}
	
	.h-96 {
		height: auto; /* Allow height to adjust on mobile */
	}
	
	.p-4 {
		padding: 1rem; /* Reduce padding for mobile */
	}
	
	.space-x-4 {
		margin-left: 0; /* Reset margin for mobile */
		margin-right: 0;
	}
	
	.rounded {
		border-radius: 0.375rem; /* Standard border radius */
	}
	
	.dialog-footer {
		flex-direction: column; /* Stack footer buttons for mobile */
		align-items: center; /* Center align buttons */
	}
	
	.el-dialog {
		width: 90%; /* Ensure dialog is responsive */
	}
}
</style>
