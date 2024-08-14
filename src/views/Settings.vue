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
                                设备管理
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
                        <hr class="my-6 border-gray-600" />
                        <li>
                            <button
                                @click="scrollToSection('section3'); activeSection = 'section3'"
                                :class="{ 'bg-green-600': activeSection === 'section3' }"
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
                    <div id="section1" class="section rounded p-20">
                        <h1 class="text-4xl text-white mb-6">设备列表</h1>
                        <div class="mb-12">
                            <TableTemplate :header="header" :column="column" :showButton="true" buttonLabel="Del"/>
                        </div>
                        <el-divider/>
                        <h1 class="text-3xl text-white mb-6 mt-12">SN 码激活</h1>
                        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form class="space-y-2" @submit.prevent="addEquipment">
                                <div>
                                    <label for="sn" class="block text-sm font-medium leading-6 text-white p-2">设备
                                        SN 码</label>
                                    <div class="mt-1">
                                        <input v-model="sn" id="sn" name="sn" type="text" required
                                               class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1
                                                ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                                 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                    </div>
                                </div>

                                <div>
                                    <label for="en"
                                           class="block text-sm font-medium leading-6 text-white p-2">设备名</label>
                                    <div class="mt-1">
                                        <input v-model="en" id="en" name="en" type="text" required
                                               class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1
                                                ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                                 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                    </div>
                                </div>

                                <div class="pt-6">
                                    <SubmitButton :loading="addLoading">添加设备</SubmitButton>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div id="section2" class="section text-white rounded">
                        <h2>Section 2</h2>
                        <p>This is the content of Section 2.</p>
                    </div>
                    <div id="section3" class="section text-white rounded">
                        <h2>Section 3</h2>
                        <p>This is the content of Section 3.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
import { onMounted, ref } from "vue";
import { postEquipmentAdd } from "@/server/request-apis.js";
import TableTemplate from "@/components/TableTemplate.vue";
import { useAuthStore } from "@/stores/userStore.js";
import { storeToRefs } from "pinia";
import { transposeMatrix } from "@/utils/tools-functions.js";
import SubmitButton from "@/components/SubmitButton.vue";
import {ElMessage} from "element-plus";

const addLoading = ref(false);
const activeSection = ref('section1');

const authStore = useAuthStore();
const { SCGData } = storeToRefs(authStore);

const header = ref(['SN 码', '设备名称', '注册时间']);
const column = ref(transposeMatrix([SCGData.value[0], SCGData.value[1], SCGData.value[2]]));

const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 180;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
};

const sn = ref('');
const en = ref('');

async function addEquipment() {
    addLoading.value = true;
    try {
        await postEquipmentAdd(sn.value, en.value);
        await refreshEquipments();
    } catch (error) {
        console.error("添加设备失败:", error);
        ElMessage({
            showClose: true,
            message: 'res.data',
        });
    } finally {
        addLoading.value = false;
    }
}

async function refreshEquipments() {
    try {
        await authStore.getEquipments(); // 更新 SCGData
        column.value = transposeMatrix([SCGData.value[0], SCGData.value[1], SCGData.value[2]]);
    } catch (error) {
        console.error("刷新设备列表失败:", error);
    }
}

onMounted(async () => {
    // await refreshEquipments();
});
</script>

<style scoped>
.content {
    flex: 1;
}

.section {
    height: 55rem;
    padding: 5rem;
}

:deep(.el-menu){
    background: transparent !important;
    border-right: 0;
}

</style>
