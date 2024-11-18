<template>
	<div class="space-y-6 text-center size-full">
		<!-- 顶栏 -->
		<div class="flex flex-col md:flex-row justify-between items-center bg-theme-1-color-6 p-4 h-auto rounded-2xl
		inner-shadow smiley-sans">
			<span class="text-xl text-theme-1-color-8 px-2 mt-2 md:mt-0 font-bold">{{ equipmentName }}</span>
			<span class="text-xl text-white bg-theme-1-color-2 rounded-xl px-2 mt-2 md:mt-0">SN：{{ sn }}</span>
		</div>
		
		<!-- 电池与运行状态栏-->
		<div class="flex flex-col md:flex-row justify-between items-center p-4 smiley-sans" v-show="!isConnectState">
			<div class="flex flex-row w-auto items-center">
				<span class="text-xl text-gray-500">电池电量： </span>
				<div class="w-32">
					<el-progress
						:text-inside="true"
						:percentage="batteryLevel"
						:stroke-width="25"
						:color="batteryLevelColors"
						striped/>
				</div>
			</div>
			<span class="text-xl text-theme-1-color-4 px-2 mt-2 md:mt-0">
				运行步骤：{{ runStepsNameList[runStepsIndex] }}
			</span>
		</div>
		<div class="flex flex-col md:flex-row justify-between items-center p-2 smiley-sans" v-show="!isConnectState">
			<div class="flex flex-col md:flex-row w-auto items-center px-2">
				<span class="text-xl text-gray-500">流量卡状态： </span>
				<span class="text-xl text-gray-700 px-2">卡状态</span>
				<span class="text-xl p-2 text-theme-1-color-4">{{ flowCardState[flowData['cardStatusId'] - 1] }}</span>
				<span class="text-xl text-gray-700 px-2 ">总流量</span>
				<span class="text-xl p-2 text-theme-1-color-4">{{ flowData['totalFlow'] }}MB</span>
				<span class="text-xl text-gray-700  px-2">已用流量</span>
				<span class="text-xl text-pink-400 p-2">{{ flowData['useFlow'] }}MB</span>
				<span class="text-xl text-gray-700  px-2">剩余流量</span>
				<span class="text-xl text-indigo-400 p-2">{{ flowData['surplusFlow'] }}MB</span>
				<!--				<span class="text-xl text-gray-500">{{ flowData }}</span>-->
				<span class="text-xl text-gray-700 px-2 ">卡到期时间</span>
				<span class="text-xl p-2 text-gray-400">{{ flowData['cardEndDate'] }}</span>
			</div>
		</div>
		
		<!-- 通信异常内容 -->
		<div class="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 h-auto
			md:h-rem-30 rounded-2xl bg-theme-1-color-6 inner-shadow p-4" v-show="isConnectState">
			<span class="text-8xl text-theme-1-color-2">设备离线</span>
		</div>
		
		<!-- 主内容 -->
		<div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 h-auto
			md:h-rem-30 rounded-2xl bg-theme-1-color-6 inner-shadow p-4" v-show="!isConnectState">
			<!-- 第一个图表 -->
			<!--			<div class="rounded w-full md:w-3/12 h-96 md:h-full p-2">-->
			<!--				&lt;!&ndash;				<ApPieChart :ap-data="apValue"/>&ndash;&gt;-->
			<!--				<ApGaugeChart :ap-data="apValue"/>-->
			<!--			</div>-->
			<!--			&lt;!&ndash; 第二个图表 &ndash;&gt;-->
			<!--			<div class="rounded w-full md:w-7/12 h-rem-30 md:h-full p-4">-->
			<!--				<ThLineChart :th-value="lineChartData" :current-time="currentTime"/>-->
			<!--			</div>-->
			<!-- 右侧操作区 -->
			<div class="rounded w-full md:w-2/12 h-rem-28 md:h-full space-y-4 flex flex-col overflow-hidden justify-start
			 md:justify-center">
				<div class="h-1/6 rounded overflow-hidden flex items-center p-6 justify-center">
					<el-button type="primary" @click="dialogVisible = true" round :disabled="setTimeManualDisabled">
						时间设置
					</el-button>
				</div>
				
				<!-- 时间弹窗 -->
				<el-dialog v-model="dialogVisible" title="时间间隔状态" :width="dialogWidth">
					<div class="flex flex-col w-full space-y-4 justify-center items-center mb-12 overflow-auto
					bg-theme-1-color-6 p-4">
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
								           round
								           :loading="setTimeLoadingList[index]">
									设置
								</el-button>
							</div>
						</div>
					</div>
				</el-dialog>
				<div v-for="(item, index) in switchList" :key="index"
				     class="h-1/6 rounded overflow-hidden flex flex-row items-center justify-center md:justify-between p-5">
					<el-switch
						v-model="switchList[index]"
						:active-value="1"
						:inactive-value="0"
						size="large"
						:loading="switchLoadingList[index]"
						@change="switchTrigger(index)"
						:disabled="isManual[index]"
					>
						<template #active-action>
							<span class="custom-active-action">T</span>
						</template>
						<template #inactive-action>
							<span class="custom-inactive-action">F</span>
						</template>
					</el-switch>
					<el-divider direction="vertical"/>
					<span class="text-sm p-2 text-whit w-20">{{ switchNameList[index] }}</span>
				</div>
			</div>
			<div class="flex flex-col rounded w-full md:w-10/12 h-rem-30 md:h-full">
				<div class="flex flex-col w-full h-1/4 md:flex-row ">
					<div class="flex flex-col items-center justify-center w-full md:w-1/3 rounded-xl px-4 h-full">
						<p class="w-full text-left p-2">选择数据：</p>
						<el-cascader
							v-model="deviceHistorSelected"
							:options="singleDeviceOption"
							collapse-tags
							collapse-tags-tooltip
							:props="cascaderProps"
							placeholder="请选择"
							class="w-full"
						/>
					</div>
					<div class="flex flex-col items-center justify-center w-auto md:w-1/3 rounded-xl px-4">
						<p class="w-full text-left p-2">选择时间范围：</p>
						<TimeDatePicker v-model="timeRange"/>
					</div>
					<div class="flex flex-col items-center justify-center md:flex-row w-full md:w-1/3 rounded-xl ">
						<div class="p-2 w-full md:1/2">
							<el-button type="primary" @click="getHistoryData" round>加载数据</el-button>
						</div>
						<div class="p-2 w-full md:1/2">
							<el-tooltip content="提醒:历史大数据下载建议使用数据下载界面"
							            placement="bottom"
							            effect="customized">
								<el-button v-if="!historyLoading"
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
				<div class="p-2 w-full h-3/4 bg-theme-1-color-6 ">
					<div v-if="historyLoading" class="flex flex-col justify-center items-center py-4 space-y-4 h-full">
						<DataLoading/>
					</div>
					<HistoryChart v-else
					              :historyData="historyData"
					              :xAxisData="xAxisData"
					              :historyLoading="historyLoading"/>
				</div>
			</div>
		</div>
		
		
		<!--温度与气压数据-->
		<div class="block h-rem-29 md:h-44 my-4 p-6" v-if="isLoading">
			<el-descriptions title="温度与气压数据" size="large" border :column="columnCount">
				<el-descriptions-item
					v-for="(item, index) in [44,45, 46, 47, 53, 54, 55, 56]"
					:key="item"
					:label="singlePointNameList[item]">
					<el-tag>{{ descriptionsList[index] }} {{ singlePointUnitList[item] }}</el-tag>
				</el-descriptions-item>
			</el-descriptions>
		</div>
		
		<!-- 传感器数据列表 -->
		<div class="justify-between items-center bg-theme-1-color-6 p-6 px-6 md:px-20 h-full rounded-2xl pb-10 inner-shadow">
			<div class="flex items-center flex-col md:flex-row">
				<span class="text-xl text-gray-500 py-4">传感器数据列表</span>
			</div>
			<table-template :column="pointCol"
			                :header="pointHeader"
			                :is-loading="pointLoading"
			                :page-row-number="16"/>
		</div>
		
		
		<!-- 报警列表 -->
		<div class="justify-between items-center bg-theme-1-color-6 p-6 px-6 md:px-20 h-full rounded-2xl pb-10 inner-shadow">
			<div class="flex items-center">
				<h1 class="text-4xl mb-6">报警</h1>
				<el-button class="ml-auto" round @click="clearAlarm">
					清空报警
				</el-button>
			</div>
			<div class="mb-12 overflow-auto">
				<ElementTable :sn="sn" :table-data="alarmTableData" :header-data="alarmHeaderData" v-if="alarmLoading"/>
			</div>
		</div>
	</div>
