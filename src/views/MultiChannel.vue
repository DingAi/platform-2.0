<template>
	<div class="space-y-6 text-center size-full">
		<!-- 顶栏 -->
		<div class="flex flex-col md:flex-row justify-between items-center bg-theme-1-color-6 p-4 h-auto rounded-2xl inner-shadow smiley-sans">
			<span class="text-xl text-theme-1-color-8 px-2 mt-2 md:mt-0 font-bold">{{ deviceName }}</span>
			<span class="text-xl text-white bg-pink-400 rounded-xl px-2 mt-2 md:mt-0">{{ sn }}</span>
		</div>
		
		<!-- 电池与运行状态栏-->
		<div class="flex flex-col md:flex-row justify-between items-center p-2 smiley-sans" v-show="isConnectState">
			<div class="flex flex-row w-auto items-center">
				<span class="text-xl text-gray-500">电池电量： </span>
				<div class="w-32">
					<el-progress
						:text-inside="true"
						:percentage="batteryLevel"
						:stroke-width="25"
						:color="batteryLevelColors"
						striped-flow
						striped/>
				</div>
			</div>
			<span class="text-xl text-theme-1-color-4 px-2 mt-2 md:mt-0 font-bold">
				运行步骤：{{ runStepsNameList[runStepsIndex] }}
			</span>
		</div>
		<div class="flex flex-col md:flex-row justify-between items-center p-2 smiley-sans" v-show="isConnectState">
			<div class="flex flex-row w-auto items-center">
				<span class="text-xl text-gray-500">流量卡： </span>
				<span class="text-xl text-gray-500">{{ flowData }}</span>
			</div>
		</div>
		
		<!-- 设备离线内容 -->
		<div class="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 h-screen
			md:h-rem-36 rounded-2xl p-4" v-show="!isConnectState">
			<!-- 加载状态 -->
