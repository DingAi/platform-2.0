<template>
	<div class="flex min-h-full flex-col justify-center px-6 py-20 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-sm mt-6">
			<img class="mx-auto h-10 w-auto" src="@/assets/vue.svg"
			     alt="Your Company">
			<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">用户登录</h2>
		</div>
		
		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<form class="space-y-6" @submit.prevent="login">
				<div>
					<label for="username" class="block text-sm font-medium leading-6 p-2">用户名</label>
					<div class="mt-2">
						<input v-model="username" id="username" name="username" type="text" required
						       class="block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ring-gray-300
						       placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3F51B5] sm:text-sm
						       sm:leading-6">
					</div>
				</div>
				
				<div>
					<div class="flex items-center justify-between">
						<label for="password" class="block text-sm font-medium leading-6 p-2">密码</label>
						<div class="text-sm">
							<router-link to="/modify-pwd"
							             class="font-semibold text-theme-1-color-1 hover:bg-theme-1-color-2">忘记密码?
							</router-link>
						</div>
					</div>
					<div class="mt-2 mb-2">
						<input v-model="password"
						       id="password"
						       name="password"
						       type="password"
						       autocomplete="current-password"
						       required
						       class="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300
						       placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3F51B5] sm:text-sm
						       sm:leading-6">
					</div>
					<div class="text-sm text-right">
						<router-link to="/register" class="font-bold text-theme-1-color-1 hover:bg-theme-1-color-2">注册
						</router-link>
					</div>
				</div>
				
				<div class="pt-2">
					<SubmitButton :loading="isLoading" class="glowing-button">登录</SubmitButton>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="js">
import {ref} from "vue";
import {useAuthStore} from "@/stores/userStore.js";
import SubmitButton from "@/components/SubmitButton.vue";
import {useRoute} from "vue-router";

// 表单用提交按钮动画加载状态
const isLoading = ref(false);

// Pinia的用户仓库
const authStore = useAuthStore();

// 接收登录或者修改密码路由传输过来的用户名和密码
const route = useRoute();
const username = ref(route.query.us || '');
const password = ref(route.query.pwd || '');

// 登录之后获取的用户数据和设备数据的处理在Pinia的仓库中处理
async function login() {
	isLoading.value = true;
	try {
		await authStore.login(username.value, password.value);
	} catch (e) {
		console.log(e)
	} finally {
		isLoading.value = false;
	}
}
</script>

<style scoped>

</style>