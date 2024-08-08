<template>
    <div class="text-white text-6xl">
        <h1>Single Channel Equipment</h1>
        <p>Equipment ID: {{ equipmentId }}</p>
        <!-- 其他组件内容 -->
    </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()
const equipmentId = ref(route.params.id)

// 监听路由参数变化，更新设备ID
watch(() => route.params.id, (newId) => {
    equipmentId.value = newId
    // 在这里可以执行数据获取或其他操作
})
</script>