<!--			<div class="flex flex-col justify-center items-center py-4 space-y-4 h-full">-->
<!--				<DataLoading/>-->
<!--			</div>-->
			<span class="text-8xl text-[#757de8]">设备离线</span>
		</div>
		
		<!-- 铝牌电磁阀样式 -->
		<div class="hidden md:flex flex-row justify-center items-center md:h-60 rounded-2xl space-x-8" v-show="isConnectState">
			<div class="w-1/3 h-full grid grid-cols-3 gap-2 py-6" >
				<div class="flex flex-col items-center justify-center" v-for="item in [18,19,20,21,22,23]">
					<span class="text-pink-600 font-light">{{ multiPointNameList[item] }}</span>
					<span class="text-gray-500 font-light">{{ pageListData[item] }} {{multiPointUnit[item]}}</span>
				</div>
			</div>
			<div class="w-2/3 flex flex-row justify-center items-center rounded-2xl border-2 py-6 space-x-6 shadow">
				<div class="flex flex-col space-y-4">
					<span class="text-white rounded px-2">&ncap;</span>
					<div class="flex w-20 h-12 justify-center items-center">
						<span class="text-white bg-indigo-400 rounded px-2">进气口：</span>
					</div>
					
					<div class="flex w-20 h-12 justify-center items-center">
						<span class="text-white bg-indigo-400 rounded px-2">出气进：</span>
					</div>
				
				</div>
				<div class="flex flex-col space-y-4" v-for="(valve, index) in aluminumPlateStateList" :key="index">
					<span class="bg-indigo-400 text-white rounded-full">{{ index + 1 }}</span>
					<div
						class="w-12 h-12 rounded-full bg-gray-300 transition-colors duration-300 border-8 inner-shadow"
						v-for="(state, subIndex) in valve"
						:key="subIndex"
						:class="{ 'bg-indigo-500 border-[#dedeff]': state === 1 }">
					</div>
				</div>
			</div>
		</div>
		
		<!--温度与气压数据-->
		<div class="block h-rem-40 md:h-40 sm:h-24 xs:h-20 my-4" v-show="isConnectState">
			<el-descriptions title="温度与气压数据" size="large" border :column="columnCount">
				<el-descriptions-item
					v-for="item in [1,3,5,7,9,11]"
					:key="item"
					:label="multiPointNameList[item + 4]"
				>
					<el-tag>{{ pageListData[item + 4] }} {{ multiPointUnit[item + 4] }}</el-tag>
				</el-descriptions-item>
				<el-descriptions-item
					v-for="item in [1,3,5,7,9,11]"
					:key="item"
					:label="multiPointNameList[item + 5]"
				>
					<el-tag type="info">{{ pageListData[item + 5] }} {{ multiPointUnit[item + 5] }}</el-tag>
				</el-descriptions-item>
			</el-descriptions>
		</div>
		
		<!-- 开关群组 -->
		<div class="flex flex-row switch-group-h max-w-full rounded-2xl p-4 bg-theme-1-color-6 overflow-x-auto
		space-x-4 inner-shadow" v-show="isConnectState">
			<div class="flex flex-col h-full w-60 rounded-2xl p-4 shadow bg-gray-300">
				<div class="flex flex-row h-1/6 justify-center items-center">
					<span class="bg-pink-400 text-white rounded px-2">主站</span>
				</div>
				<div class="flex flex-col h-5/6 w-52 rounded-2xl inner-shadow bg-white">
					<div class="flex flex-row justify-center items-center h-1/3 w-full p-2">
						<span class="text-sm p-2 w-30 font-bold">手动开关 - </span>
						<el-switch
							v-model="masterSwitchDataList[0]"
							:active-value="true"
							:inactive-value="false"
							size="large"
							:loading="masterLoadingList[0]"
							@change="masterSwitchTrigger($event, 0)"
						>
							<template #active-action>
								<span class="custom-active-action">T</span>
							</template>
							<template #inactive-action>
								<span class="custom-inactive-action">F</span>
							</template>
						</el-switch>
					</div>
					<div class="flex flex-row justify-center items-center h-1/3 w-full p-2">
						<span class="text-sm p-2 w-30 font-bold">气泵 - </span>
						<el-switch
							v-model="masterSwitchDataList[1]"
							:active-value="true"
							:inactive-value="false"
							size="large"
							:loading="masterLoadingList[1]"
							:disabled="!masterSwitchDataList[0]"
							@change="masterSwitchTrigger($event, 1)"
						>
							<template #active-action>
								<span class="custom-active-action">T</span>
							</template>
							<template #inactive-action>
								<span class="custom-inactive-action">F</span>
							</template>
						</el-switch>
					</div>
					<div class="flex flex-row justify-center items-center h-1/3 w-full p-1">
						<div class="rounded overflow-hidden flex items-center justify-center p-2">
							<el-button type="primary" @click="dialogVisible = true" round>时间设置</el-button>
						</div>
						
						<!-- 时间弹窗 -->
						<el-dialog v-model="dialogVisible" title="时间状态" :width="dialogWidth">
							<div class="flex flex-col w-full space-y-4 justify-center items-center mb-12 overflow-auto bg-theme-1-color-6 p-4">
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
										           @click="setTimeValue(setTimeList[index], index+1)"
										           class="w-full"
										           round
										           :loading="setTimeLoadingList[index]">
											设置
										</el-button>
									</div>
								</div>
							</div>
						</el-dialog>
					</div>
				</div>
			</div>
			<div v-for="(deviceItem, deviceIndex) in 10" :key="deviceIndex" class="flex flex-col bg-white h-full w-60
			shadow rounded-2xl p-4">
				<div class="flex flex-row h-1/6 justify-center items-center">
					<span class="bg-indigo-400 text-white rounded px-2">{{ deviceNameList[deviceItem] }}</span>
				</div>
				<div class="flex flex-col h-5/6 rounded-2xl inner-shadow bg-white">
					<div v-for="(switchItem, switchIndex) in switchNameList" :key="switchIndex" class="flex flex-row
					justify-center items-center w-52 h-1/5 p-2">
						<span class="text-sm p-2 text-whit w-20 font-bold">{{ switchItem }} - </span>
						<el-switch
							v-model="switchStateList[deviceIndex][switchIndex]"
							:active-value="1"
							:inactive-value="0"
							size="large"
							:loading="slaveLoadingList[deviceIndex][switchIndex]"
							@change="switchTrigger(deviceIndex,switchIndex)"
							:disabled="!masterSwitchDataList[0]"
						>
							<template #active-action>
								<span class="custom-active-action">T</span>
							</template>
							<template #inactive-action>
								<span class="custom-inactive-action">F</span>
							</template>
						</el-switch>
					</div>
				</div>
			</div>
		</div>
		
		<!--页面数据切换导航-->
		<nav class="flex justify-start md:justify-center text-xl smiley-sans">
			<!--手机端的汉堡菜单按钮-->
			<button class="md:hidden p-2 text-gray-600 focus:outline-none" @click="toggleMenu">
				<el-icon>
					<component :is="menuOpen ? 'Expand' : 'Fold'"/>
				</el-icon>
			</button>
			
			<div class="md:flex md:items-center md:justify-around md:p-2 border-gray-300"
			     :class="{'hidden': !menuOpen, 'flex': menuOpen}">
				<button
					v-for="(item, index) in deviceNameList"
					:key="index"
					:class="['rounded-lg px-4 py-2 mb-2 md:mb-0 transition-colors duration-300 font-bold',
                    deviceIndex === index ? 'text-pink-500' : 'hover:text-indigo-500 text-indigo-300']"
					@click="selectItem(index); closeMenu">
					{{ item }}
				</button>
			</div>
		</nav>
		
		
		<!-- 主内容 -->
		<div class="flex flex-col justify-between items-center space-y-4 md:space-y-0 md:space-x-4 h-screen
			md:h-96 rounded-2xl bg-theme-1-color-6 inner-shadow p-4">
			<div class="flex flex-col h-1/4 md:flex-row justify-between items-stretch py-2 md:space-y-0 md:space-x-2">
				<!-- 设备选择器 -->
				<div class="flex items-center justify-center w-full md:w-2/5 rounded-xl p-4">
					<el-cascader
						v-model="selectedHistoryValue"
						:options="selectedHistoryOption"
						collapse-tags
						collapse-tags-tooltip
						:props="cascaderProps"
						placeholder="请选择"
						class="w-full"
					/>
				</div>
				
				<!-- 时间选择器 -->
				<div class="flex items-center justify-center w-full md:w-3/5 rounded-xl p-4">
					<TimeDatePicker v-model="timeRange"/>
				</div>
				
				<!-- 获取历史数据按钮 -->
				<div class="flex flex-col items-center justify-center md:flex-row w-full md:w-1/5 rounded-xl ">
					<div class="p-2">
						<el-button type="primary" @click="getHistoryData" round>加载数据</el-button>
					</div>
					<div class="p-2">
						<el-tooltip content="提醒:大量数据建议使用数据下载界面"
						            placement="bottom"
						            effect="customized">
							<el-button v-if="!historyLoading" type="primary" @click="historyDataDownload" plain round>
								数据下载
							</el-button>
						</el-tooltip>
					</div>
				</div>
			</div>
			<div class="h-3/4 w-full">
				<div v-if="historyLoading" class="flex flex-col justify-center items-center py-4 space-y-4 h-full">
					<DataLoading/>
				</div>
				<HistoryChart v-else
				              :historyData="historyData"
				              :xAxisData="xAxisData"
				              :historyLoading="historyLoading"/>
			</div>
		</div>
		
		
		<!-- 传感器数据列表 -->
		<div class="justify-between items-center bg-theme-1-color-6 p-6 pt-12 md:px-20 h-full rounded-2xl pb-10 inner-shadow">
			<div class="flex items-center flex-col md:flex-row">
				<h1 class="text-2xl md:text-4xl mb-6">传感器数据列表</h1>
			</div>
			<TableTemplate :column="sensorCol"
			               :header="sensorHeader"
			               :is-loading="sensorLoading"
			               :page-row-number="30"/>
		</div>
		
		<!-- 报警列表 -->
		<div class="justify-between items-center bg-theme-1-color-6 p-6 px-6 md:px-20 h-full rounded-2xl pb-10 inner-shadow">
			<div class="flex flex-col md:flex-row items-center">
				<h1 class="text-4xl mb-6">报警</h1>
				<el-button class="m-auto md:ml-auto" round @click="clearAlarm">
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
import {elementTableDataConversion, showMessage, transposeMatrix} from "@/utils/tools-functions.js";
import TableTemplate from "@/components/TableTemplate.vue";
import {
	postAlarmLog,
	postClearAlarm, postDeviceFlow,
	postHistoryData,
	postHistoryDataDownload,
	postMultiSwitch,
	postRealData,
	postSetTime
} from "@/server/request-apis.js";
import ElementTable from "@/components/ElementAlarmTable.vue";
import TimeDatePicker from "@/components/ElementTimeDatePicker.vue";
import HistoryChart from "@/components/echarts/HistoryChart.vue";
import DataLoading from "@/components/DataLoading.vue";
import _ from "lodash";
import Cookies from "js-cookie";
import {batteryLevelColors} from "@/utils/preset-data.js";

