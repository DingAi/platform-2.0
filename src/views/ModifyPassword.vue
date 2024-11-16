<template>
	<div class="flex min-h-full flex-col justify-center px-6 py-10 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-sm mt-6">
			<img class="mx-auto h-10 w-auto" src="@/assets/vue.svg" alt="Your Company">
			<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">修改密码</h2>
		</div>
		
		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<form class="space-y-6" @submit.prevent="modifyPassword">
				<div>
					<label for="phone" class="block text-sm font-medium leading-6 p-2">手机</label>
					<div class="mt-2 flex">
						<input
							v-model="phone"
							id="phone"
							name="phone"
							type="text"
							autocomplete="phone"
							required
							class="block w-full rounded-l-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
						<button
							type="button"
							:disabled="countdown > 0 || phoneError"
							@click="handleButtonClick"
							class="text-white rounded-r-md px-4 py-2 text-sm font-semibold focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
							:class="countdown > 0 || phoneError ? 'bg-gray-500 cursor-not-allowed' : 'bg-theme-1-color-1 hover:bg-theme-1-color-2'">
							{{ countdown > 0 ? `${countdown}s` : '验证' }}
						</button>
					</div>
					<p v-if="phoneError" class="text-red-500 text-sm">请输入有效的手机号。</p>
				</div>
				
				<div>
					<label for="captcha" class="block text-sm font-medium leading-6 p-2">手机验证码</label>
					<div class="mt-2">
						<input
							v-model="cap"
							id="captcha"
							name="captcha"
							type="text"
							required
							class="block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
					</div>
				</div>
				
				<div>
					<div class="flex items-center justify-between">
						<label for="pwd" class="block text-sm font-medium leading-6 p-2">密码</label>
					</div>
					<div class="mt-2">
						<input
							v-model="pwd"
							id="pwd"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							class="block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
						<p v-if="passwordError" class="text-red-500 text-sm">密码长度至少6位。</p>
					</div>
				</div>
				
				<div>
					<div class="flex items-center justify-between">
						<label for="rePwd" class="block text-sm font-medium leading-6 p-2">重复密码</label>
					</div>
					<div class="mt-2">
						<input
							v-model="rePwd"
							id="rePwd"
							name="rePwd"
							type="password"
							autocomplete="current-password"
							required
							class="block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
						<p v-if="passwordMatchError" class="text-red-500 text-sm">两次输入的密码不匹配。</p>
					</div>
				</div>
				
				<div class="pt-6">
					<SubmitButton :loading="isLoading" class="glowing-button">提交</SubmitButton>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="js">
import {ref} from "vue";
import SubmitButton from "@/components/SubmitButton.vue";
import {showMessage} from "@/utils/tools-functions.js";
import {postCaptcha, postModifyPassword} from "@/server/request-apis.js";
import {useRouter} from "vue-router";


const router = useRouter();
// 表单按钮需要的加载状态
const isLoading = ref(false);

// SN 码
const us = ref('');

// 手机号
const phone = ref('');

// 手机验证码
const cap = ref('');

// 设置的密码
const pwd = ref('');

// 重复输入的密码
const rePwd = ref('');

// 手机号格式错误
const phoneError = ref(false);


const passwordError = ref(false);
// 重复密码是否相同
const passwordMatchError = ref(false);

// 验证倒计时
const countdown = ref(0);
let countdownTimer = null;

// 验证倒计时
const startCountdown = () => {
	countdown.value = 90;
	countdownTimer = setInterval(() => {
		if (countdown.value > 0) {
			countdown.value -= 1;
		} else {
			clearInterval(countdownTimer);
			countdownTimer = null;
		}
	}, 1000);
};

// 手机号验证并请求手机验证码
const handleButtonClick = () => {
	validatePhoneNumber();
	if (countdown.value === 0) {
		validatePhoneNumber();
		if (!phoneError.value) {
			postCaptcha(phone.value);
			startCountdown();
		}
	}
};

// 验证手机号
const validatePhoneNumber = () => {
	const phoneRegex = /^1\d{10}$/; // 验证中国手机号格式
	phoneError.value = !phoneRegex.test(phone.value);
};

// 验证密码是否匹配
const validatePassword = () => {
	passwordError.value = pwd.value.length < 6;
	passwordMatchError.value = pwd.value !== rePwd.value;
};

// 发送修改密码请求
const modifyPassword = async () => {
	validatePhoneNumber();
	validatePassword();
	if (phoneError.value || passwordError.value || passwordMatchError.value) {
		return;
	}
	
	isLoading.value = true;
	try {
		const res = await postModifyPassword(phone.value, cap.value, pwd.value);
		showMessage(res.data, 'info');
	} catch (error) {
		showMessage('请求错误，请稍后再试');
		console.error(error);
	} finally {
		isLoading.value = false;
		await router.push({
			path: '/login',
			query: { us: us.value, pwd: pwd.value }
		});
	}
};
</script>

<style scoped>
.text-red-500 {
	color: #ef4444;
}

/* Mobile Styles */
@media (max-width: 640px) {
	.space-y-6 {
		margin-top: 1rem; /* Add spacing for mobile */
	}
	
	.w-full {
		width: 100%; /* Ensure full width on mobile */
	}
	
	.rounded-md {
		border-radius: 0.375rem; /* Standard border radius */
	}
	
	.p-2 {
		padding: 0.5rem; /* Reduce padding for mobile */
	}
}
</style>