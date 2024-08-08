<template>
    <div class="text-white text-6xl">
        <h1>Server-Sent Events Example</h1>
        <p>Received data: {{ message }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {useAuthStore} from "@/stores/userStore.js";
import { EventSourcePolyfill } from 'event-source-polyfill';

const message = ref('');

// 服务器端的SSE端点URL
const authStore = useAuthStore(); // 重新获取最新的 store 状态
const sseUrl = '/hd/sse/';

onMounted(async () => {
    const eventSource = new EventSourcePolyfill(sseUrl, {
        headers: {
            'Authorization': `${authStore.token}`
        }
    });
    eventSource.onmessage = (event) => {
        message.value = event.data;
    };

    eventSource.onerror = (error) => {
        console.error('SSE连接错误', error);
        eventSource.close();
    };

    onBeforeUnmount(() => {
        eventSource.close();
    });
});
</script>

<style scoped>
/* 可选的样式 */
</style>
