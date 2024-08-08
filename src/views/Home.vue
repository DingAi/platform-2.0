<template>
    <div class="space-y-4 text-center size-full">
        <div class="flex md:flex-row flex-col justify-between items-center bg-gray-700 p-2 h-96">
            <a href="http://192.168.30.119:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2RqYW5nby1maWxlcy90ZXN0LnppcD9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPTRDTFpYOTVEOTBGRFhIMUhGOEdIJTJGMjAyNDA4MDclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwODA3VDA3MzYzNFomWC1BbXotRXhwaXJlcz00MzE5MSZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSTBRMHhhV0RrMVJEa3dSa1JZU0RGSVJqaEhTQ0lzSW1WNGNDSTZNVGN5TXpBMU9EazJOaXdpY0dGeVpXNTBJam9pYldsdWFXOWZiV2gzZDFCNUluMC5GMEtJY1N3NlVHVUtjTzN4ODVpZVdFS3lIUlR2NjNSaFNaRWdQanliMUd0cGlWWlVvcWhWck9Kb0RDZVNyaHRWOFNiclU4WWtvcnNPSnRCWkRIVTJTZyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPTliYzQ3MjRiNDFhZDVhYmYxZGQ5MmQ0OTRmZGQ3MDQ2ZjdmZjFjOGEyNjU5MzM5M2JkZDhmM2M2MjQ2NjMwOWM"
               download="test.zip">A标签下载测试</a>
        </div>
        <div class="flex md:flex-row flex-col justify-between items-center bg-gray-700 p-2 h-96">
            <div class="w-1/4 p-20">
                <SubmitButton @click="downloadFile">下载测试</SubmitButton>
            </div>
            <div class="w-1/4">
                <SubmitButton @click="downloadFileMinio">Minio测试</SubmitButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import {downloadTest, getTokenTest} from "@/server/request-apis.js";
import SubmitButton from "@/components/SubmitButton.vue";
import {ref} from "vue";
import axios from "axios";

const isDownloading = ref(false)

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

async function downloadFileMinio() {
    try {
        // 构建 Minio 文件下载 URL
        const url = `http://192.168.30.119:9001/django-files/test.zip`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `AWS 2G2xNVagrotnQ7nI7id1:Q9LTiV4XfR0yf0jHu4jeBhDy2zbXCZE6LFJ7yq31`
            }
        });
        if (response.ok) {
            const blob = await response.blob();
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.setAttribute('download', 'test.zip');
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();
        } else {
            console.error(`Error downloading file: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}
</script>

<style scoped>

</style>