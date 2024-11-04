<template>
	<div class="space-y-2 size-full rounded-2xl smiley-sans">
		<div class="mx-auto p-4 flex flex-col md:flex-row">
			<div class="flex flex-col space-y-4 border-r pr-0 md:pr-4">
				<button v-for="(folder, index) in folders" :key="index" @click="activeTab = index"
					:class="['flex justify-between items-center px-4 py-2 text-left transition-transform duration-300 transform rounded',
						{
							'border-l-4 border-[#3F51B5]': activeTab === index,
							'hover:scale-105 hover:bg-[#dedeff]': true,
						},
					]">
					<FolderSVG class="mr-2"/>
					<div class="flex flex-col">
						<span class="font-bold text-[#3F51B5]">{{ SCGData[1][index] }}</span>
						<span class="text-sm text-gray-500">{{ folder }}</span>
					</div>
				</button>
			</div>
			
			<div class="ml-0 md:ml-4 flex-1">
				<!-- 文件列表 -->
				<div class="table-min">
					<!-- 加载状态 -->
					<div v-if="loading" class="flex flex-col justify-center items-center py-4 space-y-4 h-full">
						<DataLoading/>
					</div>
					<ul v-else>
						<!-- 全选复选框 -->
						<li class="p-2 pl-6 pr-6 mb-2 flex justify-between items-center transition-transform duration-300 transform">
							<input
								type="checkbox"
								@change="toggleSelectAll"
								:checked="isPageSelected"
								class="checkbox ml-auto"
							/>
							<span class="ml-2">全选该页</span>
						</li>
						<li
							v-for="(file, fileIndex) in paginatedFiles"
							:key="fileIndex"
							:class="['p-2 pl-6 pr-6 mb-2 flex justify-between items-center transition-transform duration-300 transform bg-[#f5f5f5] rounded',
                                    {
                                        'bg-[#dedeff]' : selectedFiles.includes(file),
                                        'hover:bg-[#dedeff]' : !selectedFiles.includes(file),
                                    },
                            ]">
							<span class="bg-pink-600 text-white p-1 rounded font-bold text-xs">.CSV</span>
							<span class="ml-6">{{ file.name }}</span>
							<span class="ml-4 text-[#757de8] text-sm font-bold">
                                {{ file.size }}
                            </span>
							<input
								type="checkbox"
								:value="file"
								v-model="selectedFiles"
								class="checkbox ml-auto"
							/>
						</li>
					</ul>
				</div>
				
				<!-- 分页 -->
				<div class="pl-0 md:pl-20 pr-0 md:pr-20">
					<el-pagination
						v-model:currentPage="currentPage"
						:page-size="itemsPerPage"
						:total="currentFiles.length"
						layout="prev, pager, next, jumper, ->, total"
						class="mt-8 flex justify-center items-center space-x-3"
						@current-change="handlePageChange"
						:background="true"
					/>
				</div>
				
				<div class="flex justify-center items-center space-x-3 mt-4">
					<button
						@click="filesDownload"
						class="px-4 py-2 bg-[#3F51B5] text-white rounded-xl hover:bg-[#757de8]"
					>
						文件打包下载
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import FolderSVG from "@/components/FolderSVG.vue";
import {
	postFilesList,
	postDownloadIsComplete,
	postFilesDownload,
} from "@/server/request-apis.js";
import DataLoading from "@/components/DataLoading.vue";
import {showMessage} from "@/utils/tools-functions.js";


const SCGData = JSON.parse(localStorage.getItem('auth')).SCGData;

const loading = ref(true); // 初始状态为加载中

// 文件夹名称
const folders = ref([]);

// 文件列表
const files = ref([]);

const getFiles = async () => {
	try {
		const res = await postFilesList(SCGData[0]);
		folders.value = res.data.folders.sn;
		files.value = res.data.files;
	} catch (error) {
		console.error("加载文件列表失败:", error);
		showMessage('获取文件列表失败')
	} finally {
		loading.value = false; // 数据加载完成后设置为false
	}
};

const filesDownload = async () => {
	try {
		if (selectedFiles.value.length === 0) {
			showMessage('请选择要下载的文件', 'info')
		} else {
			let folderName = folders.value[activeTab.value];
			let fileNames = selectedFiles.value.map((file) => file.name);
			showMessage('文件开始下载，请不要关闭界面', 'info')
			
			const res = await postFilesDownload(folderName, fileNames);
			// 创建一个 URL 对象指向 Blob
			const url = window.URL.createObjectURL(new Blob([res.data]));
			
			// 创建一个临时的 <a> 标签
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "output.zip"); // 设置下载文件的名称
			
			// 触发点击事件下载文件
			document.body.appendChild(link);
			link.click();
			
			// 清理 URL 对象和 <a> 标签
			link.remove();
			window.URL.revokeObjectURL(url);
		}
	} catch (error) {
		console.log(error);
	} finally {
		if (selectedFiles.value.length > 0) {
			await postDownloadIsComplete(folders.value[activeTab.value]);
			showMessage('下载完成', 'success')
		}
	}
};

onMounted(() => {
	getFiles();
});

// 活动标签页索引
const activeTab = ref(0);
// 每页显示的文件数
const itemsPerPage = 18;
// 当前页码
const currentPage = ref(1);
// 选中的文件名列表
const selectedFiles = ref([]);
// 计算当前标签页的文件列表(用于全选)
const currentFiles = computed(() => files.value[activeTab.value] || []);

// 分页后的文件列表
const paginatedFiles = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage;
	return currentFiles.value.slice(start, start + itemsPerPage);
});
// 全选当前页的文件
const isPageSelected = computed(() =>
	paginatedFiles.value.every((file) => selectedFiles.value.includes(file)),
);

const toggleSelectAll = () => {
	if (isPageSelected.value) {
		// 如果当前页全选，取消选择
		paginatedFiles.value.forEach((file) => {
			const index = selectedFiles.value.indexOf(file);
			if (index !== -1) {
				selectedFiles.value.splice(index, 1);
			}
		});
	} else {
		// 否则，选中当前页的所有文件
		paginatedFiles.value.forEach((file) => {
			if (!selectedFiles.value.includes(file)) {
				selectedFiles.value.push(file);
			}
		});
	}
};

// 监听activeTab变化，重置currentPage并清空selectedFiles
watch(activeTab, () => {
	currentPage.value = 1;
	selectedFiles.value = []; // 清空选中的文件
});

// 处理分页的变化
const handlePageChange = (page) => {
	currentPage.value = page;
};
</script>

<style>
.checkbox {
	width: 20px;
	height: 20px;
	cursor: pointer;
	accent-color: #3F51B5; /* Custom checkbox color */
	margin-left: 8px; /* Space for checkbox */
}

.bg-gray-800 {
	background-color: #2d3748; /* Dark gray background */
}

.bg-gray-600 {
	background-color: #4a5568; /* Medium gray background */
}

.table-min {
	min-height: 40rem;
}

/* Mobile Styles */
@media (max-width: 767px) {
	.flex {
		flex-direction: column; /* Stack items vertically */
		margin-left: 0; /* Remove left margin */
	}
	
	.border-r {
		border-right: none; /* Remove border on mobile */
	}
	
	.p-4 {
		padding: 1rem; /* Reduce padding for mobile */
	}
	
	.ml-4 {
		margin-left: 0; /* Reset margin for mobile */
	}
	
	.checkbox {
		width: 18px; /* Smaller checkbox for mobile */
		height: 18px; /* Smaller checkbox for mobile */
	}
	
	.table-min {
		min-height: auto; /* Allow height to adjust on mobile */
	}
}
</style>