</template>


<script setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {
	elementTableDataConversion,
	getTimeRange,
	selectProcessData,
	showMessage,
	transposeMatrix
} from "@/utils/tools-functions.js";
import TableTemplate from "@/components/TableTemplate.vue";
import {
	postAlarmLog,
	postClearAlarm,
	postDeviceFlow, postHistoryData,
	postRealData,
	postSetTime,
	postSingleSwitch
} from "@/server/request-apis.js";
import ThLineChart from "@/components/echarts/RealTimeLineChart.vue";
import ApGaugeChart from "@/components/echarts/ApGaugeChart.vue";
import Cookies from "js-cookie";
import ElementTable from "@/components/ElementAlarmTable.vue";
import {batteryLevelColors} from "@/utils/preset-data.js";
import DataLoading from "@/components/DataLoading.vue";
import HistoryChart from "@/components/echarts/HistoryChart.vue";
import {cascaderProps} from "@/utils/preset-data.js";
import TimeDatePicker from "@/components/ElementTimeDatePicker.vue";


/*************************************************************
 *                   全局状态信息
 *  ----------------------------------------------------------
 *  - 一些关于SN码的路由，用户名，以及一些从本地存储中获取的全局变量（例如
 *    数据点的汉字翻译、单位、电池数据；
 *
 *************************************************************/

