<template>
	<div class="space-y-4 text-center size-full">
		<!-- 顶栏 -->
		<div class="flex flex-col md:flex-row justify-between items-center bg-[#f5f5f5] p-4 h-auto rounded-2xl inner-shadow">
			<span class="text-xl text-[#5c5c5c] px-2 mt-2 md:mt-0 font-bold">{{ equipmentName }}</span>
			<span class="text-xl text-white bg-[#757de8] rounded-xl px-2 mt-2 md:mt-0">{{ sn }}</span>
		</div>
		
		<div class="p-10 w-full tabs-chart rounded-2xl inner-shadow bg-[#f5f5f5]">
			<div class="tabs-container">
				<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" tab-position="left">
					<el-tab-pane v-for="(item, index) in multiOptions" :key="index" :label="item" :name="item">
						{{ item }}
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>

<script setup>
import {useRoute} from "vue-router";
import {ref} from "vue";

const route = useRoute()
const SCGData = JSON.parse(localStorage.getItem('auth')).SCGData;
const sn = ref(route.params.id);
// 找到SN码在SCGData中的索引index
let index = SCGData[0].indexOf(sn.value);
const equipmentName = ref(SCGData[1][index]);

const activeName = ref('first')

const multiOptions = ref([
	'主站',
	'气体箱 01',
	'气体箱 02',
	'气体箱 03',
	'气体箱 04',
	'气体箱 05',
	'气体箱 06',
	'气体箱 07',
	'气体箱 08',
	'气体箱 09',
	'气体箱 10',
])


const handleClick = (tab, event) => {
	console.log(tab, event)
}
</script>

<style scoped>
.tabs-chart {
	height: calc(100vh - 370px);
}

.demo-tabs > .el-tabs__content {
	padding: 32px;
	color: #6b778c;
	font-size: 32px;
	font-weight: 600;
}
</style>