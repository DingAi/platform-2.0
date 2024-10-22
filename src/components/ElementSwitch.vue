<template>
	<div class="size-full">
		<el-switch :v-model="modelValue"
		           :active-value="1"
		           :inactive-value="0"
		           size="large"
		           @change="handleSwitchChange">
			<template #active-action>
				<span class="custom-active-action">T</span>
			</template>
			<template #inactive-action>
				<span class="custom-inactive-action">F</span>
			</template>
		</el-switch>
		<span class="text-sm text-white p-2">-{{ switchName }}</span>
	</div>
</template>

<script setup>
import { watch } from 'vue';

const {modelValue, switchName} = defineProps({
	modelValue: {
		type: Boolean,
		default: 0,
		required: true
	},
	switchName: {
		type: String,
		default: 'Switch'
	}
});

const emit = defineEmits(['update:modelValue', 'change']);

const handleSwitchChange = (value) => {
	emit('change', value);
	emit('update:modelValue', value);  // 更新父组件中的值
};

watch(() => modelValue, (newValue) => {
	emit('update:modelValue', newValue);  // 确保modelValue的变化能够更新父组件
});
</script>

<style scoped>
/* 自定义样式 */
</style>