// 项目路由
const route = useRoute()

// 用户名
const userName = Cookies.get('platform_user');

// SN码
const sn = ref(route.params.id);

// 设备是否连接
const isConnectState = ref(false);

// 温湿度图表数据
const lineChartData = ref([]);

// 气压图表数据
const apValue = ref([]);

// SN码
const currentTime = ref('');

// 实时数据的获取状态
const isLoading = ref(false);

// 本地的设备数据
const SCGData = JSON.parse(localStorage.getItem('auth')).SCGData;

// 单通道数据点中文名数组
const singlePointNameList = JSON.parse(localStorage.getItem('single_data_point'));

// 单通道数据点单位数组
const singlePointUnitList = JSON.parse(localStorage.getItem('single_data_unit'));

// 电池电量
const batteryLevel = ref(null);

// 找到SN码在SCGData中的索引index
let index = SCGData[0].indexOf(sn.value);

// 使用索引来找到对应的设备名
const equipmentName = ref(SCGData[1][index]);

/*************************************************************
 *                   历史数据
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - 使用和历史界面一样的接口,不包括设备选择
 *
 *************************************************************/
// 时间日期选择器绑定的值
const timeRange = ref(getTimeRange(3))

// 存储接收到的历史数据
const historyData = ref([]);

// 历史数据的加载状态
const historyLoading = ref(false);

// 存储X轴的数据
const xAxisData = ref([]);

// 单通道数据的option
const singleDeviceOption = ref(JSON.parse(localStorage.getItem("single_history_option")));

// 设备历史选择器
const deviceHistorSelected = ref([["sensors", "co2_conc_during_meas"]])

/**
 * 获取历史数据
 */
