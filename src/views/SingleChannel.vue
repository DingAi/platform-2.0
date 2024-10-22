<template>
	<div class="space-y-4 text-center size-full">
		<!-- 顶栏 -->
		<div class="flex flex-col md:flex-row justify-between items-center bg-[#f5f5f5] p-4 h-auto rounded-2xl inner-shadow">
			<span class="text-xl text-[#5c5c5c] px-2 mt-2 md:mt-0 font-bold">{{ equipmentName }}</span>
			<span class="text-xl text-white bg-[#757de8] rounded-xl px-2 mt-2 md:mt-0">{{ sn }}</span>
		</div>
		
		<!-- 通信异常内容 -->
		<div class="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 h-auto
			md:h-96 rounded-2xl bg-[#f5f5f5] inner-shadow p-4" v-show="isConnectState">
			<span class="text-8xl text-[#757de8]">设备通信异常</span>
		</div>
		
		<!-- 主内容 -->
		<div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 h-auto
			md:h-96 rounded-2xl bg-[#f5f5f5] inner-shadow p-4" v-show="!isConnectState">
			<!-- 第一个图表 -->
			<div class="rounded w-full md:w-3/12 h-96 md:h-full p-2">
				<!--				<ApPieChart :ap-data="apValue"/>-->
				<ApGaugeChart :ap-data="apValue"/>
			</div>
			<!-- 第二个图表 -->
			<div class="rounded w-full md:w-7/12 h-96 md:h-full p-4">
				<ThLineChart :th-value="thValue" :current-time="currentTime"/>
			</div>
			<!-- 右侧操作区 -->
			<div class="rounded w-full md:w-2/12 h-96 md:h-full space-y-4 flex flex-col overflow-hidden justify-start md:justify-center">
				<div class="h-1/6 rounded overflow-hidden flex items-center p-6 justify-center">
					<el-button type="primary" @click="dialogShow" round>时间设置</el-button>
				</div>
				
				<!-- 时间弹窗 -->
				<el-dialog v-model="dialogVisible" title="时间间隔状态" :width="dialogWidth">
					<div class="flex flex-col w-full space-y-4 justify-center items-center mb-12 overflow-auto bg-[#f5f5f5] p-4">
						<div class="flex space-x-0 md:space-x-2 w-full"
						     v-for="(item, index) in setTimeList"
						     :key="index">
							<div class="md:w-1/4 flex items-center justify-center">
								<p class="text-sm text-center">{{ setTimeNameList[index] }}</p>
							</div>
							<div class="md:w-1/4">
								<el-input-number v-model="setTimeList[index]" :step="1" class="w-full"/>
							</div>
							<div class="md:w-1/4 flex justify-center">
								<span class="font-bold">秒</span>
							</div>
							<div class="md:w-1/4 flex justify-center px-8">
								<el-button type="primary"
								           @click="setTimeValue(setTimeList[index], index)"
								           class="w-full"
								           round>设置
								</el-button>
							</div>
						</div>
					</div>
				</el-dialog>
				<!--手动开关-->
				<div class="h-1/6 rounded overflow-hidden flex flex-row items-center justify-center md:justify-between p-5">
					<el-switch
						v-model="isManual"
						:active-value="true"
						:inactive-value="false"
						size="large"
						:loading="loadingList[index]"
					>
						<template #active-action>
							<span class="custom-active-action">T</span>
						</template>
						<template #inactive-action>
							<span class="custom-inactive-action">F</span>
						</template>
					</el-switch>
					<el-divider direction="vertical" />
					<span class="text-sm p-2">手动控制</span>
				</div>
				<!--开关列表-->
				<div v-for="(item, index) in switchList" :key="index"
				     class="h-1/6 rounded overflow-hidden flex flex-row items-center justify-center md:justify-between p-5">
					<el-switch
						v-model="switchList[index]"
						:active-value="1"
						:inactive-value="0"
						size="large"
						:loading="loadingList[index]"
						@change="switchTrigger(index)"
						:disabled="!isManual"
					>
						<template #active-action>
							<span class="custom-active-action">T</span>
						</template>
						<template #inactive-action>
							<span class="custom-inactive-action">F</span>
						</template>
					</el-switch>
					<el-divider direction="vertical" />
					<span class="text-sm p-2 text-whit w-20">{{ switchNameList[index] }}</span>
				</div>
			</div>
		</div>
		
		<!-- 传感器数据列表 -->
		<div class="justify-between items-center bg-[#f5f5f5] p-6 px-6 md:px-20 h-full rounded-2xl pb-10 inner-shadow">
			<div class="flex items-center flex-col md:flex-row">
				<h1 class="text-2xl md:text-4xl mb-6">传感器数据列表</h1>
			</div>
			<table-template :column="sensorCol"
			                :header="sensorHeader"
			                :is-loading="sensorLoading"
			                :page-row-number="16"/>
		</div>
	</div>
</template>


<script setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {showMessage, transposeMatrix} from "@/utils/tools-functions.js";
import TableTemplate from "@/components/TableTemplate.vue";
import {postRealData, postSetTime, postSwitch} from "@/server/request-apis.js";
import ThLineChart from "@/components/echarts/ThLineChart.vue";
import ApGaugeChart from "@/components/echarts/ApGaugeChart.vue";

const route = useRoute()

const sn = ref(route.params.id);
const isConnectState = ref(false)
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
const switchNameList = ref(['传感器', '电机', '风扇', '气泵'])
const loadingList = ref(Array(switchList.value.length).fill(false)); // 初始加载状态
const setTimeList = ref([])
const setTimeNameList = ref(['转速', 'SD卡1写延时', 'SD卡2写延时', '熄屏时间', '开关箱时间', '风扇启动延时', '气体搅拌时间',
	'读二氧化碳时间', '抽真空时间', '循环时间'])

const isSwitch = ref(false) // 是否执行过开关动作
const dialogVisible = ref(false); // 弹窗
const isManual = ref(false); // 手动状态

const dialogWidth = computed(() => {
	return window.innerWidth < 768 ? '90%' : '30%';
});

function dialogShow(rowIndex) {
	dialogVisible.value = true;
}


let pollingActive = true;  //是否接收到数
const getRealData = async () => {
	if (!pollingActive) return;
	isLoading.value = true;
	try {
		const res = await postRealData(sn.value);
		if (res.data.data_big.length > 0) {
			isConnectState.value = false;
			let all_data = res.data.data_big;
			
			//赋值给开关变量
			if (!isSwitch.value) {
				await setInitSwitchState(all_data[32])
				isSwitch.value = true;
			}
			currentTime.value = res.data.timest;
			
			//表格数据
			sensorCol.value = transposeMatrix([dataPointNameList, all_data]);
			subStationId.value = all_data[2];
			
			// 温湿度图表数据
			thValue.value = [
				all_data[53].toFixed(2),
				all_data[54].toFixed(2),
				all_data[55].toFixed(2),
				all_data[56].toFixed(2)
			];
			
			// 气压图表数据
			apValue.value = [all_data[42].toFixed(2), all_data[43].toFixed(2)];
			// 时间设置数据
			setTimeList.value = [
				all_data[6],
				all_data[8],
				all_data[10],
				all_data[11],
				all_data[15],
				all_data[16],
				all_data[17],
				all_data[18],
				all_data[20],
			];
		} else {
			isConnectState.value = true;
		}
	} catch (e) {
		console.error(e);
		pollingActive = false; // Stop polling on error
		showMessage('请求数据失败！')
	} finally {
		isLoading.value = true;
	}
}

// 开关数据
async function setInitSwitchState(value) {
	function decimalToBinaryArray(decimal) {
		if (decimal < 0 || decimal > 15) {
			throw new Error('请输入0到15之间的正整数');
		}
		// 将十进制转为二进制，并用padStart补齐4位
		const binaryString = decimal.toString(2).padStart(4, '0');
		// 将二进制字符串转为数组，并将每个字符转换为数字
		return binaryString.split('').map(Number);
	}
	
	console.log('开关刷新函数的值：', value)
	switchList.value = decimalToBinaryArray(value);
}


const switchTrigger = async (index) => {
	loadingList.value[index] = true;
	let strValue = '';
	for (let item of switchList.value) {
		strValue += item.toString()
	}
	try {
		const res = await postSwitch(sn.value, strValue, '0a')
		if (res.data.state) {
			switchList.value[index] = switchList.value[index] === 1 ? 1 : 0; // 如果 res.data.state 为 true，则切换状态
			loadingList.value[index] = false; // 动画停止加载
			showMessage('【' + switchNameList.value[index] + '】开关执行成功', 'success')
		} else {
			switchList.value[index] = switchList.value[index] === 1 ? 0 : 1; // 如果 res.data.state 为 true，则切换状态
			loadingList.value[index] = false; // 动画停止加载
			console.log(res.data)
			showMessage('【' + switchNameList.value[index] + '】开关执行失败：' + res.data.message, 'error')
		}
		
	} catch (e) {
		console.error(e);
	} finally {
		// await getRealData()
	}
}

const setTimeValue = async (value, index) => {
	const res = await postSetTime(value, index, sn.value)
	if (res.data.state) {
		loadingList.value[index] = false; // 动画停止加载
		showMessage('【' + setTimeList.value[index] + '】设置时间成功', 'success')
	} else {
		loadingList.value[index] = false; // 动画停止加载
		showMessage('【' + setTimeList.value[index] + '】设置时间失败', 'error')
	}
}

let intervalId;
onMounted(async () => {
	await getRealData()
	intervalId = setInterval(getRealData, 5000)
});

// 切换界面后停止轮询
onBeforeUnmount(() => {
	clearInterval(intervalId);
});

// 监听路由参数变化，更新设备ID
watch(
	() => route.params.id,
	(newId) => {
		sn.value = newId;
		isSwitch.value = false;
		let index = SCGData[0].indexOf(sn.value);
		getRealData();
		equipmentName.value = ref(SCGData[1][index]);
		sensorCol.value = [];
		thValue.value = [];
	}
)
</script>

<style scoped>
</style>
