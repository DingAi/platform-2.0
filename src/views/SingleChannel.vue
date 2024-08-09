<template>
    <div class="space-y-4 text-center size-full">
        <div class="flex md:flex-row justify-between items-center space-x-4 h-96 rounded">
            <div class="rounded bg-indigo-600 w-1/3 h-full p-4">
                <span class="text-6xl text-white">
                    {{equipmentName}}
                </span>
            </div>
            <div class="rounded bg-pink-600 w-2/3 h-full p-4">
                <span class="text-6xl text-white">
                    {{equipmentId}}
                </span>
            </div>
        </div>
        <div class="flex md:flex-row flex-col justify-between items-center bg-gray-700 pt-2 pb-2 h-96 rounded">

        </div>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useRoute} from 'vue-router'
const route = useRoute()
const equipmentId = ref(route.params.id)


const SCGData = JSON.parse(localStorage.getItem('auth')).SCGData;
console.log(SCGData)
// 找到SN码在SCGData中的索引index
let index = SCGData[0].indexOf(equipmentId.value);
// 使用索引来找到对应的设备名
const equipmentName = ref(SCGData[1][index]);



// 监听路由参数变化，更新设备ID
watch(() => route.params.id, (newId) => {
    equipmentId.value = newId
    // 在这里可以执行数据获取或其他操作
    let index = SCGData[0].indexOf(equipmentId.value);
    console.log(index)
    equipmentName.value = ref(SCGData[1][index]);

})
</script>
