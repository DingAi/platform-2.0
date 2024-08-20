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
                                日志
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
                        <div class="mb-12 max-h-64 overflow-auto">
                            <TableTemplate :header="header" :column="column" :showButton="true" buttonLabel="Del"
                                           :onButtonClick="deleteClick" :isLoading="addLoading"/>
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
                        <h1 class="text-4xl text-white mb-6 mt-12">日志</h1>
                        <hr class="my-6 border-gray-600" />
                        <TableTemplate :header="logHeader" :column="logCol" :isLodding="logLoading"/>
                    </div>
                    <div id="section3" class="section text-white rounded">
                        <h2>Section 3</h2>
                        <p>This is the content of Section 3.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <el-dialog v-model="dialogVisible" title="确定要删除设备【xxx】?" width="500">
        <p>请输入<span class="text-pink-600">“删除设备”</span>：</p>
        <div class="mt-2">
            <el-input v-model="delText"  placeholder="Please input" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteEquipment">
                    删除
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="js">
import { onMounted, ref } from "vue";
import {getLogData, postDeleteEquipment, postEquipmentAdd} from "@/server/request-apis.js";
import TableTemplate from "@/components/TableTemplate.vue";
import { useAuthStore } from "@/stores/userStore.js";
import { storeToRefs } from "pinia";
import { transposeMatrix } from "@/utils/tools-functions.js";
import SubmitButton from "@/components/SubmitButton.vue";
import {ElMessage} from "element-plus";

const addLoading = ref(false);
const logLoading = ref(false);
const activeSection = ref('section1');
const dialogVisible = ref(false)
const delText = ref('')

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
        await getLog();
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

const logHeader = ref(['信息','时间'])
const logCol = ref([])
async function getLog() {
    try {
        logLoading.value = true;
        const res =  await getLogData();
        logCol.value = transposeMatrix(res.data['log'])
        console.log(res.data['log'])
    } catch (error) {
        console.log(error)
    } finally {
        logLoading.value = false;
    }
}

const clickRowIndex = ref(null)
function deleteClick(rowIndex) {
    //在组件中已经声明了行索引所以可以直接在这里调用
    dialogVisible.value = true;
    clickRowIndex.value = rowIndex;
}

async function deleteEquipment() {
    if (delText.value === '删除设备') {
        try{
            let index = Number(clickRowIndex.value)
            console.log(index)
            const eqRes = await postDeleteEquipment(SCGData.value[0][index]);
            dialogVisible.value = false
            ElMessage({
                showClose: true,
                message: eqRes.data,
            });
        } catch (e) {
            console.log(e)
        } finally {
            await refreshEquipments();
            delText.value = ''
        }
    }
}

onMounted(async () => {
    await getLog()
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
