<template>
	<div class="space-y-2 size-full rounded-2xl">
		<div class="mx-auto p-4 flex flex-col md:flex-row">
			<div class="flex flex-col space-y-4 border-r pr-0 md:pr-4 smiley-sans">
				<button v-for="(folder, index) in folders" :key="index" @click="activeTab = index"
				        :class="['flex justify-between items-center px-4 py-2 text-left transition-transform duration-300 transform rounded',
						{
							'border-l-4 border-[#3F51B5]': activeTab === index,
							'hover:scale-105 hover:bg-[#dedeff]': true,
						},
					]">
					<svg t="1722495048429" class="icon mr-2" viewBox="0 0 1185 1024" p-id="2627" id="mx_n_1722495048430"
					     data-spm-anchor-id="a313x.search_index.0.i20.33843a817Ce7AX" width="200" height="200">
						<path
							d="M107.789474 0h319.218526A129.347368 129.347368 0 0 1 529.246316 50.176L840.757895 452.715789H0V107.789474a107.789474 107.789474 0 0 1 107.789474-107.789474z"
							fill="#3F51B5" p-id="2628" data-spm-anchor-id="a313x.search_index.0.i19.33843a817Ce7AX"
							class="selected"></path>
						<path
							d="M138.186105 183.242105h909.312c48.074105 0 65.482105 5.012211 82.997895 14.389895 17.623579 9.377684 31.420632 23.174737 40.798316 40.744421 9.377684 17.569684 14.389895 35.031579 14.389895 82.997895v564.439579c0 48.074105-5.012211 65.482105-14.389895 82.997894-9.377684 17.623579-23.174737 31.420632-40.744421 40.798316-17.569684 9.377684-35.031579 14.389895-82.997895 14.389895H138.132211c-48.074105 0-65.482105-5.012211-82.997895-14.389895a97.926737 97.926737 0 0 1-40.798316-40.744421C5.012211 951.242105 0 933.834105 0 885.867789V321.374316c0-48.074105 5.012211-65.482105 14.389895-82.997895 9.377684-17.623579 23.174737-31.420632 40.744421-40.798316 17.569684-9.377684 35.031579-14.389895 82.997895-14.389894z"
							fill="#757de8"
							p-id="2629"
							data-spm-anchor-id="a313x.search_index.0.i18.33843a817Ce7AX"
							class=""></path>
					</svg>
					<div class="flex flex-col">
						<span class="font-bold text-theme-1-color-1">{{ SCGData[1][index] }}</span>
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
							:class="['p-2 pl-6 pr-6 mb-2 flex justify-between items-center transition-transform duration-300 transform bg-theme-1-color-6 rounded',
                                    {
                                        'bg-[#dedeff]' : selectedFiles.includes(file),
                                        'hover:bg-[#dedeff]' : !selectedFiles.includes(file),
                                    },
                            ]">
							<span class="bg-pink-600 text-white p-1 rounded font-bold text-xs">
								{{ isMulti }}
							</span>
							<span class="ml-6">{{ file.name }}</span>
							<span class="ml-4 text-theme-1-color-2 text-sm font-bold">
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
						class="px-4 py-2 bg-theme-1-color-1 text-white rounded-xl hover:bg-theme-1-color-2"
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
import {postFilesDownload, postFilesList} from "@/server/request-apis.js";
import DataLoading from "@/components/DataLoading.vue";
import {showMessage} from "@/utils/tools-functions.js";
import Cookies from "js-cookie";

// 用户的设备数据，包括了SN码，设备名
const SCGData = JSON.parse(localStorage.getItem('auth')).SCGData;

// 界面是否显示数据，正在加载初始状态为加载中
const loading = ref(true);

// 文件夹名称
const folders = ref([]);

// 文件列表
const files = ref([]);

// 是否为多通道
const isMulti = computed(() => {
	let initial = folders.value[activeTab.value].charAt(0);
	return initial === 'A' ? '.xlsx' : '.zip'
})

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
			const userName = Cookies.get('platform_user')
			let folderName = folders.value[activeTab.value];
			let fileNames = selectedFiles.value.map((file) => file.name);
			showMessage('文件开始处理，请不要关闭浏览器', 'info')
			
			const res = await postFilesDownload(userName, folderName, fileNames);
			// 创建一个 URL
			const url = res.data.zip_url;
			console.log(url)
			// 创建一个临时的 <a> 标签
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute('download', 'output.zip'); // 指定下载的文件名
			
			// 添加链接到 DOM
			document.body.appendChild(link);
			link.click(); // 模拟点击下载
			link.parentNode.removeChild(link); // 下载后移除链接
		}
	} catch (error) {
		console.log(error);
	} finally {
	
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

.table-min {
	min-height: 40rem;
}

/* 手机端显示适配 */
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

.icon {
	width: 1.5rem;
	height: 1.5rem;
}
</style>
