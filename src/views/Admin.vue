<template>
    <div class="flex min-h-full flex-col justify-center px-6 py-20 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm mt-6">
            <img class="mx-auto h-10 w-auto" src="@/assets/vue.svg" alt="Your Company">
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">管理员测试界面</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="addSN">
                <div>
                    <label for="em" class="block text-sm font-medium leading-6 text-white">SN码生成</label>
                    <div class="mt-2 flex">
                        <input v-model="sn" id="em" name="sn" type="text" autocomplete="text" required
                               class="block w-full rounded-l-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset
                   ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset
                   focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        <button type="button" @click="generateRandomString"
                                class="bg-emerald-600 text-white rounded-r-md px-4 py-2 text-sm font-semibold
                    hover:bg-emerald-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                            Verify
                        </button>
                    </div>
                </div>
                <div class="pt-4">
                    <SubmitButton :loading="isLoading">Sign in</SubmitButton>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { postAddSN } from '@/server/request-apis';
import SubmitButton from "@/components/SubmitButton.vue";

const sn = ref('');
const isLoading = ref(false);

function generateRandomString() {
    const firstChar = 'abcd'[Math.floor(Math.random() * 4)];
    const remainingChars = Array.from({ length: 11 }, () => {
        const charType = Math.floor(Math.random() * 2);
        if (charType === 0) {
            return String.fromCharCode(Math.floor(Math.random() * 26) + 97); // a-z
        } else {
            return Math.floor(Math.random() * 10).toString(); // 0-9
        }
    });
    sn.value = firstChar + remainingChars.join('');
}

async function addSN() {
    isLoading.value = true;
    try {
        const res = await postAddSN(sn.value);
        if (res.status === 200) {
            ElMessage({
                showClose: true,
                message: res.data,
            });
        }
    } catch (e) {
        console.log(e);
    } finally {
        isLoading.value = false;
    }
}
</script>
