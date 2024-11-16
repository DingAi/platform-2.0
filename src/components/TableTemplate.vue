<template>
	<div class="overflow-x-auto">
		<div v-if="isLoading" class="flex flex-col justify-center items-center py-4 space-y-4">
			<DataLoading/>
		</div>
		
		<div v-else class="table-min">
			<table class="min-w-full shadow-sm rounded-lg overflow-hidden bg-[#ffffff]">
				<thead class="bg-theme-1-color-1 text-white">
				<tr>
					<th class="px-6 py-3.5 text-left text-sm font-bold">Index</th>
					<th v-for="(head, index) in header" :key="index" class="px-6 py-3.5 text-left text-sm font-bold">
						{{ head }}
					</th>
					<th v-if="showButton > 0" class="px-6 py-3.5 text-left text-sm font-bold">
							操作
					</th>
				</tr>
				</thead>
				<tbody>
				<tr
					v-for="(row, rowIndex) in paginatedData"
					:key="rowIndex"
					class="border-t border-gray-500 hover:bg-[#f7f7f7] hover:text-pink-600 transition-colors duration-300 ease-in-out text-left"
				>
					<td class="px-6 py-3 text-sm font-bold text-theme-1-color-1">
						{{ (currentPage - 1) * pageSize + rowIndex + 1 }}
					</td>
					<td v-for="(cell, cellIndex) in row" :key="cellIndex"
					    :class="[columnStyles[cellIndex] || '','px-6 py-3 font-normal truncate']">
						{{ cell }}
					</td>
					<td v-if="showButton > 0" class="px-6 py-3 text-sm">
						<div class="flex space-x-2">
							<template v-for="(label, buttonIndex) in buttonLabels" :key="buttonIndex">
								<button
									v-if="buttonIndex < showButton"
									@click="handleButtonClick(rowIndex, buttonIndex)"
									class="bg-theme-1-color-1 text-white px-4 py-1 rounded hover:bg-[#757de8] transition duration-200"
								>
									{{ label }}
								</button>
							</template>
						</div>
					</td>
				</tr>
				<tr v-if="paginatedData.length === 0">
					<td :colspan="header.length + 1 + (showButton > 0 ? 1 : 0)"
					    class="px-6 py-4 text-center text-sm text-gray-500">
						暂无数据
					</td>
				</tr>
				</tbody>
			</table>
		</div>
		<div class="">
			<el-pagination
				v-model:currentPage="currentPage"
				:page-size="pageSize"
				:total="column.length"
				layout="prev, pager, next, jumper, ->, total"
				class="my-4"
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

const {
	header,
	column,
	isLoading,
	showButton,
	buttonLabels,
	onButtonClick,
	pageRowNumber,
	columnStyles,
	minTableHeight
} = defineProps({
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
		type: Number,
		default: 0, // 默认值为0，表示不显示按钮
	},
	buttonLabels: {
		type: Array,
		default: () => [],
	},
	onButtonClick: {
		type: Array,
		default: () => [],
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
		default: "37rem",
	},
});

// 当前页码
const currentPage = ref(1);

// 一页的数据条数
const pageSize = ref(pageRowNumber);

// 当前显示的页的数据
const paginatedData = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value;
	const end = start + pageSize.value;
	return column.slice(start, end);
});

const handlePageChange = (page) => {
	currentPage.value = page;
};

const handleButtonClick = (rowIndex, buttonIndex) => {
	const actualIndex = (currentPage.value - 1) * pageSize.value + rowIndex;
	if (onButtonClick[buttonIndex]) {
		onButtonClick[buttonIndex](actualIndex);
	}
};
</script>

<style scoped>
.table-min {
	min-height: 37rem;
}
</style>