const route = useRoute();

/*************************************************************
 *                   全局状态信息
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - 一些关于SN码的路由，以及一些从本地存储中获取的全局变量（例如数据点的
 *    汉字翻译、单位、历史选择器的Option
 *
 *************************************************************/

// SN码路由
const sn = ref(route.params.id);

// 设备通信连接状态
const isConnectState = ref(false)

// 从本地数据获取到用户的SN码和设备名
const SCGData = JSON.parse(localStorage.getItem('auth')).SCGData;

// 变量名列表
const multiPointNameList = JSON.parse(localStorage.getItem('multi_data_point'));

// 多通道历史多选结构
const multiHistoryOption = JSON.parse(localStorage.getItem('multi_history_option'));

// 变量表单位
const multiPointUnit = JSON.parse(localStorage.getItem('multi_data_unit'));

// 找到SN码在SCGData中的索引index
let index = SCGData[0].indexOf(sn.value);

// 使用索引来找到对应的设备名
const deviceName = ref(SCGData[1][index]);

// 传感器的数据是否加载成功
const sensorLoading = ref(false);

// 电池电量
const batteryLevel = ref(null);


/*************************************************************
 *                   多通道实时数据通信
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - 从实时数据接口获取数据，这个界面的核心数据源；
 *    在获取到数据之后对接铝排、开关群、数据点列表的状态；
 *
 *  注意:
 *  ----------------------------------------------------------
 *  - 其中有很多异步关系，尤其是开关状态和实时数据会出现差异的时候
 *
 *************************************************************/

