<template>
	<div class="space-y-4 text-center size-full">
		<div class="flex items-center p-4 rounded h-h">
			<p class="text-9xl text-green-500 font-bold m-auto">【春眠不觉晓】</p>
		</div>
	</div>
</template>

<script setup>
import {onMounted} from "vue";
import {getTokenTest} from "@/server/request-apis.js";

onMounted(() => {
	getTokenTest();
});
</script>

<style scoped>
.h-h {
	height: 55rem;
	height: calc(100vh - 370px);
}
</style>
