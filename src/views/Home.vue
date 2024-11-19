<template>
	<div class="space-y-4 text-center size-full rounded-2xl inner-shadow bg-[#f5f5f5]">
		<div class="flex p-4 rounded h-h">
			<p class="text-6xl font-bold m-auto">
				【<span class="text-amber-400">杨陵子石</span>】
				【<span class="text-amber-400">{{ response }}</span>】
			</p>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
//
// const response = ref('');
// let socket;
//
// const params = {
// 	userId: '12345', // 示例参数
// 	token: 'abcdef'  // 示例参数
// };
//
// // 将参数拼接到 WebSocket URL
// const queryString = new URLSearchParams(params).toString();
// const wsUrl = `/fws/ws?${queryString}`;
//
// onMounted(() => {
// 	socket = new WebSocket(wsUrl);
//
// 	socket.onmessage = (event) => {
// 		response.value = event.data; // 处理接收到的随机数
// 	};
//
// 	socket.onopen = () => {
// 		console.log('WebSocket connection opened');
// 	};
//
// 	socket.onerror = (error) => {
// 		console.error('WebSocket error:', error);
// 	};
//
// 	socket.onclose = () => {
// 		console.log('WebSocket connection closed');
// 	};
// });
//
// onBeforeUnmount(() => {
// 	if (socket) {
// 		socket.close(); // 关闭 WebSocket 连接
// 	}
// });
</script>


<style scoped>
.h-h {
	height: calc(100vh - 272px);
}

</style>