// 页内导航中要显示的不同的列表数据
const pageListData = ref([]);

// 数据点位列表的表头
const sensorHeader = ref(['传感器', '值', '单位'])

// 数据点位列表的值，一个二维数组
const sensorCol = ref([])

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

// 当前运行到哪一步
const runStepsIndex = ref(null)

// 手机流量
const flowData = ref({})

/**
 * 接收多通道的实时数据
 */
const getRealData = async () => {
	try {
		const res = await postRealData(sn.value);
		if (res.data.data_big.length > 0){
			// 时间设置数据赋值（slice是左闭右开的）
			setTimeList.value = res.data.data_big.slice(42, 48);
			
			// 铝牌电磁阀状态刷新（slice是左闭右开的）
			aluminumPlateStateFlushed(res.data.data_big.slice(56, 66));
			
			// 开关数据刷新
			let tempSubStationSwitchList = [];
			for (let i = 0; i < 10; i++) {
				tempSubStationSwitchList.push([
					res.data.data_big[68 + i*22 + 10],
					res.data.data_big[68 + i*22 + 11],
					res.data.data_big[68 + i*22 + 20],
				]);
			}
			switchStateList.value = switchStateFlushed(tempSubStationSwitchList);
			
			// 电池电量
			batteryLevel.value = res.data.charged_v;
			
			pageListData.value = res.data.data_big;
			// 根据点击主站还是从站切割数据
			const [start, end] = deviceIndex.value === 0 ? [0, 68] : [68 + (deviceIndex.value - 1) * 22, 68 + (deviceIndex.value * 22)];
			sensorCol.value = transposeMatrix([
				multiPointNameList.slice(start, end),
				res.data.data_big.slice(start, end),
				multiPointUnit.slice(start, end),
			]);
			
			// 运行步骤
			runStepsIndex.value = res.data.data_big[55] - 1;
			
			isConnectState.value = true;
		} else {
			isConnectState.value = false;
		}
	} catch (e) {
		console.log(e)
	}
}

