<template>
	<div class="space-y-4 text-center size-full">
		<div class="flex md:flex-row flex-col justify-between items-center bg-gray-700 p-4 h-16 rounded">
			<span class="text-xl text-green-500">{{ equipmentName }}</span>
			<span class="text-xl text-white">：{{ sn }}</span>
		</div>
		<div class="flex md:flex-row justify-between items-center space-x-4 h-96 rounded">
			<div class="rounded bg-gray-700 w-1/3 h-full p-2">
				<ApPieChart :ap-data="apValue"/>
			</div>
			<div class="rounded bg-slate-900 w-1/2 h-full p-4">
				<CO2LineChart :co2-value="co2Value"/>
			</div>
			<div class="rounded w-1/6 h-full space-y-4 flex flex-col overflow-hidden">
				<div class="h-1/4 rounded overflow-hidden flex items-center shadow p-6">
					<el-switch v-model="switchList[0]" :active-value="1" :inactive-value="0" size="large" @change="switchTrigger">
						<template #active-action>
							<span class="custom-active-action">T</span>
						</template>
						<template #inactive-action>
							<span class="custom-inactive-action">F</span>
						</template>
					</el-switch>
					<span class="text-sm text-white p-2">-{{ switchNameList[0] }}</span>
				</div>
				<div class="h-1/4 rounded overflow-hidden flex items-center shadow p-6" @change="switchTrigger">
					<el-switch v-model="switchList[1]" :active-value="1" :inactive-value="0" size="large" @change="switchTrigger">
						<template #active-action>
							<span class="custom-active-action">T</span>
						</template>
						<template #inactive-action>
							<span class="custom-inactive-action">F</span>
						</template>
					</el-switch>
					<span class="text-sm text-white p-2">-{{ switchNameList[1] }}</span>
				</div>
				<div class="h-1/4 rounded overflow-hidden flex items-center shadow p-6" @change="switchTrigger">
					<el-switch v-model="switchList[2]" :active-value="1" :inactive-value="0" size="large" @change="switchTrigger">
						<template #active-action>
							<span class="custom-active-action">T</span>
						</template>
						<template #inactive-action>
							<span class="custom-inactive-action">F</span>
						</template>
					</el-switch>
					<span class="text-sm text-white p-2">-{{ switchNameList[2] }}</span>
				</div>
				<div class="h-1/4 rounded overflow-hidden flex items-center shadow p-6" @change="switchTrigger">
					<el-switch v-model="switchList[3]" :active-value="1" :inactive-value="0" size="large" @change="switchTrigger">
						<template #active-action>
							<span class="custom-active-action">T</span>
						</template>
						<template #inactive-action>
							<span class="custom-inactive-action">F</span>
						</template>
					</el-switch>
					<span class="text-sm text-white p-2">-{{ switchNameList[3] }}</span>
				</div>
			</div>
		</div>
		<div class="justify-between items-center bg-gray-700 p-6 h-full rounded pb-10">
			<div class="flex items-center">
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
import {postASwitch, postRealData} from "@/server/request-apis.js";
import CO2LineChart from "@/components/echarts/CO2LineChart.vue";
import ApPieChart from "@/components/echarts/ApPieChart.vue";

const route = useRoute()
const sn = ref(route.params.id);
const co2Value = ref([])
const apValue = ref([])
const SCGData = JSON.parse(localStorage.getItem('auth')).SCGData;

// 找到SN码在SCGData中的索引index
let index = SCGData[0].indexOf(sn.value);
// 使用索引来找到对应的设备名
const equipmentName = ref(SCGData[1][index]);
const sensorLoading = ref(false);
const sensorHeader = ref(['传感器', '值'])
const sensorCol = ref([])
const subStationId = ref('')
const switchList = ref(decimalToBinaryArray(1))
const switchNameList = ref(['传感器开关','电机开关','风扇开关','气泵开关'])

let pollingActive = true;
const getRealData = async () => {
	if (!pollingActive) return;
	try {
		const res = await postRealData(sn.value);
		let all_data = res.data.data_big;
		sensorCol.value = transposeMatrix([all_data[0], all_data[1]]);
		subStationId.value = all_data[2];
		
		co2Value.value = all_data[1][1];
		apValue.value = [all_data[1][41].toFixed(2), all_data[1][42].toFixed(2)];
	} catch (e) {
		console.error(e);
		pollingActive = false; // Stop polling on error
		showMessage('请求数据失败！')
	}
}

function decimalToBinaryArray(decimal) {
	if (decimal < 0 || decimal > 15) {
		throw new Error('请输入0到15之间的正整数');
	}
	// 将十进制转为二进制，并用padStart补齐4位
	const binaryString = decimal.toString(2).padStart(4, '0');
	// 将二进制字符串转为数组，并将每个字符转换为数字
	const binaryArray = binaryString.split('').map(Number);
	return binaryArray;
}



const switchTrigger = async () =>{
	let strValue = '';
	for(let item of switchList.value){
		strValue += item.toString()
	}
	try{
		const res = await postASwitch('01', strValue)
	} catch (e){
		console.error(e);
	} finally {
		showMessage(res.data)
	}
	
}

let intervalId;
onMounted(async () => {
	await getRealData()
	intervalId = setInterval(getRealData, 10000)
});

//切换界面后停止轮询
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
