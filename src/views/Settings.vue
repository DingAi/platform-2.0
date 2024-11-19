<template>
	<div class="space-y-2 size-full smiley-sans">
		<div class="flex md:flex-row flex-col justify-between">
			<div class="md:w-1/6 sticky pr-6 border-r pt-6">
				<!-- 左侧的菜单 -->
				<nav class="space-y-2 sticky top-52 pb-4">
					<ul class="space-y-2">
						<li>
							<button @click="scrollToSection('section1'); activeSection = 'section1';"
							        :class="{ 'bg-theme-1-color-1 text-white': activeSection === 'section1' }"
							        class="w-full text-left p-2 hover:bg-theme-1-color-1 hover:text-white rounded">
								用户信息
							</button>
						</li>
						<li>
							<button @click="scrollToSection('section2'); activeSection = 'section2';"
							        :class="{ 'bg-theme-1-color-1 text-white': activeSection === 'section2' }"
							        class="w-full text-left p-2 hover:bg-theme-1-color-1 hover:text-white rounded">
								设备管理
							</button>
						</li>
						<li>
							<button @click="scrollToSection('section3'); activeSection = 'section3';"
							        :class="{ 'bg-theme-1-color-1 text-white': activeSection === 'section3' }"
							        class="w-full text-left p-2 hover:bg-theme-1-color-1 hover:text-white rounded">
								SN码激活
							</button>
						</li>
						<el-divider/>
						<li>
							<button @click="scrollToSection('section4'); activeSection = 'section4';"
							        :class="{ 'bg-theme-1-color-1 text-white': activeSection === 'section4' }"
							        class="w-full text-left p-2 hover:bg-theme-1-color-1 hover:text-white rounded">
								操作日志
							</button>
						</li>
						<li>
							<button @click="scrollToSection('section5');activeSection = 'section5';"
							        :class="{ 'bg-theme-1-color-1 text-white': activeSection === 'section5' }"
							        class="w-full text-left p-2 hover:bg-theme-1-color-1 hover:text-white rounded">
								硬件驱动更新
							</button>
						</li>
					</ul>
				</nav>
			</div>
			<!--右侧的对应内容-->
			<div class="md:w-5/6">
				<div class="content space-y-6 px-4">
					
					<!--Section01-->
					<div id="section1" class="section rounded-2xl p-4 sm:p-20 bg-theme-1-color-6 inner-shadow h-auto">
						<div class="flex items-center">
							<h1 class="text-4xl mb-6 ">用户信息</h1>
						</div>
						<hr class="my-6 border-gray-600"/>
						<el-descriptions size="large" border :column="columnCount">
							<el-descriptions-item label="用户名">{{
									Cookies.get('platform_user')
								}}
							</el-descriptions-item>
							<el-descriptions-item label="手机" class-name="flex justify-between">
								<span>{{ newPhone }}</span>
							</el-descriptions-item>
						</el-descriptions>
						<div class="flex items-center mt-9">
							<h1 class="text-2xl text-gray-500 mb-6 ">修改手机号</h1>
						</div>
						<hr class="my-6 border-gray-600"/>
						<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
							<form class="space-y-2" @submit.prevent="modifyTheMobilePhoneNumber">
								<div>
									<label for="sn" class="block text-sm font-medium leading-6 p-2">新手机号</label>
									<div class="mt-2 flex">
										<input
											v-model="phone"
											id="phone"
											name="phone"
											type="text"
											autocomplete="phone"
											required
											class="block w-full rounded-l-md border-0 p-2  shadow-sm ring-1 ring-inset
											ring-[#757de8] placeholder:text-gray-400 focus:z-10 focus:ring-2
											focus:ring-inset focus:ring-[#3F51B5] sm:text-sm sm:leading-6">
										<button
											type="button"
											:disabled="countdown > 0 ||phoneError"
											@click="getVerificationCode"
											class=" rounded-r-md px-4 py-2 text-sm font-semibold focus:z-10 focus:ring-2
											 focus:ring-inset focus:ring-[#3F51B5] w-24 text-white"
											:class="countdown > 0 || phoneError ? 'bg-gray-500 cursor-not-allowed' : 'bg-theme-1-color-1 hover:bg-indigo-500'">
											{{ countdown > 0 ? `${countdown}s` : '验证' }}
										</button>
									</div>
									<p v-if="phoneError" class="text-red-500 text-sm">请输入有效的手机号</p>
								</div>
								
								<div>
									<label for="captcha" class="block text-sm font-medium leading-6 ">手机验证码</label>
									<div class="mt-2">
										<input
											v-model="captcha"
											id="captcha"
											name="captcha"
											type="text"
											required
											class="block w-full rounded-md border-0 p-2  shadow-sm ring-1 ring-inset
											ring-[#757de8] placeholder:text-gray-400 focus:ring-2 focus:ring-inset
											focus:ring-[#3F51B5] sm:text-sm sm:leading-6">
									</div>
								</div>
								
								<div class="pt-6">
									<SubmitButton :loading="addLoading">确定</SubmitButton>
								</div>
							</form>
						</div>
					</div>
					<!--Section02-->
					<div id="section2" class="section rounded-2xl p-4 sm:p-20 bg-theme-1-color-6 inner-shadow h-auto">
						<div class="flex items-center">
							<h1 class="text-4xl mb-6 ">设备管理</h1>
						</div>
						<hr class="my-6 border-gray-600"/>
						<div class="mb-12 overflow-auto">
							<TableTemplate
								:header="header"
								:column="column"
								:showButton="2"
								:buttonLabels="['删除设备', '修改设备名']"
								:onButtonClick="[deleteClick, modifyDeviceNameClick]"
								:isLoading="addLoading"
							/>
						</div>
						<!--设备删除弹窗-->
						<el-dialog v-model="dialogVisible1" title="确定要删除设备?" width="500">
							<p>请输入<span class="text-pink-600">“删除设备”</span>：</p>
							<div class="mt-2">
								<el-input v-model="delText" placeholder="Please input"/>
							</div>
							<template #footer>
								<div class="dialog-footer">
									<el-button @click="dialogVisible1 = false">取消</el-button>
									<el-button type="primary" @click="deleteEquipment">删除</el-button>
								</div>
							</template>
						</el-dialog>
						
						<!--修改设备名弹窗-->
						<el-dialog v-model="dialogVisible2" title="修改设备名" width="500">
							<div class="sm:mx-auto sm:w-full sm:max-w-sm">
								<form class="space-y-2 py-6" @submit.prevent="modifyDeviceName">
									<label for="sn" class="block text-sm font-medium leading-6 p-2">原设备名</label>
									<span class="text-2xl text-indigo-500">{{ SCGData[1][clickRowIndex] }}</span>
									<label for="sn" class="block text-sm font-medium leading-6 p-2">设备SN码</label>
									<div class="mt-1">
										<input v-model="SCGData[0][clickRowIndex]" id="sn" name="sn" type="text"
										       required disabled
										       class="block w-full rounded-md border-0 p-2"
										/>
									</div>
									
									<label for="en"
									       class="block text-sm font-medium leading-6 p-2">新设备名</label>
									<div class="mt-1">
										<input v-model="newDeviceName" id="en" name="en" type="text" required
										       class="block w-full rounded-md border-0 p-2 shadow-sm ring-1
										ring-inset ring-[#757de8] placeholder:text-gray-400 focus:ring-2 focus:ring-inset
										focus:ring-[#3F51B5] sm:text-sm sm:leading-6"/>
									</div>
									
									<div class="pt-6">
										<SubmitButton :loading="addLoading">修改设备名</SubmitButton>
									</div>
								</form>
							</div>
						</el-dialog>
					</div>
					
					<!--Section03-->
					<div id="section3" class="section rounded-2xl p-4 sm:p-20 bg-theme-1-color-6 inner-shadow">
						<h1 class="text-4xl mb-6 mt-4">SN 码激活</h1>
						<hr class="my-6 border-gray-400"/>
						<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
							<form class="space-y-2" @submit.prevent="activationEquipment">
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
											ring-inset ring-[#757de8] placeholder:text-gray-400 focus:ring-2
											focus:ring-inset focus:ring-[#3F51B5] sm:text-sm sm:leading-6"/>
									</div>
								</div>
								
								<div>
									<label for="en"
									       class="block text-sm font-medium leading-6 p-2">设备名</label>
									<div class="mt-1">
										<input v-model="en" id="en" name="en" type="text" required
										       class="block w-full rounded-md border-0 p-2 shadow-sm ring-1
											ring-inset ring-[#757de8] placeholder:text-gray-400 focus:ring-2
											focus:ring-inset focus:ring-[#3F51B5] sm:text-sm sm:leading-6"/>
									</div>
								</div>
								
								<div class="pt-6">
									<SubmitButton :loading="addLoading">添加设备</SubmitButton>
								</div>
							</form>
						</div>
					</div>
					
					<!--Section04-->
					<div id="section4" class="section rounded-2xl p-4 sm:p-20 bg-theme-1-color-6 inner-shadow h-auto">
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
					
					<!--Section05-->
					<div id="section5" class="section rounded-2xl p-4 sm:p-20 bg-theme-1-color-6 inner-shadow h-auto">
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
import {computed, onMounted, onUnmounted, ref} from "vue";
import {
	getClearLog,
	getLogData,
	postDeleteEquipment,
	postSnActivation,
	postFileUpload,
	postModifyDeviceName,
	getPhoneCaptcha, postModifyUserPhone, postModifyPhoneCaptcha,
} from "@/server/request-apis.js"
import TableTemplate from "@/components/TableTemplate.vue";
import {useAuthStore} from "@/stores/userStore.js";
import {storeToRefs} from "pinia";
import {showMessage, transposeMatrix} from "@/utils/tools-functions.js";
import SubmitButton from "@/components/SubmitButton.vue";
import {ElMessage} from "element-plus";
import Cookies from "js-cookie";

/*************************************************************
 *                   全局状态
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - 在登录之后会获取大量用户数据存储在本地，首先会获取获取这些本地数据；
 *
 *************************************************************/

const authStore = useAuthStore();

// Pinia里读取的本地数据
const {SCGData} = storeToRefs(authStore);

// 页面定位
const activeSection = ref("section1");

// 滚动到指定部分
const scrollToSection = (sectionId) => {
	const element = document.getElementById(sectionId);
	if (element) {
		const offset = 180;
		const top = element.getBoundingClientRect().top + window.scrollY - offset;
		window.scrollTo({top, behavior: "smooth"});
	}
};

// 刷新设备列表
async function refreshEquipments() {
	addLoading.value = true;
	try {
		authStore.getEquipments(); // 更新 SCGData
		column.value = transposeMatrix([  //转置数据之后组件才能正常显示
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


/*************************************************************
 *                   用户信息
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - 从实时数据接口获取数据，这个界面的核心数据源；
 *    在获取到数据之后对接铝排、开关群、数据点列表的状态；
 *
 *************************************************************/

// 用户的手机号
let userPhone = JSON.parse(localStorage.getItem('phone'));

// 新手机号
const newPhone = ref(userPhone)

// 用户原手机号
const phone = ref('');

// 手机验证码
const captcha = ref('');

// 手机号格式错误状态
const phoneError = ref(false);

// 手机号格式验证
const validatePhoneNumber = () => {
	const phoneRegex = /^1\d{10}$/;
	phoneError.value = !phoneRegex.test(phone.value);
};

// 验证码触发时计时
const countdown = ref(0);
let countdownTimer = null;
const startCountdown = () => {
	countdown.value = 90;
	countdownTimer = setInterval(() => {
		if (countdown.value > 0) {
			countdown.value -= 1;
		} else {
			countdownTimer = null;
		}
	}, 1000);
};
// 发送验证码
const getVerificationCode = () => {
	validatePhoneNumber();
	let res;
	if (!phoneError.value && countdown.value === 0) {
		res =  postModifyPhoneCaptcha(phone.value);
		startCountdown();
		if (res.state === 200){
			newPhone.value = phone.value;
			userPhone = phone.value;
		}
	}
};

// 修改手机号
function modifyTheMobilePhoneNumber() {
	validatePhoneNumber();
	if (!phoneError.value) {
		try{
			postModifyUserPhone(phone.value, captcha.value)
		} catch (e) {
			console.log(e)
		}
	}
}

/*************************************************************
 *                   设备列表
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - 用户所属的设备的SN码-设备名，以及删除设备和修改设备名
 *
 *************************************************************/

// 控制删除设备弹窗
const dialogVisible1 = ref(false);

// 控制第二个弹窗
const dialogVisible2 = ref(false);

// 删除操作输入框的文本
const delText = ref("");

// 表格的行索引
const clickRowIndex = ref(null);

// 新的设备名称
const newDeviceName = ref('');

// 设备表格头部
const header = ref(["SN 码", "设备名称", "注册时间"]);
const column = ref(
	transposeMatrix([SCGData.value[0], SCGData.value[1], SCGData.value[2]])
);

// 弹窗按钮函数
function deleteClick(rowIndex) {
	dialogVisible1.value = true;
	clickRowIndex.value = rowIndex;
}

// 弹窗按钮函数
function modifyDeviceNameClick(rowIndex) {
	dialogVisible2.value = true;
	clickRowIndex.value = rowIndex;
	console.log(clickRowIndex.value);
}

// 删除设备
async function deleteEquipment() {
	if (delText.value === "删除设备") {
		try {
			let index = Number(clickRowIndex.value);
			const eqRes = await postDeleteEquipment(SCGData.value[0][index]);
			dialogVisible1.value = false;
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


// 修改设备名
const modifyDeviceName = async () => {
	dialogVisible2.value = true;
	let index = Number(clickRowIndex.value);
	try {
		if (SCGData.value[1][index] === newDeviceName.value) {
			showMessage('新修改的设备名称与原设备名称相同')
		} else {
			const res = await postModifyDeviceName(SCGData.value[0][index], newDeviceName.value);
			if (res.status === 200) {
				showMessage(res.data, 'info');
			}
			dialogVisible2.value = false;
			SCGData.value[1][index] = newDeviceName.value;
			localStorage.setItem('auth', JSON.stringify(SCGData.value))
			
		}
	} catch (e){
		console.log(e)
	} finally {
		await refreshEquipments()
	}
	
}





/*************************************************************
 *                   SN码激活
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - 激活已经注册了的SN码设备
 *
 *************************************************************/

//SN码
const sn = ref("");

//设备名
const en = ref("");

// 激活SN码的表单加载状态
const addLoading = ref(false);

// SN码是否有效
const isSNValid = ref(false);

// SN码格式错误状态
const snError = ref(false);


// 验证 SN 码格式
const validateSnFormat = (value) => {
	const snPattern = /^[a-zA-Z0-9]{11}\d{4}\d{6}$/;
	return snPattern.test(value);
};



// 激活设备
async function activationEquipment() {
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
			// 刷新设备延迟三秒
			setTimeout(()=>{
				refreshEquipments();
				getLog();
			}, 3000);
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

/*************************************************************
 *                   操作日志
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - 用户的登录，以及开关操作、SN码激活、设备驱动更新等都会触发日志；
 *
 *************************************************************/

// 日志数据加载状态
const logLoading = ref(false);

// 日志表头
const logHeader = ref(["信息", "时间"]);

// 日志数据
const logCol = ref([]);


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


/*************************************************************
 *                   硬件驱动更新
 *
 *  简要描述:
 *  ----------------------------------------------------------
 *  - OTA更新
 *
 *************************************************************/

//设备上传选择的对象
const upload = ref(null);

const uploadSelectValue = ref("");

// 文件是否已选择
const fileSelected = ref(false);


// 文件上传下拉框的数据
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



/*************************************************************
 *                   界面数据挂载
 *
 *************************************************************/

// 用于适配用户信息的表格手机端的显示模式
const columnCount = ref(2)

function updateColumnCount() {
	columnCount.value = window.innerWidth <= 768 ? 1 : 2 // 768px以下视为手机端
	
}

// 组件挂载后获取日志
onMounted(async () => {
	await getLog();
	window.addEventListener('resize', updateColumnCount);
});

onUnmounted(() => {
	window.removeEventListener('resize', updateColumnCount)
})
</script>

<style scoped>
.content {
	flex: 1;
}

.section {
	height: 55rem;
}
</style>
