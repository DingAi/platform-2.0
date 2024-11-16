<template>
	<el-table
		:data="paginatedData"
		style="width: 100%"
		@select="handleSelectCheckbox"
		@select-all="handleAllSelectCheckbox"
	>
		<el-table-column type="selection" width="55" height="40"/>
		<el-table-column prop="alarmEquipment" :label="headerData[0].label"/>
		<el-table-column prop="alarmContent" :label="headerData[1].label"/>
		<el-table-column prop="alarmTime" :label="headerData[2].label"/>
		<el-table-column prop="alarmState" :label="headerData[3].label">
			<template #default="{ row }">
				<el-button
					@click="setAlreadyRead(sn, row)"
					:type="row.alarmState === 0 ? 'primary' : 'info'"
					size="small"
					round
					:disabled="row.alarmState === 1"
				>
					{{ row.alarmState === 0 ? '未读' : '已读' }}
				</el-button>
			</template>
		</el-table-column>
	</el-table>
	<div class="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start p-4">
		<div class="p-4">
			<el-button type="primary" plain @click="setSelectAlreadyRead(sn)">已读选中的报警</el-button>
		</div>
		<div class="p-4">
			<el-pagination
				v-model:current-page="currentPage"
				:page-size="pageSize"
				:total="tableData.length"
				@current-change="handlePageChange"
				layout="total, prev, pager, next"
			/>
		</div>
	</div>
	
</template>

<script setup>
import {ref, computed} from 'vue'
import {postAlarmAlreadyRead} from "@/server/request-apis.js";
import {showMessage} from "@/utils/tools-functions.js";

const {tableData, headerData} = defineProps({
	sn: String,
	tableData: Array,
	headerData: Array,
})

const selectedLineTime = ref([])
const currentPage = ref(1)
const pageSize = ref(10) // 每页显示10条数据

// 计算当前页的数据
const paginatedData = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value
	const end = start + pageSize.value
	return tableData.slice(start, end)
})

// 处理页码变化
const handlePageChange = (page) => {
	currentPage.value = page
}

const handleSelectCheckbox = (val) => {
	let selectLine = []
	for (let item of val) {
		selectLine.push(item.alarmTime)
	}
	console.log(selectLine)
	selectedLineTime.value = selectLine;
}

const handleAllSelectCheckbox = (val) => {
	let selectLine = []
	for (let item of val) {
		selectLine.push(item.alarmTime)
	}
	console.log(selectLine)
	selectedLineTime.value = selectLine;
}

const setAlreadyRead = (sn, row) => {
	try {
		const res = postAlarmAlreadyRead(sn, [row.alarmTime])
		row.alarmState = 1;
	} catch (e) {
		console.log(e);
		showMessage('设置报警已读错误');
	}
	
}

const setSelectAlreadyRead = (sn) => {
	// 获取选中的行
	const selectedRows = paginatedData.value.filter(row => selectedLineTime.value.includes(row.alarmTime));
	
	// 更新每一行的 alarmState 并记录 alarmTime
	const alarmTimesToUpdate = selectedRows.map(row => {
		row.alarmState = 1; // 将状态置为 1
		return row.alarmTime; // 记录 alarmTime
	});
	try {
		// 调用接口，传递需要更新的 alarmTime
		const res = postAlarmAlreadyRead(sn, alarmTimesToUpdate);
	} catch (e) {
		console.log(e);
		showMessage('设置报警已读错误');
	}
	
}
</script>

<style scoped>
</style>
