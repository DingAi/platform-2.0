<template>
	<div class="flex min-h-full flex-col justify-center px-6 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
			<img class="mx-auto h-10 w-auto" src="@/assets/vue.svg" alt="Your Company">
			<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">初始注册</h2>
		</div>
		
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
			<form class="space-y-4" @submit.prevent="initRoll">
				<div>
					<label for="username" class="block text-sm font-medium leading-6 ">用户名</label>
					<div class="mt-2">
						<input
							v-model="username"
							id="username"
							name="username"
							type="text"
							autocomplete="text"
							required
							class="block w-full rounded-md border-0 p-2  shadow-sm ring-1 ring-inset ring-[#757de8]
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3F51B5] sm:text-sm sm:leading-6">
						<p v-if="usernameError" class="text-red-500 text-sm">用户名只能包含字母、数字、下划线或连字符。</p>
					</div>
				</div>
				
				<div>
					<label for="sn" class="block text-sm font-medium leading-6 ">SN码</label>
					<div class="mt-2 flex">
						<input
							v-model="snCode"
							id="sn"
							name="sn"
							type="text"
							required
							class="block w-full rounded-l-md border-0 p-2 shadow-sm ring-1 ring-inset ring-[#757de8]
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3F51B5] sm:text-sm sm:leading-6">
						<button
							type="button"
							@click="validateSNCode"
							class="text-white bg-theme-1-color-1 rounded-r-md px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-inset focus:ring-[#3F51B5] w-24"
						>
							验证
						</button>
					</div>
					<p v-if="snError" class="text-red-500 text-sm">请输入有效的SN码。</p>
				</div>
				
				<div>
					<label for="deviceName" class="block text-sm font-medium leading-6 ">设备名</label>
					<div class="mt-2">
						<input
							v-model="deviceName"
							id="deviceName"
							name="deviceName"
							type="text"
							required
							class="block w-full rounded-md border-0 p-2  shadow-sm ring-1 ring-inset ring-[#757de8]
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3F51B5] sm:text-sm sm:leading-6">
					</div>
				</div>
				
				<div>
					<label for="phone" class="block text-sm font-medium leading-6 ">手机号</label>
					<div class="mt-2 flex">
						<input
							v-model="phone"
							id="phone"
							name="phone"
							type="text"
							autocomplete="phone"
							required
							class="block w-full rounded-l-md border-0 p-2  shadow-sm ring-1 ring-inset ring-[#757de8]
                            placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#3F51B5] sm:text-sm sm:leading-6">
						<button
							type="button"
							:disabled="countdown > 0 || phoneError || !isSNValid"
							@click="handleButtonClick"
							class=" rounded-r-md px-4 py-2 text-sm font-semibold focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#3F51B5] w-24 text-white"
							:class="countdown > 0 || phoneError || !isSNValid ? 'bg-gray-500 cursor-not-allowed' : 'bg-theme-1-color-1 hover:bg-green-500'">
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
							class="block w-full rounded-md border-0 p-2  shadow-sm ring-1 ring-inset ring-[#757de8]
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3F51B5] sm:text-sm sm:leading-6">
					</div>
				</div>
				
				<div>
					<label for="password" class="block text-sm font-medium leading-6 ">密码</label>
					<div class="mt-2">
						<input
							v-model="password"
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							class="block w-full rounded-md border-0 p-2  shadow-sm ring-1 ring-inset ring-[#757de8]
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3F51B5] sm:text-sm sm:leading-6">
						<p v-if="passwordError" class="text-red-500 text-sm">密码长度至少6位。</p>
					</div>
				</div>
				
				<div>
					<label for="rePassword" class="block text-sm font-medium leading-6 ">重复密码</label>
					<div class="mt-2">
						<input
							v-model="rePassword"
							id="rePassword"
							name="rePassword"
							type="password"
							autocomplete="current-password"
							required
							class="block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ring-[#757de8]
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3F51B5] sm:text-sm sm:leading-6">
						<p v-if="passwordMatchError" class="text-red-500 text-sm">两次输入的密码不匹配。</p>
					</div>
				</div>
				
				<div class="pt-10">
					<SubmitButton :loading="isLoading">注册</SubmitButton>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="js">
import {getPhoneCaptcha, postRegister, postRegisterSnVerify} from '@/server/request-apis';
import {ref} from 'vue';
import {ElMessage} from 'element-plus';
import SubmitButton from "@/components/SubmitButton.vue";
import {showMessage} from "@/utils/tools-functions.js";
import {useRoute} from "vue-router";

const router = useRoute();

const isLoading = ref(false);

const username = ref('');
const password = ref('');
const rePassword = ref('');
const phone = ref('');
const snCode = ref('');
const deviceName = ref('');
const captcha = ref('');

const usernameError = ref(false);
const passwordError = ref(false);
const phoneError = ref(false);
const snError = ref(false);
const passwordMatchError = ref(false);
const isSNValid = ref(false); // 新增变量，用于跟踪SN码验证状态

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

// SN码验证
const validateSNCode = async () => {
	// 假设snCode是外部定义的响应式数据
	if (!snCode.value.match(/^[ABCD][A-Z0-9]{9}[A-Z]\d{10}$/)) {
		isSNValid.value = false;
		snError.value = true;
		ElMessage({message: 'SN码格式错误', type: 'error'});
		return; // 如果格式错误，直接返回，不执行后续的网络请求
	}
	
	try {
		const res = await postRegisterSnVerify(snCode.value);
		if (res.data.state) {
			isSNValid.value = true;
			snError.value = false; // 清除错误
			showMessage('SN码验证成功', 'success');
		} else {
			isSNValid.value = false;
			snError.value = true;
			ElMessage({message: 'SN码验证失败', type: 'error'});
		}
	} catch (error) {
		isSNValid.value = false;
		snError.value = true;
		ElMessage({message: 'SN码验证失败（网络错误）', type: 'error'});
	}
};

// 发送验证码
const handleButtonClick = () => {
	if (isSNValid.value) {
		validatePhoneNumber();
		if (!phoneError.value && countdown.value === 0) {
			getPhoneCaptcha(phone.value);
			startCountdown();
		}
	}
};

// 手机号格式验证
const validatePhoneNumber = () => {
	const phoneRegex = /^1\d{10}$/;
	phoneError.value = !phoneRegex.test(phone.value);
};

// 用户名格式验证
const validateUsername = () => {
	const usernameRegex = /^[a-zA-Z0-9_-]+$/;
	usernameError.value = !usernameRegex.test(username.value);
};

// 重复密码验证
const validatePassword = () => {
	passwordError.value = password.value.length < 6;
	passwordMatchError.value = password.value !== rePassword.value;
};

// 注册接口
async function initRoll() {
	validateUsername();
	validatePassword();
	validatePhoneNumber();
	
	if (usernameError.value || passwordError.value || phoneError.value || !isSNValid.value || passwordMatchError.value) {
		return;
	}
	
	isLoading.value = true;
	try {
		const res = await postRegister(username.value, password.value, phone.value, captcha.value, snCode.value, deviceName.value);
		if (res.status === 200) {
			ElMessage({
				showClose: true,
				message: res.data,
			});
			Router.push('/login');
		}
	} catch (e) {
		console.log(e);
	} finally {
		isLoading.value = false;
		await router.push({
			path: '/login',
			query: { us: username.value, pwd: password.value }
		});
	}
}
</script>

<style scoped>
.text-red-500 {
	color: #ef4444;
}
</style>