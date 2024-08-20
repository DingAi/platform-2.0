<template>
    <div class="overflow-x-auto">
        <!-- 显示加载状态 -->
        <div v-if="isLoading" class="flex justify-center items-center py-4">
            <div class="text-gray-500 text-sm">Loading...</div>
        </div>

        <!-- 显示表格内容 -->
        <table v-else class="min-w-full bg-gray-800 text-gray-500">
            <thead class="bg-gray-900 text-white">
            <tr>
                <!-- 添加序号列 -->
                <th class="px-6 py-3.5 text-left text-sm font-bold text-white">Index</th>
                <th v-for="(head, index) in header" :key="index"
                    class="px-6 py-3.5 text-left text-sm font-bold text-white">
                    {{ head }}
                </th>
                <th v-if="showButton" class="px-6 py-3.5 text-left text-sm font-bold text-white">
                    Actions
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, rowIndex) in column" :key="rowIndex"
                class="border-t border-gray-600 hover:bg-slate-700 transition-colors duration-300 ease-in-out">
                <!-- 渲染序号 -->
                <td class="px-6 py-3 text-sm text-gray-300">
                    {{ rowIndex + 1 }}
                </td>
                <td v-for="(cell, cellIndex) in row" :key="cellIndex"
                    :class="[columnStyles[cellIndex] || '', 'px-6 py-3 text-sm text-gray-300']">
                    {{ cell }}
                </td>
                <td v-if="showButton" class="px-6 py-3 text-sm text-gray-300">
                    <button @click="handleButtonClick(rowIndex)"
                            class="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-500">
                        {{ buttonLabel }}
                    </button>
                </td>
            </tr>
            <tr v-if="column.length === 0">
                <td :colspan="header.length + 1 + (showButton ? 1 : 0)"
                    class="px-6 py-4 text-center text-sm text-gray-500">
                    No data available
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    header: {
        type: Array,
        required: true,
    },
    column: {
        type: Array,
        required: true,
    },
    isLoading: {
        type: Boolean,
        default: true,
    },
    showButton: {
        type: Boolean,
        default: false,
    },
    buttonLabel: {
        type: String,
        default: 'Action',
    },
    onButtonClick: {
        type: Function,
        default: null,
    },
    columnStyles: {
        type: Array,
        default: () => [],
    },
})

const handleButtonClick = (rowIndex) => {
    if (props.onButtonClick) {
        props.onButtonClick(rowIndex)
    }
}
</script>

<style scoped>
</style>