const getDeviceFlow = async () => {
	try{
		const res = await postDeviceFlow(sn.value)
		flowData.value = res.data.flow
		console.log(res.data)
	} catch (e){
		console.log(e)
	}
}

/**
 * 铝排数据刷新
 * @param {list} aluminumPlateData ： 实时数据获取到的子站电磁阀开关数值数组
 */
const aluminumPlateStateFlushed = (aluminumPlateData) => {
	aluminumPlateStateList.value = aluminumPlateData.map(num => {
		// 将数字转换为二进制字符串，然后转换为数组
		const binaryString = num.toString(2).padStart(2, '0'); // 确保二进制字符串长度为2
		return Array.from(binaryString).map(bit => parseInt(bit)); // 转换为数字数组
	});
}

/**
 * 开关状态数据刷新
 * @param {*[]} tempSubStationSwitchList ： 10个子站除了电磁阀状态之外的开关状态二维数组
 */
const switchStateFlushed = (tempSubStationSwitchList) => {
	// 重新复制aluminumPlateStateList.value不能和其建立ref关联
	let topDataList = [...aluminumPlateStateList.value];
	if(topDataList.length > 0){
		for (let i = 0; i < 10; i++) {
			topDataList[i] = [...topDataList[i], ...tempSubStationSwitchList[i]];
		}
		return  topDataList;
	}
	
}


/*************************************************************
 *                   多通道导航栏数据
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - 用于在点击主站、子站按钮的时候其他的数据显示跟着变；
 *    主要依赖的是deviceIndex
 *
 *************************************************************/

// 设备索引
const deviceIndex = ref(0)
const deviceNameList = ref(['主站', ...Array.from({length: 10}, (_, index) => `${index + 1}`)]);
const menuOpen = ref(false);
const toggleMenu = () => {
	menuOpen.value = !menuOpen.value;
};
// 手机端的显示状态
const closeMenu = () => {
	menuOpen.value = false;
};

/**
 * 更新页内导航选中的索引
 * @param {list} index ： 选择的索引（0~10）
 */
const selectItem = (index) => {
	deviceIndex.value = index;
	// 点击按钮后马上更新数据
	getRealData()
	// 更新历史下拉选择的数据
	if (deviceIndex.value > 0) {
		selectedHistoryValue.value = ['s' + deviceIndex.value + '_measure_co2'];
	}
	// 再加载一次历史数据
	getHistoryData();
};

// 设置时间控制弹窗在手机端和电脑端的宽度占比
const dialogWidth = computed(() => {
	return window.innerWidth < 768 ? '90%' : '30%';
});


// 用于适配用户信息的表格手机端的显示模式
const columnCount = computed(() => {
	return window.innerWidth < 768 ? 1 : 6;
})


/*************************************************************
 *                   开关控制
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - 主要是开关控制，提供开关接口需要的数据，52个开关都需要开关动画，所以
 *    每个开关都配备了加载动画数组
 *
 *  使用:
 *  ----------------------------------------------------------
 *  - 主站的开关状态存储在masterSwitchDataList；
 *    子站的开关状态存储在switchStateList，是一个5*10的矩阵；
 *    手动开关的对接的是主站的开关状态存储在masterSwitchDataList[0]；
 *
 *  注意:
 *  ----------------------------------------------------------
 *  - 进气电磁阀和出气电磁阀使用的是一个索引，专门配置了逻辑
 *
 *************************************************************/

// 50个开关列表
const switchStateList = ref(_.times(10, () => _.fill(Array(5), 0)))

// 一个子站的开关列表
const switchNameList = ref(['进气电磁阀', '出气电磁阀', '盖子', '风扇', '传感器'])

