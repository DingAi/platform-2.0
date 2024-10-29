<template>
	<div class="space-y-2 size-full">
		<div class="flex md:flex-row flex-col justify-between">
			<div class="md:w-1/6 sticky pr-6 border-r pt-6">
				<!-- Sticky menu -->
				<nav class="space-y-2 sticky top-52 pb-4">
					<ul class="space-y-2">
						<li>
							<button @click="scrollToSection('section1'); activeSection = 'section1';"
							        :class="{ 'bg-[#3F51B5] text-white': activeSection === 'section1' }"
							        class="w-full text-left p-2 hover:bg-[#3F51B5] hover:text-white rounded">设备管理
							</button>
						</li>
						<li>
							<button @click="scrollToSection('section2'); activeSection = 'section2';"
							        :class="{ 'bg-[#3F51B5] text-white': activeSection === 'section2' }"
							        class="w-full text-left p-2 hover:bg-[#3F51B5] hover:text-white rounded">SN码激活
							</button>
						</li>
						<el-divider/>
						<li>
							<button @click="scrollToSection('section3'); activeSection = 'section3';"
							        :class="{ 'bg-[#3F51B5] text-white': activeSection === 'section3' }"
							        class="w-full text-left p-2 hover:bg-[#3F51B5] hover:text-white rounded">操作日志
							</button>
						</li>
						<li>
							<button @click="scrollToSection('section4');activeSection = 'section4';"
							        :class="{ 'bg-[#3F51B5] text-white': activeSection === 'section4' }"
							        class="w-full text-left p-2 hover:bg-[#3F51B5] hover:text-white rounded">硬件驱动更新
							</button>
						</li>
					</ul>
				</nav>
			</div>
			<div class="md:w-5/6">
				<div class="content space-y-4 pr-4 pl-4">
					<!--Section01-->
					<div id="section1" class="section rounded-2xl p-4 sm:p-20 bg-[#f5f5f5] inner-shadow h-auto">
						<div class="flex items-center">
							<h1 class="text-4xl text-[#333333] mb-6 ">设备管理</h1>
						</div>
						<hr class="my-6 border-gray-600"/>
						<div class="mb-12 overflow-auto">
							<TableTemplate
								:header="header"
								:column="column"
								:showButton="true"
								buttonLabel="Del"
								:onButtonClick="deleteClick"
								:isLoading="addLoading"
							/>
						</div>
						
						<el-dialog v-model="dialogVisible" title="确定要删除设备【xxx】?" width="500">
							<p>请输入<span class="text-pink-600">“删除设备”</span>：</p>
							<div class="mt-2">
								<el-input v-model="delText" placeholder="Please input"/>
							</div>
							<template #footer>
								<div class="dialog-footer">
									<el-button @click="dialogVisible = false">取消</el-button>
									<el-button type="primary" @click="deleteEquipment">删除</el-button>
								</div>
							</template>
						</el-dialog>
					</div>
					<!--Section02-->
					<div id="section2" class="section rounded-2xl p-4 sm:p-20 bg-[#f5f5f5] inner-shadow">
						<h1 class="text-4xl mb-6 mt-4">SN 码激活</h1>
						<hr class="my-6 border-gray-600"/>
						<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
							<form class="space-y-2" @submit.prevent="addEquipment">
								<div>
									<label for="sn" class="block text-sm font-medium leading-6 p-2">设备 SN 码</label>
									<div class="mt-1">
										<input v-model="sn"
										       id="sn"
										       name="sn"
										       type="text"
										       required
										       @blur="validateSnFormat(sn)"
										       class="block w-full rounded-md border-0 p-2 shadow-sm ring-1
											ring-inset ring-[#757de8] placeholder:text-gray-400 focus:ring-2 focus:ring-inset
											focus:ring-[#3F51B5] sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
								
								<div>
									<label for="en"
									       class="block text-sm font-medium leading-6 p-2">设备名</label>
									<div class="mt-1">
										<input v-model="en" id="en" name="en" type="text" required
										       class="block w-full rounded-md border-0 p-2 shadow-sm ring-1
											ring-inset ring-[#757de8] placeholder:text-gray-400 focus:ring-2 focus:ring-inset
											focus:ring-[#3F51B5] sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
								
								<div class="pt-6">
									<SubmitButton :loading="addLoading">添加设备</SubmitButton>
								</div>
							</form>
						</div>
					</div>
					<!--Section03-->
					<div id="section3" class="section rounded-2xl p-4 sm:p-20 bg-[#f5f5f5] inner-shadow h-auto">
						<div class="flex items-center">
							<h1 class="text-4xl mb-6">操作日志</h1>
							<el-button class="ml-auto" @click="clearLog" round>
								清空日志
							</el-button>
						</div>
						
						<hr class="my-6 border-gray-600"/>
						<TableTemplate
							:header="logHeader"
							:column="logCol"
							:is-loading="logLoading"
							:page-row-number="10"
						/>
					</div>
					<!--Section04-->
					<div id="section4" class="section rounded-2xl p-4 sm:p-20 bg-[#f5f5f5] inner-shadow h-auto">
						<h1 class="text-4xl mb-6">硬件驱动更新</h1>
						<hr class="my-6 border-gray-600"/>
						<div class="flex flex-col md:flex-row justify-between">
								<div class="flex justify-center items-center p-2 w-full md:w-1/3">
									<el-upload ref="upload"
									           :http-request="fileUpload"
									           :limit="1"
									           :auto-upload="false"
									           @change="handleFileChange"
									           :before-upload="beforeUpload"
									>
										<template #trigger>
											<el-button type="primary">选择二进制更新文件</el-button>
										</template>
									</el-upload>
								</div>
								<div class="flex justify-center items-center p-2 w-full md:w-1/3">
									<el-select v-model="uploadSelectValue"
									           placeholder="选择要更新的设备"
									           @change="handleSelectChange"
									           style="width: 240px">
										<el-option v-for="item in snOption"
										           :key="item.value"
										           :label="item.label"
										           :value="item.value"
										/>
									</el-select>
								</div>
								<div class="flex justify-center p-2 w-full md:w-1/3">
									<el-button
										class="ml-3"
										:disabled="!fileSelected || !uploadSelectValue"
										@click="submitUpload">
										确定更新
									</el-button>
								</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="js">
import {computed, onMounted, ref} from "vue";
import {
	getClearLog,
	getLogData,
	postDeleteEquipment,
	postSnActivation,
	postFileUpload,
	postAlarmLog, postAlarmAlreadyRead,
} from "@/server/request-apis.js"
import TableTemplate from "@/components/TableTemplate.vue";
import {useAuthStore} from "@/stores/userStore.js";
import {storeToRefs} from "pinia";
import {showMessage, transposeMatrix} from "@/utils/tools-functions.js";
import SubmitButton from "@/components/SubmitButton.vue";
import {ElMessage} from "element-plus";

// Loading状态
const addLoading = ref(false);
const logLoading = ref(false);
const fileSelected = ref(false);
const isSNValid = ref(false);
const snError = ref(false);

// 组件状态
const activeSection = ref("section1");
const dialogVisible = ref(false);
const delText = ref("");
const clickRowIndex = ref(null); // 行索引

// 认证状态
const authStore = useAuthStore();
const {SCGData} = storeToRefs(authStore);

// 表格头部
const header = ref(["SN 码", "设备名称", "注册时间"]);
const column = ref(
	transposeMatrix([SCGData.value[0], SCGData.value[1], SCGData.value[2]])
);

// 日志列表
const logHeader = ref(["信息", "时间"]);
const logCol = ref([]);

// 设备激活输入框
const sn = ref(""); //SN码
const en = ref(""); //设备名

//设备上传选择的对象
const upload = ref(null);
const uploadSelectValue = ref("");
const snOption = computed(() => {
	let snList = []
	for (let i = 0; i < SCGData.value[0].length; i++) {
		snList.push({
			value: SCGData.value[0][i],
			label: SCGData.value[1][i]
		})
	}
	return snList;
})

// 滚动到指定部分
const scrollToSection = (sectionId) => {
	const element = document.getElementById(sectionId);
	if (element) {
		const offset = 180;
		const top = element.getBoundingClientRect().top + window.scrollY - offset;
		window.scrollTo({top, behavior: "smooth"});
	}
};

// 添加设备
async function addEquipment() {
	addLoading.value = true;
	//正则判断
	if (!sn.value.match(/^[ABCD][A-Z0-9]{9}[A-Z]\d{10}$/)) {
		isSNValid.value = false;
		snError.value = true;
		ElMessage({message: 'SN码格式错误', type: 'error'});
		addLoading.value = false; // 结束加载状态
		return; // 如果格式错误，直接返回，不执行后续的网络请求
	}
	let res; // 在函数作用域内声明 res
	try {
		if (validateSnFormat(sn.value)) {
			res = await postSnActivation(sn.value, en.value);
			await refreshEquipments();
			await getLog();
		} else {
			showMessage('SN码格式不正确', 'error');
		}
	} catch (error) {
		console.error("添加设备失败:", error);
	} finally {
		if (res) { // 确保 res 存在再访问
			showMessage(res.data, 'info');
			sn.value = '';
			en.value = '';
		}
		addLoading.value = false; // 结束加载状态
	}
}

// 刷新设备列表
async function refreshEquipments() {
	addLoading.value = true;
	try {
		await authStore.getEquipments(); // 更新 SCGData
		column.value = transposeMatrix([
			SCGData.value[0],
			SCGData.value[1],
			SCGData.value[2],
		]);
	} catch (error) {
		console.error("刷新设备列表失败:", error);
	} finally {
		addLoading.value = false;
	}
}

// 获取日志数据
async function getLog() {
	logLoading.value = true;
	try {
		const res = await getLogData();
		logCol.value = transposeMatrix(res.data["log"]);
	} catch (error) {
		console.error("获取日志失败:", error);
	} finally {
		logLoading.value = false;
	}
}

// 弹窗按钮函数
function deleteClick(rowIndex) {
	dialogVisible.value = true;
	clickRowIndex.value = rowIndex;
}

// 删除设备
async function deleteEquipment() {
	if (delText.value === "删除设备") {
		try {
			let index = Number(clickRowIndex.value);
			const eqRes = await postDeleteEquipment(SCGData.value[0][index]);
			dialogVisible.value = false;
			ElMessage({
				showClose: true,
				message: eqRes.data,
			});
		} catch (e) {
			console.error("删除设备失败:", e);
		} finally {
			await refreshEquipments();
			delText.value = "";
		}
	}
}


// 验证 SN 码格式
const validateSnFormat = (value) => {
	const snPattern = /^[a-zA-Z0-9]{11}\d{4}\d{6}$/;
	return snPattern.test(value);
};


// 校验上传文件类型和大小
const beforeUpload = (file) => {
	const isBin = file.name.endsWith('.bin');
	const isLt500KB = file.size <= 500 * 1024;
	
	if (!isBin) {
		showMessage('只允许上传 .bin 类型的文件!');
		return false;
	}
	if (!isLt500KB) {
		showMessage('文件大小不能超过 500 KB!');
		return false;
	}
	return true;
};

// 处理文件选择事件
const handleFileChange = (file) => {
	if (file) {
		fileSelected.value = true;
	} else {
		fileSelected.value = false;
	}
};

// 处理设备选择事件
const handleSelectChange = (value) => {
	uploadSelectValue.value = value;
};

// 上传文件
const submitUpload = () => {
	if (!fileSelected.value || !uploadSelectValue.value) {
		ElMessage.error('请选择文件和设备!');
		return;
	}
	upload.value.submit();
};

// 自定义文件上传
const fileUpload = async ({file}) => {
	try {
		await postFileUpload(uploadSelectValue.value, file);
		upload.value.clearFiles();
		fileSelected.value = false;
	} catch (error) {
		ElMessage.error('Upload error: ' + error.message);
	} finally {
		ElMessage.success('文件上传完成');
	}
};


// 清除日志
const clearLog = async () => {
	try {
		await getClearLog();
	} catch (e) {
		console.log(e)
	} finally {
		await getLog()
		showMessage('日志已清除', 'success');
	}
}

// 组件挂载后获取日志
onMounted(async () => {
	await getLog();
});
</script>

<style scoped>
.content {
	flex: 1;
}

.section {
	height: 55rem;
}
</style>
