<template>
	<el-cascader
		v-model="selectedValues"
		:options="cascaderOptions"
		multiple
		:props="cascaderProps"
		placeholder="请选择"
		@change="handleChange"
		class="w-full"
	/>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// 接收外部传入的数据
const {options} = defineProps({
	options: {
		type: Array,
		required: true
	}
})

// 向父组件传递事件
const emit = defineEmits(['update:selectedValues'])

// 选中的值
const selectedValues = ref([])

// 级联选择器的选项
const cascaderOptions = ref([])

// 定义级联选择器的属性
const cascaderProps = {
	multiple: true,
	checkStrictly: true, // 可以选择任意一级，不必选到最后一级
	value: 'value', // 选项的值字段
	label: 'label', // 选项的标签字段
	children: 'children' // 子级字段
}

// 监听选中值的变化
watch(selectedValues, (newValues) => {
	emit('update:selectedValues', newValues)
})

// 监听外部数据变化
watch(() => options, (newData) => {
	cascaderOptions.value = newData
}, { immediate: true })

onMounted(() => {
	// 初次加载时使用传入的数据初始化选项
	cascaderOptions.value = options
})

// 处理选中值变化
const handleChange = (value) => {
	emit('update:selectedValues', value)
}
</script>

<style scoped>
/* 根据需求自定义样式 */
</style>
