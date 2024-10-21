<template>
    <el-date-picker
        v-model="localTimeRange"
        type="datetimerange"
        value-format="YYYY-MM-DD HH:mm:ss"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :shortcuts="shortcuts"
    />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import {getTimeRange} from "@/utils/tools-functions";

interface DateRangePickerProps {
    modelValue?: [string, string]
    hours?: number
}

const props = withDefaults(defineProps<DateRangePickerProps>(), {
    modelValue: () => getTimeRange(24),
    hours: 24
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: [string, string]): void
}>()

const localTimeRange = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

watch(
    () => props.modelValue,
    (newValue) => {
        localTimeRange.value = newValue
    }
)


//Element的时间日期选择器的预设时间
const shortcuts = [
    {
        text: '1 小时',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 1)
            return [start, end]
        },
    },
    {
        text: '3 小时',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 3)
            return [start, end]
        },
    },
    {
        text: '6 小时',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 6)
            return [start, end]
        },
    },
    {
        text: '12 小时',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 12)
            return [start, end]
        },
    },
    {
        text: '24 小时',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            return [start, end]
        },
    },
    {
        text: '今天',
        value: () => {
            const start = new Date()
            start.setHours(0, 0, 0, 0)
            const end = new Date()
            // end.setHours(23, 59, 59, 999)
            return [start, end]
        },
    },
    {
        text: '昨天',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 1)
            start.setHours(0, 0, 0, 0)
            end.setDate(end.getDate() - 1)
            end.setHours(23, 59, 59, 999)
            return [start, end]
        },
    },
    {
        text: '三天',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
            return [start, end]
        },
    },
    {
        text: '一周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '一个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '三个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
    {
        text: '六个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            return [start, end]
        },
    },
]
</script>

<style scoped>
:deep(.el-date-range-picker .el-picker-panel__body ){
	@media (max-width: 768px) {
		width: 323px !important;
	}
}

:deep(.el-date-range-picker__editors-wrap) {
	@media (max-width: 768px) {
		display: flex !important;
	}
}

:deep(.el-date-range-picker__content) {
	@media (max-width: 768px) {
		width: 100% !important;
	}
}

:deep(.el-picker-panel [slot=sidebar], .el-picker-panel__sidebar) {
	width: 70px !important;
}

:deep(.el-picker-panel [slot=sidebar]+.el-picker-panel__body, .el-picker-panel__sidebar+.el-picker-panel__body) {
	margin-left: 70px !important;
}

:deep(.el-date-range-picker) {
	width: 393px !important;
}
</style>