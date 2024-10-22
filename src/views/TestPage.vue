<template>
	<div>
		<ul>
			<li v-for="file in files" :key="file">
				<input type="checkbox" :value="file" v-model="selectedFiles" /> {{ file }}
			</li>
		</ul>
		<button @click="downloadSelectedFiles">打包并下载</button>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// 假设从后端获取的文件列表
const files = ref(['file1.txt', 'file2.txt', 'file3.txt'])

// 存储用户选择的文件
const selectedFiles = ref([])

// 打包并下载文件
const downloadSelectedFiles = async () => {
	if (selectedFiles.value.length === 0) {
		alert('请选择要打包的文件')
		return
	}
	
	try {
		// 发送请求到后端进行打包
		const response = await axios.post('/api/download', selectedFiles.value)
		
		// 获取返回的下载链接
		const downloadUrl = response.data.download_url
		
		// 创建下载链接并触发下载
		const link = document.createElement('a')
		link.href = downloadUrl
		link.setAttribute('download', 'backup.zip')
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	} catch (error) {
		console.error('下载失败:', error)
	}
}
</script>
