<template>
	<div class="space-y-5 text-center size-full">
		
		<!-- 顶栏 -->
		<div class="flex flex-col md:flex-row justify-between items-center bg-[#f5f5f5] p-4 h-auto rounded-2xl inner-shadow">
			<span class="text-xl text-[#5c5c5c] px-2 mt-2 md:mt-0 font-bold">{{ deviceName }}</span>
			<span class="text-xl text-white bg-pink-400 rounded-xl px-2 mt-2 md:mt-0">{{ sn }}</span>
		</div>
		
		<nav class="flex justify-start md:justify-center">
			<!--手机端的汉堡菜单按钮-->
			<button class="md:hidden p-2 text-gray-600 focus:outline-none" @click="toggleMenu">
				<el-icon>
					<component :is="menuOpen ? 'Expand' : 'Fold'"/>
				</el-icon>
			</button>
			
			<div class="md:flex md:items-center md:justify-around md:p-2 border-gray-300"
			     :class="{'hidden': !menuOpen, 'flex': menuOpen}">
				<button
					v-for="(item, index) in gasBoxes"
					:key="index"
					:class="['rounded-lg px-4 py-2 mb-2 md:mb-0 transition-colors duration-300 font-bold',
                    deviceIndex === index ? 'text-pink-500' : 'hover:text-indigo-500 text-indigo-300']"
					@click="selectItem(index); closeMenu">
					{{ item }}
				</button>
			</div>
		</nav>
		
		<!-- 铝牌电磁阀样式 -->
		<div class="hidden md:flex flex-row justify-center items-center md:h-60 rounded-2xl space-x-8">
			<div class="w-1/3 h-full grid grid-cols-3 gap-2 py-6">
				<div class="flex flex-col items-center justify-center" v-for="item in [18,19,20,21,22,23]">
					<span class="text-pink-600 font-bold">{{multiPointNameList[item]}}</span>
					<span class="text-gray-500 font-bold">{{ pageListData[item] }}V</span>
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
				<div class="flex flex-col space-y-4" v-for="(valve, index) in solenoidValves" :key="index">
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
		
		<div class="block h-36 md:h-36 sm:h-24 xs:h-20">
			<el-carousel :interval="8000" height="150px" type="card">
				<el-carousel-item v-for="item in [1,3,5,7,9,11]" :key="item">
					<div class="flex flex-row justify-center items-center p-4 rounded-2xl">
						<div class="flex flex-col items-center justify-center p-4">
							<span class="text-pink-400 font-bold">{{ multiPointNameList[item + 4] }}</span>
							<span class="text-gray-500 font-bold">{{ pageListData[item + 4] }}</span>
						</div>
						<div class="flex flex-col items-center justify-center p-4">
							<span class="text-blue-600 font-bold">{{ multiPointNameList[item + 5] }}</span>
							<span class="text-gray-500 font-bold">{{ pageListData[item + 5] }}</span>
						</div>
					</div>
					<h3 class="small justify-center">{{ item }}</h3>
				</el-carousel-item>
			</el-carousel>
