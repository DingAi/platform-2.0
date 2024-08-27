<template>
	<div class="overflow-x-auto">
		<!-- 显示加载状态 -->
		<div
			v-if="isLoading"
			class="flex flex-col justify-center items-center py-4 space-y-4"
		>
			<DataLoading/>
		</div>
		
		<!-- 显示表格内容 -->
		<div v-else class="table-min">
			<table
				class="min-w-full text-gray-300 shadow-sm rounded-lg overflow-hidden bg-gray-900"
			>
				<thead class="bg-green-600 text-white">
				<tr>
					<!-- 添加序号列 -->
					<th class="px-6 py-3.5 text-left text-sm font-bold">Index</th>
					<th v-for="(head, index) in header" :key="index" class="px-6 py-3.5 text-left text-sm font-bold">
						{{ head }}
					</th>
					<th v-if="showButton" class="px-6 py-3.5 text-left text-sm font-bold">
						Actions
					</th>
				</tr>
				</thead>
				<tbody>
				<tr
					v-for="(row, rowIndex) in paginatedData" :key="rowIndex" class="border-t border-gray-500 hover:bg-slate-700
					hover:text-green-500 transition-colors duration-300 ease-in-out text-left">
					<!-- 渲染序号 -->
					<td class="px-6 py-3 text-sm">
						{{ (currentPage - 1) * pageSize + rowIndex + 1 }}
					</td>
					<td v-for="(cell, cellIndex) in row" :key="cellIndex"
					    :class="[columnStyles[cellIndex] || '','px-6 py-3 font-normal truncate',]">
						{{ cell }}
					</td>
					<td v-if="showButton" class="px-6 py-3 text-sm">
						<button
							@click="handleButtonClick(rowIndex)"
							class="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-500">
							{{ buttonLabel }}
						</button>
					</td>
				</tr>
				<tr v-if="paginatedData.length === 0">
					<td :colspan="header.length + 1 + (showButton ? 1 : 0)"
						class="px-6 py-4 text-center text-sm text-gray-500">
						No data available
					</td>
				</tr>
				</tbody>
			</table>
		</div>
		<div class="pl-20 pr-20">
			<!-- 分页 -->
			<el-pagination
				v-model:currentPage="currentPage"
				:page-size="pageSize"
				:total="column.length"
				layout="prev, pager, next, jumper, ->, total"
				class="mt-4"
				:background="true"
				@current-change="handlePageChange"
			/>
		</div>
	</div>
</template>

<script setup>
import {ref, computed} from "vue";
import {ElPagination} from "element-plus";
import DataLoading from "@/components/DataLoading.vue";

const props = defineProps({
	header: {
		type: Array,
		required: true,
	},
	column: {
		type: Array,
		required: true,
	},
	isLoading: {
		type: Boolean,
		default: true,
	},
	showButton: {
		type: Boolean,
		default: false,
	},
	buttonLabel: {
		type: String,
		default: "Action",
	},
	onButtonClick: {
		type: Function,
		default: null,
	},
	pageRowNumber: {
		type: Number,
		default: 10,
	},
	columnStyles: {
		type: Array,
		default: () => [],
	},
	minTableHeight: {
		type: String,
		default: "37rem", // 提供一个默认值
	},
});

const currentPage = ref(1);
const pageSize = ref(props.pageRowNumber); //每页的条数

const paginatedData = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value;
	const end = start + pageSize.value;
	return props.column.slice(start, end);
});

const handlePageChange = (page) => {
	currentPage.value = page;
};

const handleButtonClick = (rowIndex) => {
	const actualIndex = (currentPage.value - 1) * pageSize.value + rowIndex;
	if (props.onButtonClick) {
		props.onButtonClick(actualIndex);
	}
};
</script>

<style scoped>
.table-min {
	min-height: 37rem;
}
</style>
