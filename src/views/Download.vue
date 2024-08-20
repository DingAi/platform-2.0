<template>
    <div class="space-y-2 size-full">
        <div class="mx-auto p-4 flex text-white">
            <div class="flex flex-col space-y-4 border-r pr-4">
                <button
                    v-for="(folder, index) in folders"
                    :key="index"
                    @click="activeTab = index"
                    :class="['flex justify-between items-center px-4 py-2 text-left transition-transform duration-300 transform',
          { 'border-l-4 border-green-500': activeTab === index, 'hover:scale-105 hover:bg-gray-600': true }]">
                    <FolderSVG class="mr-2"/>
                    {{ folder }}
                </button>
            </div>
            <div class="ml-4 flex-1">
                <!-- 加载状态 -->
                <div v-if="loading" class="p-4 text-center text-gray-400 text-4xl mb-6">Landing...</div>
                <!-- 文件列表 -->
                <ul v-else>
                    <!-- 全选复选框 -->
                    <li class="p-2 pl-6 pr-6 mb-2 flex justify-between items-center transition-transform duration-300 transform bg-gray-800">
                        <input type="checkbox" @change="toggleSelectAll" :checked="isPageSelected"
                               class="checkbox ml-auto">
                        <span class="ml-2">全选该页</span>
                    </li>
                    <li
                        v-for="(file, fileIndex) in paginatedFiles"
                        :key="fileIndex"
                        :class="['p-2 pl-6 pr-6 mb-2 flex justify-between items-center transition-transform duration-300 ' +
                         'transform bg-gray-800',{ 'bg-gray-600': selectedFiles.includes(file), 'hover:bg-gray-600': !selectedFiles.includes(file) }]">
                        <span class="bg-pink-600 text-white p-1 rounded font-bold text-xs">.CSV</span>
                        <span class="ml-6">{{ file.name }}</span>
                        <span class="ml-4 text-gray-500 text-sm font-bold">{{ file.size }}</span>
                        <input type="checkbox" :value="file" v-model="selectedFiles" class="checkbox ml-auto">
                    </li>
                </ul>
                <!-- 分页 -->
                <div class="flex justify-center items-center space-x-3 mt-8">
                    <button @click="prevPage" class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                            :disabled="currentPage === 1">上一页
                    </button>
                    <button v-if="currentPage > maxPagesToShow / 2" @click="currentPage = 1"
                            class="px-4 py-2 bg-green-500 text-white">1
                    </button>
                    <span v-if="currentPage > maxPagesToShow / 2 + 1" class="px-4 py-2">...</span>
                    <button
                        v-for="page in limitedPages"
                        :key="page"
                        @click="currentPage = page"
                        :class="['px-4 py-2', { 'bg-green-500 text-white': currentPage === page }]"
                    >
                        {{ page }}
                    </button>
                    <span v-if="currentPage < totalPages.value - maxPagesToShow / 2" class="px-4 py-2">...</span>
                    <button v-if="currentPage < totalPages.value - maxPagesToShow / 2"
                            @click="currentPage = totalPages.value"
                            class="px-4 py-2 bg-green-500 text-white hover:bg-gray-800">{{ totalPages.value }}
                    </button>
                    <button @click="nextPage" class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                            :disabled="currentPage === totalPages.value">下一页
                    </button>
                    <!-- 跳转 -->
                    <input type="number" v-model="jumpPage" placeholder="跳转页码"
                           class="p-2 bg-gray-200 text-black rounded mr-2">
                    <button @click="jumpToPage"
                            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 glowing-button font-bold">
                        To
                    </button>
                    <button @click="filesDownload"
                            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 glowing-button">文件打包下载
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import FolderSVG from "@/components/svg/FolderSVG.vue";
import {getFilesList, postDownloadIsComplete, postFilesDownload} from "@/server/request-apis.js";
import {ElMessage} from "element-plus";

const loading = ref(true); // 初始状态为加载中

// 文件夹名称
const folders = ref([]);

// 文件列表
const files = ref([]);

const getFiles = async () => {
    try {
        const res = await getFilesList();
        folders.value = res.data.folders;
        files.value = res.data.files;
    } catch (error) {
        console.error("Failed to load files:", error);
    } finally {
        loading.value = false; // 数据加载完成后设置为false
    }
}

const filesDownload = async () => {
    try {
        if (selectedFiles.value.length === 0){
            ElMessage({
                duration: 2000,
                message: '请选择要下载的文件',
                type: 'info'
            })
        }else {
            let folderName = folders.value[activeTab.value];
            let fileNames = selectedFiles.value.map(file => file.name);
            ElMessage({
                duration: 2000,
                message: '文件开始下载，请不要关闭界面',
                type: 'info'
            })
            const res = await postFilesDownload(folderName, fileNames);
            // 创建一个 URL 对象指向 Blob
            const url = window.URL.createObjectURL(new Blob([res.data]));

            // 创建一个临时的 <a> 标签
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'output.zip'); // 设置下载文件的名称

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
        if(selectedFiles.value.length > 0){
            await postDownloadIsComplete(folders.value[activeTab.value]);
            ElMessage({
                duration: 2000,
                message: '下载完成！',
                type: 'info'
            })
        }
    }
}

onMounted(() => {
    getFiles();
})

// 活动标签页索引
const activeTab = ref(0);
// 每页显示的文件数
const itemsPerPage = 12;
// 当前页码
const currentPage = ref(1);
// 选中的文件名列表
const selectedFiles = ref([]);
// 跳转页码
const jumpPage = ref('');
// 计算当前标签页的文件列表(用于全选)
const currentFiles = computed(() => files.value[activeTab.value] || []);
// 总页数
const totalPages = computed(() => Math.ceil(currentFiles.value.length / itemsPerPage));
// 分页后的文件列表
const paginatedFiles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return currentFiles.value.slice(start, start + itemsPerPage);
});
// 全选当前页的文件
const isPageSelected = computed(() => paginatedFiles.value.every(file => selectedFiles.value.includes(file)));

const toggleSelectAll = () => {
    if (isPageSelected.value) {
        // 如果当前页全选，取消选择
        paginatedFiles.value.forEach(file => {
            const index = selectedFiles.value.indexOf(file);
            if (index !== -1) {
                selectedFiles.value.splice(index, 1);
            }
        });
    } else {
        // 否则，选中当前页的所有文件
        paginatedFiles.value.forEach(file => {
            if (!selectedFiles.value.includes(file)) {
                selectedFiles.value.push(file);
            }
        });
    }
};

// 限制分页按钮数量
const maxPagesToShow = 5;
const limitedPages = computed(() => {
    const startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages.value);
    return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
});

// 监听activeTab变化，重置currentPage并清空selectedFiles
watch(activeTab, () => {
    currentPage.value = 1;
    selectedFiles.value = []; // 清空选中的文件
});

// 跳转页面
const jumpToPage = () => {
    const page = parseInt(jumpPage.value);
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
    jumpPage.value = '';
};

// 上一页
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

// 下一页
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};
</script>


<style>
.checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #4caf50; /* 使用自定义颜色 */
    margin-left: 8px; /* 添加一点间距 */
}

.bg-gray-800 {
    background-color: #2d3748; /* 使用深灰色背景 */
}

.bg-gray-600 {
    background-color: #4a5568; /* 使用中灰色背景 */
}

</style>