<!--			<el-carousel :interval="8000" height="150px" type="card" v-else>-->
<!--				<el-carousel-item v-for="item in [70,93,116,139,162,185,208,231,254,277]" :key="item">-->
<!--					<div class="flex flex-row justify-center items-center p-4 rounded-2xl">-->
<!--						<div class="flex flex-col items-center justify-center p-4">-->
<!--							<span class="text-pink-600 font-bold">{{ multiPointNameList[item+4] }}</span>-->
<!--							<span class="text-gray-500 font-bold">{{ pageListData[item + 4] }}</span>-->
<!--						</div>-->
<!--						<div class="flex flex-col items-center justify-center p-4">-->
<!--							<span class="text-blue-600 font-bold">{{ multiPointNameList[item + 5] }}</span>-->
<!--							<span class="text-gray-500 font-bold">{{ pageListData[item + 5] }}</span>-->
<!--						</div>-->
<!--					</div>-->
<!--					<h3 class="small justify-center">{{ item }}</h3>-->
<!--				</el-carousel-item>-->
<!--			</el-carousel>-->
		</div>
		
		<!-- 通信异常内容 -->
		<div class="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 h-auto
			md:h-96 rounded-2xl bg-[#f5f5f5] inner-shadow p-4" v-show="!isConnectState">
			<span class="text-8xl text-[#757de8]">设备离线</span>
		</div>
		
		
		<!-- 主内容 -->
		<div class="flex flex-col justify-between items-center space-y-4 md:space-y-0 md:space-x-4 h-screen
			md:h-96 rounded-2xl bg-[#f5f5f5] inner-shadow p-4" v-show="isConnectState">
			<div class="flex flex-col h-1/4 md:flex-row justify-between items-stretch py-2 md:space-y-0 md:space-x-2">
				<!-- 设备选择器 -->
				<div class="flex items-center justify-center w-auto md:w-2/5 rounded-xl p-4">
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
				<div class="flex items-center justify-center w-full md:w-1/5 rounded-xl p-4">
					<el-button type="primary" @click="getHistoryData" class="w-full" round>加载数据</el-button>
					<el-button v-if="!historyLoading"
					           type="primary"
					           @click="historyDataDownload"
					           class="w-full"
					           plain
					           round>数据下载
					</el-button>
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
		<div class="justify-between items-center bg-[#f5f5f5] p-6 px-6 md:px-20 h-full rounded-2xl pb-10 inner-shadow">
			<div class="flex items-center flex-col md:flex-row">
				<h1 class="text-2xl md:text-4xl mb-6">传感器数据列表</h1>
			</div>
			<TableTemplate :column="sensorCol"
			               :header="sensorHeader"
			               :is-loading="sensorLoading"
			               :page-row-number="30"/>
		</div>
		
		<!-- 报警列表 -->
		<div class="justify-between items-center bg-[#f5f5f5] p-6 px-6 md:px-20 h-full rounded-2xl pb-10 inner-shadow">
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
	getMultiChannelDataTest,
	postAlarmLog,
	postClearAlarm,
	postHistoryData,
	postHistoryDataDownload
} from "@/server/request-apis.js";
import ElementTable from "@/components/ElementAlarmTable.vue";
import TimeDatePicker from "@/components/ElementTimeDatePicker.vue";
import HistoryChart from "@/components/echarts/HistoryChart.vue";
import DataLoading from "@/components/DataLoading.vue";

const route = useRoute();

// ====================================================================================
// 全局状态信息
// ====================================================================================
const sn = ref(route.params.id);
const isConnectState = ref(false) //设备通信连接状态
const SCGData = JSON.parse(localStorage.getItem('auth')).SCGData;
const multiPointNameList = JSON.parse(localStorage.getItem('multi_data_point'));
const multiHistoryOption = JSON.parse(localStorage.getItem('multi_history_option'));
let index = SCGData[0].indexOf(sn.value); // 找到SN码在SCGData中的索引index
const deviceName = ref(SCGData[1][index]); // 使用索引来找到对应的设备名
const sensorLoading = ref(false);
const pageListData = ref([]);


// 多通道导航栏数据
const deviceIndex = ref(0)
const gasBoxes = ref(['主站', '气体箱 01', '气体箱 02', '气体箱 03', '气体箱 04', '气体箱 05', '气体箱 06', '气体箱 07', '气体箱 08', '气体箱 09', '气体箱 10']);
const menuOpen = ref(false);
const toggleMenu = () => {
	menuOpen.value = !menuOpen.value;
};
// 手机端的显示状态
const closeMenu = () => {
	menuOpen.value = false;
};
const selectItem = (index) => {
	deviceIndex.value = index; // 更新选中的索引
	console.log(multiHistoryOption[deviceIndex.value])
	multiChannelDataTest()
	if (deviceIndex.value > 0){
		selectedHistoryValue.value = ['s' + deviceIndex.value + '_measure_co2'];
	}
	getHistoryData();
};

// ====================================================================================
// 历史数据
// ====================================================================================
const selectedHistoryOption = computed(() => {
	return multiHistoryOption[deviceIndex.value].children;
})

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
const historyData = ref([]);
const historyLoading = ref(false);
const xAxisData = ref([]);

//获取历史数据
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

const historyDataDownload = async () => {
	try {
		let typeData = selectProcessData(selectedValues2.value)
		const res = await postHistoryDataDownload(selectedValues1.value[0], typeData.categories, typeData.entries, timeRange.value);
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

// ====================================================================================
// 铝牌图像数据
// ====================================================================================
const solenoidValves = ref([[1, 1], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]])

// ====================================================================================
// 滚动数据
// ====================================================================================


// ====================================================================================
// 多通道通信表格数据
// ====================================================================================
const sensorHeader = ref(['传感器', '值'])
const sensorCol = ref([])
let pollingActive = true;  //是否接收到数据
const multiChannelDataTest = async () => {
	if (!pollingActive) return;
	try {
		const res = await getMultiChannelDataTest();
		pageListData.value = res.data.duo_ceshi;
		const [start, end] = deviceIndex.value === 0 ? [0, 71] : [71 + (deviceIndex.value - 1) * 23, 71 + (deviceIndex.value * 23)];
		sensorCol.value = transposeMatrix([
			multiPointNameList.slice(start, end),
			res.data.duo_ceshi.slice(start, end)
		]);
	} catch (e) {
		console.log(e)
	} finally {
		isConnectState.value = true;
	}
}

// ====================================================================================
// 报警数据
// ====================================================================================
const alarmLoading = ref(false);
const alarmHeaderList = ref(["alarmEquipment", "alarmContent", "alarmTime", "alarmState"]);
const alarmHeaderData = ref([
	{property: 'alarmEquipment', label: '报警设备'},
	{property: 'alarmContent', label: '报警内容'},
	{property: 'alarmTime', label: '时间'},
	{property: 'alarmState', label: '状态'},
]);
const alarmTableData = ref([]);
// 获取全部报警
const getAlarmLog = async () => {
	alarmLoading.value = false;
	try {
		const res = await postAlarmLog(sn.value);
		let tempAlarmData = transposeMatrix(res.data.value);
		tempAlarmData[2] = tempAlarmData[2].map(item => item.replace('T', ' '));
		alarmTableData.value = elementTableDataConversion(alarmHeaderList.value, transposeMatrix(tempAlarmData));
	} catch (e) {
		showMessage('报警数据获取失败')
		console.log(e)
	} finally {
		alarmLoading.value = true;
	}
}

// 清除报警
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

// ====================================================================================
// 渲染与卸载
// ====================================================================================
let intervalId;
onMounted(async () => {
	await multiChannelDataTest();
	await getHistoryData()
	intervalId = setInterval(() => {
		const randomInteger = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
		solenoidValves.value = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
		solenoidValves.value[randomInteger] = [1, 1];
		multiChannelDataTest();
	}, 5000)
});


// 切换界面后停止轮询
onBeforeUnmount(() => {
	clearInterval(intervalId);
});

// 监听路由参数变化，更新设备ID
watch(() => route.params.id, (newId) => {
	sn.value = newId
	let index = SCGData[0].indexOf(sn.value);
	multiChannelDataTest()
	deviceName.value = ref(SCGData[1][index]);
	sensorCol.value = []
})
</script>

<style scoped>
.el-carousel__item h3 {
	opacity: 0.75;
	color: #475669;
	line-height: 150px;
	margin: 0;
	text-align: center;
}

.el-carousel__item:nth-child(n) {
	border-radius: 1rem;
	background-color: #ffffff;
	box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
}

</style>
