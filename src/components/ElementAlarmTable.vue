<template>
	<el-table :data="paginatedData" style="width: 100%">
		<el-table-column type="selection" width="55" />
		<el-table-column :property="headerData[0].prototype" :label="headerData[0].label"/>
		<el-table-column :property="headerData[1].prototype" :label="headerData[1].label"/>
		<el-table-column :property="headerData[2].prototype" :label="headerData[2].label"/>
	</el-table>
	
	<el-pagination
		v-model:current-page="currentPage"
		:page-size="pageSize"
		:total="tableData.length"
		@current-change="handlePageChange"
		layout="total, prev, pager, next"
	/>
</template>

<script setup>
import { ref, computed } from 'vue'

const { tableData, headerData } = defineProps({ tableData: Array, headerData: Array })

const currentPage = ref(1)
const pageSize = ref(10) // 每页显示10条数据

// 计算当前页的数据
const paginatedData = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value
	const end = start + pageSize.value
	console.log(tableData.slice(start, end))
	return tableData.slice(start, end)
})

// 处理页码变化
const handlePageChange = (page) => {
	currentPage.value = page
}
</script>

<style scoped>
</style>
