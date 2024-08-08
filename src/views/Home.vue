<template>
    <div class="space-y-4 text-center size-full">
        <div class="flex md:flex-row flex-col justify-between items-center bg-gray-700 p-2 h-96">
        </div>
        <div class="flex md:flex-row flex-col justify-between items-center bg-gray-700 p-2 h-96">
            <div class="w-1/4 p-20">
                <SubmitButton @click="downloadFile">下载测试</SubmitButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import SubmitButton from "@/components/SubmitButton.vue"

function downloadFile() {
    // 设置要下载的文件地址
    const fileUrl = 'DjangoServer/dt';

    // 使用 Fetch API 下载文件
    fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => {
            // 创建一个临时链接并模拟点击触发下载
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'test.zip');
            document.body.appendChild(link);
            link.click();

            // 清理临时链接
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('下载文件失败:', error);
        });
}
</script>

<style scoped>

</style>