const getHistoryData = async () => {
	historyLoading.value = true;
	try {
		console.log(deviceHistorSelected.value)
		let result = selectProcessData(deviceHistorSelected.value)
		const res = await postHistoryData(sn.value, result.typeDataList, result.varDataList, timeRange.value)
		historyData.value = res.data.history_data;
		xAxisData.value = res.data.timest;
	} catch (e){
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
/*************************************************************
 *                   重要数据展示表
 *
 *************************************************************/
//重要气压和温湿度数据
const descriptionsList = ref([])

// 运行步骤
const runStepsNameList = ref([
	'箱子关闭，风扇开启',
	'盖子正在关闭',
	'风扇搅拌',
	'读二氧化碳',
	'抽真空',
	'箱子打开,风扇关闭',
	'等待下一循环',
])

const flowCardState = ['正常', '销号', '停机', '停机']

// 手机流量
const flowData = ref({})

const runStepsIndex = ref(null)

// 用于适配用户信息的表格手机端的显示模式
const columnCount = computed(() => {
	return window.innerWidth < 768 ? 1 : 4;
})

const getDeviceFlow = async () => {
	try {
		const res = await postDeviceFlow(sn.value)
		flowData.value = res.data.flow.data
	} catch (e) {
		console.log(e)
	}
}

/*************************************************************
 *                   单通道通信
 *  ----------------------------------------------------------
 *  - 一些关于SN码的路由，用户名，以及一些从本地存储中获取的全局变量（例如
 *    数据点的汉字翻译、单位、电池数据；
 *
 *************************************************************/

// 数据点数据的加载状态
const pointLoading = ref(false);

// 数据点列表的表头
const pointHeader = ref(['传感器', '值', '单位'])

// 数据点表格列的内容
const pointCol = ref([])


const getRealData = async () => {
	try {
		const res = await postRealData(sn.value);
		if (res.data.data_big.length > 0) {
			isConnectState.value = false;
			let all_data = res.data.data_big;
			
			//赋值给开关变量
			if (!isManualSwitch.value) {
				await setInitSwitchState(all_data[32])
				isManualSwitch.value = true;
				// 20秒后重置手动操作标志
				setTimeout(() => {
					isManualSwitch.value = false;
				}, 20000);
			}
			currentTime.value = res.data.timest;
			
			//表格数据
			pointCol.value = transposeMatrix([singlePointNameList, all_data, singlePointUnitList]);
			
			// 折线图
			lineChartData.value = [
				all_data[53].toFixed(2),
				all_data[54].toFixed(2),
				all_data[55].toFixed(2),
				all_data[56].toFixed(2),
				all_data[56].toFixed(5),
			];
			
			// 气压图表数据
			apValue.value = [all_data[42].toFixed(2), all_data[43].toFixed(2)];
			
			// 时间设置数据
			setTimeList.value = [
				all_data[5],
				all_data[8],
				all_data[10],
				all_data[11],
				all_data[15],
				all_data[18],
				all_data[20],
			];
			
			//重要气压和温湿度数据
			descriptionsList.value = [
				all_data[44],
				all_data[45],
				all_data[46],
				all_data[47],
				all_data[53],
				all_data[54],
				all_data[55],
				all_data[56],
			]
			// 电池电量
			batteryLevel.value = res.data.charged_v;
			
			// 运行步骤
			runStepsIndex.value = all_data[27] - 1;
		} else {
			isConnectState.value = true;
		}
	} catch (e) {
		console.error(e);
		showMessage('请求数据失败！')
	} finally {
		isLoading.value = true;
	}
}


/*************************************************************
 *                   开关控制
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - 单通道的五个开关（包括了手动开关）都是一个16进制数值提供的；
 *
 *  使用:
 *  ----------------------------------------------------------
 *  - 五个开关有对应的加载动画状态
 *
 *  注意:
 *  ----------------------------------------------------------
 *  - 开关单通道通信处获取数据，接受刷新，但在触发按钮后对开关状态的刷新停
 *    止一段时间；
 *
 *************************************************************/
// 开关数据列表
const switchList = ref([])

// 开关名列表
const switchNameList = ref(['自动模式', '传感器', '盖子关', '风扇', '气泵'])

// 开关加载动画显示状态
const switchLoadingList = ref(Array(switchList.value.length).fill(false)); // 初始加载状态

// 设置时间数值
const setTimeList = ref([])

// 设置时间的选项名
const setTimeNameList = ref(['转速', 'SD卡1写延时', 'SD卡2写延时', '熄屏时间', '开关箱时间', '读二氧化碳时间', '不同箱循环时间'])

// 开关加载动画显示状态
const setTimeLoadingList = ref(Array(setTimeList.value.length).fill(false));

// 时间控制按钮的是否可控状态
const setTimeManualDisabled = ref(true);

// 是否手动控制过设备
const isManualSwitch = ref(false)

// 时间弹窗
const dialogVisible = ref(false);

// 手动开关的绑定状态对其他开关是否可选施加影响
const isManual = computed(() => {
	// 无论什么状态下手动开关的状态都是可以被控制的
	return switchList.value[0] === 1 ? [false, false, false, false, false] : [false, true, true, true, true]
})

// 设置时间控制弹窗在手机端和电脑端的宽度占比
const dialogWidth = computed(() => {
	return window.innerWidth < 768 ? '90%' : '30%';
});

// 开关数据
async function setInitSwitchState(decimal) {
	if (decimal < 0 || decimal > 31) {
		throw new Error('请输入0到15之间的正整数');
	}
	// 将十进制转为二进制，并用padStart补齐4位
	const binaryString = decimal.toString(2).padStart(5, '0');
	switchList.value = binaryString.split('').map(Number);
}

const switchTrigger = async (index) => {
	// 打开开关加载动画
	switchLoadingList.value[index] = true;
	
	// 如果手动状态开关是打开的，就允许其他开关被触发
	setTimeManualDisabled.value = switchList.value[0] !== 1;
	if(switchList.value[0] === 1){
		isManual.value = [false, false, false, false, false];
		switchNameList.value[0] = '手动模式';
	} else {
		isManual.value = [false, true, true, true, true]
		switchNameList.value[0] = '自动模式';
	}
	
	let strValue = '';
	for (let item of switchList.value) {
		strValue += item.toString()
	}
	try {
		const res = await postSingleSwitch(userName, sn.value, strValue, '0a')
		if (res.data.state) {
			switchList.value[index] = switchList.value[index] === 1 ? 1 : 0; // 如果 res.data.state 为 true，则切换状态
			switchLoadingList.value[index] = false; // 动画停止加载
			showMessage('【' + switchNameList.value[index] + '】开关执行成功', 'success');
		} else {
			switchList.value[index] = switchList.value[index] === 1 ? 0 : 1; // 如果 res.data.state 为 true，则切换状态
			switchLoadingList.value[index] = false; // 动画停止加载
			showMessage('【' + switchNameList.value[index] + '】开关执行失败：' + res.data.message, 'error')
		}
	} catch (e) {
		console.error(e);
	} finally {
		// await getRealData()
	}
}

// 设置时间（类似开关)
const setTimeValue = async (value, index) => {
	setTimeLoadingList.value[index] = true; // 开始加载动画
	const res = await postSetTime(value, index, sn.value)
	if (res.data.state) {
		setTimeLoadingList.value[index] = false; // 动画停止加载
		showMessage('【' + setTimeList.value[index] + '】设置时间成功', 'success')
	} else {
		setTimeLoadingList.value[index] = false; // 动画停止加载
		showMessage('【' + setTimeList.value[index] + '】设置时间失败', 'error')
	}
}

/*************************************************************
 *                   报警数据
 *  ----------------------------------------------------------
 *  - 获取报警的数据；
 *    设置报警已读；
 *
 *************************************************************/

// 报警加载状态
const alarmLoading = ref(false);

// 报警表格的表头Key值
const alarmHeaderList = ref(["alarmEquipment", "alarmContent", "alarmTime", "alarmState"]);

// 表格用的表头属性
const alarmHeaderData = ref([
	{property: 'alarmEquipment', label: '报警设备'},
	{property: 'alarmContent', label: '报警内容'},
	{property: 'alarmTime', label: '时间'},
	{property: 'alarmState', label: '状态'},
]);

//报警表格数据
const alarmTableData = ref([]);

/**
 * 获取全部报警
 */
const getAlarmLog = async () => {
	alarmLoading.value = false;
	try {
		const res = await postAlarmLog(sn.value);
		let tempAlarmData = transposeMatrix(res.data.value);
		tempAlarmData[2] = tempAlarmData[2].map(item => item.replace('T', ' '));
		alarmTableData.value = elementTableDataConversion(alarmHeaderList.value, transposeMatrix(tempAlarmData));
	} catch (e) {
		console.log(e)
	} finally {
		alarmLoading.value = true;
	}
}

/**
 * 清除报警
 */
const clearAlarm = async () => {
	try {
		await postClearAlarm(sn.value);
	} catch (e) {
		console.log(e)
	} finally {
		await getAlarmLog();
		showMessage('日志已清空', 'success')
	}
}


/*************************************************************
 *                   渲染与卸载
 *  ----------------------------------------------------------
 *  - 控制实时数据的轮询间隔，获取到数据之后进行初始刷新；
 *    切换或关闭界面之后销毁轮询；
 *    在切换设备界面的时候根据不同的SN码重新刷新界面
 *
 *************************************************************/

let intervalId; // 设置循环对象，切换界面的时候关闭这个界面的轮询

onMounted(async () => {
	await getAlarmLog();
	await getRealData();
	await getDeviceFlow()
	await getHistoryData();
	intervalId = setInterval(() => {
		getRealData();
	}, 20000);
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
		isManualSwitch.value = false;
		alarmTableData.value = []
		descriptionsList.value = [];
		let index = SCGData[0].indexOf(sn.value);
		getRealData();
		getAlarmLog();
		getDeviceFlow();
		getHistoryData();
		equipmentName.value = ref(SCGData[1][index]);
		pointCol.value = [];
		lineChartData.value = [];
	}
)
</script>

<style scoped>

</style>