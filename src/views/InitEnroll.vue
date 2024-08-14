<template>
    <div class="flex min-h-full flex-col justify-center px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="@/assets/vue.svg"
                 alt="Your Company">
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">初始注册</h2>
        </div>

        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-2" @submit.prevent="initRoll">
                <div>
                    <label for="usr" class="block text-sm font-medium leading-6 text-white">用户名</label>
                    <div class="mt-2">
                        <input v-model="us" id="usr" name="username" type="text" autocomplete="text" required
                               class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    </div>
                </div>
                <div>
                    <div class="flex items-center justify-between">
                        <label for="pwd"
                               class="block text-sm font-medium leading-6 text-white p-2">密码</label>
                    </div>
                    <div class="mt-2">
                        <input v-model="pwd" id="pwd" name="password" type="password" autocomplete="current-password"
                               required
                               class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    </div>
                </div>
                <div>
                    <label for="em" class="block text-sm font-medium leading-6 text-white p-2">邮箱</label>
                    <div class="mt-2 flex">
                        <input v-model="em" id="em" name="email" type="email" autocomplete="email" required
                               class="block w-full rounded-l-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset
                               ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600
                                sm:text-sm sm:leading-6">
                        <button type="button" :disabled="countdown > 0" @click="handleButtonClick"
                                class="text-white rounded-r-md px-4 py-2 text-sm font-semibold focus:z-10 focus:ring-2
                                focus:ring-inset focus:ring-indigo-600"
                                :class="countdown > 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'">
                            {{ countdown > 0 ? `${countdown}s` : 'Verify' }}
                        </button>
                    </div>
                </div>
                <div>
                    <label for="captcha" class="block text-sm font-medium leading-6 text-white p-2">邮箱验证码</label>
                    <div class="mt-2">
                        <input v-model="cap" name="captcha" type="text" required
                               class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium leading-6 text-white p-2">手机号</label>
                    <div class="mt-2">
                        <input v-model="cap" name="captcha" type="text" required
                               class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    </div>
                </div>
                <div>
                    <label for="sn" class="block text-sm font-medium leading-6 text-white p-2">SN码</label>
                    <div class="mt-2">
                        <input v-model="sn" name="sn" type="text" required
                               class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    </div>
                </div>
                <div>
                    <label for="sn" class="block text-sm font-medium leading-6 text-white p-2">设备名</label>
                    <div class="mt-2">
                        <input v-model="en" name="sn" type="text" required
                               class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
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
import {getEmailCaptcha, postInitRoll} from '@/server/request-apis';
import {ref} from 'vue';
import {ElMessage} from 'element-plus';
import Router from "@/router/index.js";
import SubmitButton from "@/components/SubmitButton.vue";

const isLoading = ref(false);

const us = ref('');
const pwd = ref('');
const em = ref('');
const sn = ref('');
const en = ref('');
const cap = ref('');

const countdown = ref(0)
let countdownTimer = null

const startCountdown = () => {
    countdown.value = 60
    countdownTimer = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value -= 1
        } else {
            clearInterval(countdownTimer)
            countdownTimer = null
        }
    }, 1000)
}

const handleButtonClick = () => {
    if (countdown.value === 0) {
        getEmailCaptcha(em.value)
        startCountdown()
    }
}

async function initRoll() {
    isLoading.value = true;
    try {
        const res = await postInitRoll(us.value, pwd.value, em.value, cap.value, sn.value, en.value);
        if (res.status === 200) {
            ElMessage({
                showClose: true,
                message: res.data,
            });
            Router.push('/login')
        }
    } catch (e) {
        console.log(e);
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped>
.cursor-not-allowed {
    cursor: not-allowed;
}
.bg-gray-500 {
    background-color: #6b7280;
}
.bg-green-600 {
    background-color: #16a34a;
}
.hover\:bg-green-500:hover {
    background-color: #22c55e;
}
</style>