// 开关站点关键字索引
const stationIndex = ['f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'fa'];

// 设置时间的值
const setTimeList = ref([])

// 设置时间的列表
const setTimeNameList = ref(['开关箱时间', '不同循环延时', '气体搅拌时间', '读二氧化碳时间', '抽真空时间', '同循环不同箱',])

// 设置时间的加载动画
const setTimeLoadingList = ref(Array(setTimeList.value.length).fill(false));

// 主站快的开关加载动画状态
const masterLoadingList = ref([false, false]);

// 主站的两个开关对应的数据
const masterSwitchDataList = ref([false, false]);

// 子站开关加载动画状态
const slaveLoadingList = ref(_.times(10, () => _.fill(Array(5), false)));

// 是否手动控制过设备
const isManualSwitch = ref(false);

// 弹窗
const dialogVisible = ref(false);

//铝牌数据值（二维数组）
const aluminumPlateStateList = ref([[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]])

const dialogShow = ref(false)


/**
 * 子站用开关函数
 * @param {list} i ： 主站、子站的索引
 * @param {list} j ： 开关的索引（0~4）
 */
const switchTrigger = async (i, j) => {
	let res;
	try {
		let switchIndex = ''; // 两个电磁阀的开关索引都是‘01’
		let switchValues = '';
		
		// j为0或1是为了处理电磁阀的数据特化
		if (j === 0 || j === 1) {
			switchIndex = '01'; // 两个电磁阀的开关索引都是‘01’
			// 生成二进制数据
			let binaryString = switchStateList.value[i][0].toString() + switchStateList.value[i][1].toString();
			switchValues = parseInt(binaryString, 2).toString().padStart(2, '0');
			// 对接铝板数据
			aluminumPlateStateList.value[i][j] = switchStateList.value[i][j];
		} else {
			switchIndex = '0' + j.toString();
			switchValues = '0' + switchStateList.value[i][j].toString();
		}
		// 本地存储的用户名
		const userName = Cookies.get('platform_user')
		
		// 发送请求
		res = await postMultiSwitch(userName, sn.value, stationIndex[i + 1], switchIndex, switchValues)
	} catch (e) {
		console.error(e);
	} finally {
		if (res.data.state) {
			// 如果 res.data.state 为 true，则切换状态
			switchStateList.value[i][j] = switchStateList.value[i][j] === 1 ? 1 : 0;
			slaveLoadingList.value[i][j] = false; // 动画停止加载
			showMessage('【' + switchNameList.value[i][j] + '】开关执行成功', 'success')
		} else {
			// 如果 res.data.state 为 true，则切换状态
			switchStateList.value[i][j] = switchStateList.value[i][j] === 1 ? 0 : 1;
			slaveLoadingList.value[i][j] = false; // 动画停止加载
			showMessage(deviceNameList[i] + '【' + switchNameList.value[j] + '】开关执行失败：' + res.data.message, 'error')
		}
		await getRealData()
	}
}

/**
 * 主站用开关函数
 * @param {list} newValue ： 开关触发后的状态值
 * @param {list} i ： 开关数组的索引（0、1）
 */
const masterSwitchTrigger = async (newValue, i) => {
	try {
		let masterSwitchNameList = ['手动开关', '气泵']
		let switchIndex = '0' + i.toString();
		let numState = newValue ? 1 : 0;
		const userName = Cookies.get('platform_user')
		const res = await postMultiSwitch(userName, sn.value, stationIndex[0], switchIndex, '0' + numState)
		
		if (res.data.state === 200) {
			// 如果 res.data.state 为 true，则切换状态
			masterSwitchDataList.value[i] = masterSwitchDataList.value[i] === 1;
			masterLoadingList.value[i] = false; // 动画停止加载
			showMessage('【' + switchNameList.value[i][j] + '】开关执行成功', 'success')
		} else {
			// 如果 res.data.state 为 true，则切换状态
			masterSwitchDataList.value[i] = masterSwitchDataList.value[i] !== 1;
			masterLoadingList.value[i] = false; // 动画停止加载
			showMessage(deviceNameList[i] + '【' + masterSwitchNameList[i] + '】开关执行失败：' + res.data.message, 'error')
		}
	} catch (e) {
		console.error(e);
	} finally {
		await getRealData()
	}
}

/**
 * 设置时间开关（类似开关)
 * @param {list} value ： 设置的值
 * @param {list} index ： 设置时间数组的索引
 */
const setTimeValue = async (value, index) => {
	setTimeLoadingList.value[index] = true; // 开始加载动画
	const res = await postSetTime(value, '0' + index.toString(), sn.value)
	if (res.data.state) {
		setTimeLoadingList.value[index] = false; // 动画停止加载
		showMessage('【' + setTimeList.value[index] + '】设置时间成功', 'success')
	} else {
		setTimeLoadingList.value[index] = false; // 动画停止加载
		showMessage('【' + setTimeList.value[index] + '】设置时间失败', 'error')
	}
}

/*************************************************************
 *                   历史数据
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - 使用和历史界面一样的接口；
 *    在选择主站或者从站的时候下拉的选择器显示不同的数据
 *
 *************************************************************/

// 匹配主站和各个子站的历史下拉选项
const selectedHistoryOption = computed(() => {
	return multiHistoryOption[deviceIndex.value].children;
})

// 历史选择器绑定的值
const selectedHistoryValue = ref(["time_co2"])

// 定义级联选择器的属性
const cascaderProps = {
	multiple: true,
	value: 'value', // 选项的值字段
	label: 'label', // 选项的标签字段
}

// const timeRange = ref(getTimeRange(3))
const timeRange = ref([
	"2024-11-01 09:39:23",
	"2024-11-01 14:39:23"
])

// 历史数据
const historyData = ref([]);

// 历史数据加载状态
const historyLoading = ref(false);

// X轴数据
const xAxisData = ref([]);

/**
 * 获取历史数据
 */
const getHistoryData = async () => {
	historyLoading.value = true;
	try {
		let typeData = deviceIndex.value > 0 ? [multiHistoryOption[deviceIndex.value].value] : ['master_station'];
		const res = await postHistoryData(sn.value, typeData, [selectedHistoryValue.value.flat()], timeRange.value)
		historyData.value = res.data.history_data;
		xAxisData.value = res.data.timest;
	} catch (e) {
		console.log(e);
		showMessage('获取历史数据错误');
	} finally {
		historyLoading.value = false;
	}
}

// 历史数据下载
const historyDataDownload = async () => {
	try {
		let typeData = deviceIndex.value > 0 ? [multiHistoryOption[deviceIndex.value].value] : ['master_station'];
		const res = await postHistoryDataDownload(sn.value, typeData, [selectedHistoryValue.value.flat()], timeRange.value)
		// 创建一个 Blob URL
		const url = window.URL.createObjectURL(new Blob([res.data]));
		// 创建一个链接元素
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'history_data.xlsx'); // 指定下载的文件名
		// 添加链接到 DOM
		document.body.appendChild(link);
		link.click(); // 模拟点击下载
		link.parentNode.removeChild(link); // 下载后移除链接
	} catch (e) {
		console.log(e);
		showMessage('下载错误');
	} finally {
		historyLoading.value = false;
	}
}


/*************************************************************
 *                   报警数据
 *
 *  简要描述:
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
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - 控制实时数据的轮询间隔，获取到数据之后进行初始刷新；
 *    切换或关闭界面之后销毁轮询；
 *    在切换设备界面的时候根据不同的SN码重新刷新界面
 *
 *************************************************************/

let intervalId;
onMounted(async () => {
	await getRealData();
	await getHistoryData()
	await getDeviceFlow()
	intervalId = setInterval(() => {
		getRealData();
	}, 20000)
});


// 切换界面后停止轮询
onBeforeUnmount(() => {
	clearInterval(intervalId);
});

// 监听路由参数变化，更新设备ID
watch(() => route.params.id, (newId) => {
	sn.value = newId
	let index = SCGData[0].indexOf(sn.value);
	getRealData()
	deviceName.value = ref(SCGData[1][index]);
	sensorCol.value = []
})
</script>

<style scoped>
.switch-group-h {
	height: 36rem;
}

</style>
