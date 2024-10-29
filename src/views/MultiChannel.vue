<template>
	<div class="space-y-4 text-center size-full">
		
		<div class="mb-4">
			<el-button-group>
				<el-button v-for="(box, index) in gasBoxes"
				           :key="index"
				           :icon="Monitor"
				           @click="updateData(box)">
					{{box}}
				</el-button>
			</el-button-group>
<!--			<el-button v-for="(box, index) in gasBoxes" :key="index" type="primary" @click="updateData(box)">-->
<!--				{{ box }}-->
<!--			</el-button>-->
		</div>
		
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
				<ApGaugeChart :ap-data="apValue"/>
			</div>
			<!-- 第二个图表 -->
			<div class="rounded w-full md:w-7/12 h-96 md:h-full p-4">
				<ThLineChart :th-value="thValue" :current-time="currentTime"/>
			</div>
			<!-- 右侧操作区 -->
			<div class="rounded w-full md:w-2/12 h-96 md:h-full space-y-4 flex flex-col overflow-hidden">
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
				
				
				<div v-for="(item, index) in switchList"
				     :key="index"
				     class="h-1/6 rounded overflow-hidden flex flex-row items-center justify-center p-6">
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
					<span class="text-sm p-2">-{{ switchNameList[index] }}</span>
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
			                :page-row-number="20"/>
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
import {ArrowLeft, Monitor} from "@element-plus/icons";

const route = useRoute()

// const sn = ref(route.params.id);
const sn = ref("AE0XAOJY18G2409000003");
const sntest = ref('route.params.id');//请求失败的sntest
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
const switchValue = ref(0)
const gasBoxes = ref(['主站', '气体箱 01', '气体箱 02', '气体箱 03', '气体箱 04', '气体箱 05', '气体箱 06', '气体箱 07', '气体箱 08', '气体箱 09', '气体箱 10'
]);

// 弹窗
const dialogVisible = ref(false);

const dialogWidth = computed(() => {
	return window.innerWidth < 768 ? '90%' : '30%';
});

function dialogShow(rowIndex) {
	dialogVisible.value = true;
}


// 测试更新数据的方法
const updateData = async (source) => {
	//请求失败的例子
	if (source === '气体箱 01') {
		await getRealDataTest()
		pollingActive = true
		//请求成功的例子
	} else if (source === '气体箱 02') {
		await getRealData()
	}
};


let pollingActive = true;  //是否接收到数据
const getRealData = async () => {
	if (!pollingActive) return;
	isLoading.value = true;
	try {
		const res = await postRealData(sn.value);
		if (res.data.data_big.length > 0) {
			isConnectState.value = false;
			let all_data = res.data.data_big;
			
			//赋值给开关变量
			switchValue.value = all_data[32];
			
			currentTime.value = res.data.timest;
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
		apValue.value = []
		thValue.value = [];
		sensorCol.value = [];
		pollingActive = false;
		showMessage('请求数据失败！')
	} finally {
		isLoading.value = true;
	}
}

//请求失败的例子
const getRealDataTest = async () => {
	
	if (!pollingActive) return;
	isLoading.value = true;
	try {
		const res = await postRealData(sntest.value);
		console.log(res);
		
		if (res.data.data_big.length > 0) {
			isConnectState.value = false;
			let all_data = res.data.data_big;
			
			//赋值给开关变量
			switchValue.value = all_data[32];
			
			currentTime.value = res.data.timest;
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
			pollingActive = false;
			apValue.value = []
			thValue.value = [];
			sensorCol.value = [];
			showMessage('请求数据失败！')
		}
	} catch (e) {
		console.error(e);
		pollingActive = false;
		apValue.value = []
		thValue.value = [];
		sensorCol.value = [];
		console.log('hh');
		
		showMessage('请求数据失败！')
	} finally {
		isLoading.value = true;
	}
}

// 开关数据
async function setInitSwitchState() {
	function decimalToBinaryArray(decimal) {
		if (decimal < 0 || decimal > 15) {
			throw new Error('请输入0到15之间的正整数');
		}
		// 将十进制转为二进制，并用padStart补齐4位
		const binaryString = decimal.toString(2).padStart(4, '0');
		// 将二进制字符串转为数组，并将每个字符转换为数字
		return binaryString.split('').map(Number);
	}
	
	switchList.value = decimalToBinaryArray(switchValue.value);
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
		getRealData()
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
	await setInitSwitchState()
	console.log('asdasddadsadasd')
	intervalId = setInterval(getRealData, 5000)
});

// 切换界面后停止轮询
onBeforeUnmount(() => {
	clearInterval(intervalId);
});

// 监听路由参数变化，更新设备ID
watch(() => route.params.id, (newId) => {
	sn.value = newId
	let index = SCGData[0].indexOf(sn.value);
	getRealData();
	setInitSwitchState();
	equipmentName.value = ref(SCGData[1][index]);
	sensorCol.value = []
	thValue.value = []
})
</script>

<style scoped>

</style>
