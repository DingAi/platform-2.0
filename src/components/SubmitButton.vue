<template>
	<button :class="['flex w-full justify-center items-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 ' +
     'text-white shadow-sm',
      loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500']" :disabled="loading">
    <span v-if="loading" class="loader-container">
      <span class="loader"></span>
      <span class="loading-text">Loading...</span>
    </span>
		<slot v-else>Default Button Text</slot>
	</button>
</template>

<script setup lang="js">
const props = defineProps({
	loading: Boolean
});
</script>

<style scoped>
button {
	transition: background-color 0.3s ease, color 0.3s ease;
}

.loader-container {
	display: flex;
	align-items: center;
	gap: 0.5rem; /* 控制圆环和文本之间的间距 */
}

.loader {
	border: 2px solid rgba(255, 255, 255, 0.3);
	border-top-color: white;
	border-radius: 50%;
	width: 1em;
	height: 1em;
	animation: spin 1s linear infinite;
}

.loading-text {
	font-size: 0.875rem; /* 控制文本大小 */
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
