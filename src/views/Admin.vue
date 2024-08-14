<template>
    <div class="space-y-2 size-full">
        <div class="flex md:flex-row flex-col justify-between">
            <div class="md:w-1/6 sticky pr-6 border-r pt-6">
                <!-- Sticky menu -->
                <nav class="space-y-2 sticky top-52 text-white">
                    <ul class="space-y-2">
                        <li>
                            <button
                                @click="scrollToSection('section1'); activeSection = 'section1'"
                                :class="{ 'bg-green-600': activeSection === 'section1' }"
                                class="w-full text-left p-2 hover:bg-green-600 rounded"
                            >
                                SN 码注册
                            </button>
                        </li>
                        <li>
                            <button
                                @click="scrollToSection('section2'); activeSection = 'section2'"
                                :class="{ 'bg-green-600': activeSection === 'section2' }"
                                class="w-full text-left p-2 hover:bg-green-600 rounded"
                            >
                                用户列表
                            </button>
                        </li>
                        <li>
                            <button
                                @click="scrollToSection('section3'); activeSection = 'section2'"
                                :class="{ 'bg-green-600': activeSection === 'section3' }"
                                class="w-full text-left p-2 hover:bg-green-600 rounded"
                            >
                                设备列表
                            </button>
                        </li>
                        <hr class="my-6 border-gray-600" />
                        <li>
                            <button
                                @click="scrollToSection('section4'); activeSection = 'section3'"
                                :class="{ 'bg-green-600': activeSection === 'section4' }"
                                class="w-full text-left p-2 hover:bg-green-600 rounded"
                            >
                                Mqtt连接测试
                            </button>
                        </li>

                    </ul>
                </nav>
            </div>
            <div class="md:w-5/6">
                <div class="content space-y-4 pr-4 pl-4">
                    <div id="section1" class="section rounded bg-gray-800 p-8">
                        <h1 class="text-4xl text-white mb-6">SN 码注册</h1>
                        <hr class="my-6 border-gray-600"/>
                        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form class="space-y-6" @submit.prevent="addSN">
                                <div>
                                    <label for="em"
                                           class="block text-sm font-medium leading-6 text-white">SN码生成</label>
                                    <div class="mt-2 flex">
                                        <input v-model="sn" id="em" name="sn" type="text" autocomplete="text" required
                                               class="block w-full rounded-l-md border-0 p-2 text-gray-900 shadow-sm ring-1
                                               ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2
                                               focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                        <button type="button" @click="generateRandomString"
                                                class="bg-emerald-600 text-white rounded-r-md px-4 py-2 text-sm font-semibold
                                                hover:bg-emerald-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                                            Gen
                                        </button>
                                    </div>
                                </div>
                                <div class="pt-4">
                                    <SubmitButton :loading="isLoading">Sign in</SubmitButton>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div id="section2" class="section text-white rounded bg-gray-800 p-8">
                        <h1 class="text-4xl text-white mb-6">用户列表</h1>
                        <hr class="my-6 border-gray-600"/>
                    </div>
                    <div id="section3" class="section text-white rounded bg-gray-800 p-8">
                        <h1 class="text-4xl text-white mb-6">设备列表</h1>
                        <hr class="my-6 border-gray-600"/>
                    </div>
                    <div id="section4" class="section text-white rounded bg-gray-800 p-8">
                        <h1 class="text-4xl text-white mb-6">Mqtt连接测试</h1>
                        <hr class="my-6 border-gray-600"/>
                        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form class="space-y-6" @submit.prevent="addSN">
                                <div>
                                    <label for="em"
                                           class="block text-sm font-medium leading-6 text-white">订阅的主题</label>
                                    <div class="mt-2 flex">
                                        <input v-model="sn" id="em" name="sn" type="text" autocomplete="text" required
                                               class="block w-full rounded-l-md border-0 p-2 text-gray-900 shadow-sm ring-1
                                               ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2
                                               focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
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
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="js">
import {ref} from 'vue';
import {ElMessage} from 'element-plus';
import {postAddSN} from '@/server/request-apis';
import SubmitButton from "@/components/SubmitButton.vue";

const sn = ref('');
const isLoading = ref(false);
const activeSection = ref('section1');

const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 180;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({top, behavior: 'smooth'});
    }
};

function generateRandomString() {
    const firstChar = 'abcd'[Math.floor(Math.random() * 4)];
    const remainingChars = Array.from({length: 11}, () => {
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


<style scoped>
.content {
    flex: 1;
}

.section {
    height: 55rem;
    padding: 5rem;
}
</style>
