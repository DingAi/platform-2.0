<template>
	<el-upload
		:before-upload="handleBeforeUpload"
		accept=".xlsx, .xls"
		:show-file-list="false"
		action="#"
	>
		<el-button type="primary">
			<slot>
				上传 Excel 文件
			</slot>
		</el-button>
	</el-upload>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import * as XLSX from 'xlsx';

// 定义事件用于向父组件传递数据
const emit = defineEmits(['fileParsed']);

const props = defineProps({
	name: {
		type: String,
		default: '上传 Excel 文件'
	},
})

// 处理文件上传前的操作
const handleBeforeUpload = (file) => {
	const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
	if (!isExcel) {
		ElMessage.error('只能上传Excel文件');
		return false;
	}
	
	const reader = new FileReader();
	reader.onload = (e) => {
		try {
			const data = new Uint8Array(e.target.result);
			const workbook = XLSX.read(data, { type: 'array' });
			
			const firstSheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[firstSheetName];
			const jsonData = XLSX.utils.sheet_to_json(worksheet);
			
			const formattedData = formatExcelData(jsonData);
			// console.log('解析后的数据:', formattedData); // 调试信息
			emit('fileParsed', formattedData);
		} catch (error) {
			console.error('文件读取错误:', error); // 错误捕获
			ElMessage.error('文件读取失败，请检查格式');
		}
	};
	
	reader.onerror = (error) => {
		console.error('文件读取错误:', error);
		ElMessage.error('文件读取失败，请重试');
	};
	
	reader.readAsArrayBuffer(file);
	return false; // 阻止默认的文件上传行为
};

// 格式化 Excel 数据为 { key: [values] }
const formatExcelData = (jsonData) => {
	const formattedData = {};
	
	jsonData.forEach((row) => {
		Object.keys(row).forEach((key) => {
			if (!formattedData[key]) {
				formattedData[key] = [];
			}
			formattedData[key].push(row[key]);
		});
	});
	
	return formattedData;
};
</script>

<style scoped>
/* 添加必要的样式 */
</style>
