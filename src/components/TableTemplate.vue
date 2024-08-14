<template>
    <div class="overflow-x-auto p-2">
        <table class="min-w-full bg-gray-800 text-gray-500">
            <thead class="bg-indigo-600 text-white">
            <tr>
                <!-- Render table headers dynamically -->
                <th v-for="(head, index) in header" :key="index"
                    class="px-6 py-3.5 text-left text-sm font-bold text-white">
                    {{ head }}
                </th>
                <!-- Conditionally render the button column header -->
                <th v-if="showButton" class="px-6 py-3.5 text-left text-sm font-bold text-white">
                    Actions
                </th>
            </tr>
            </thead>
            <tbody>
            <!-- Render table rows dynamically -->
            <tr v-for="(row, rowIndex) in column" :key="rowIndex"
                class="border-t border-gray-600 hover:bg-slate-700 transition-colors duration-300 ease-in-out">
                <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="px-6 py-3 text-sm text-gray-300">
                    {{ cell }}
                </td>
                <!-- Conditionally render the button column -->
                <td v-if="showButton" class="px-6 py-3 text-sm text-gray-300">
                    <button @click="handleButtonClick(rowIndex)" class="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-500">
                        {{ buttonLabel }}
                    </button>
                </td>
            </tr>
            <!-- Handle empty table state -->
            <tr v-if="column.length === 0">
                <td :colspan="header.length + (showButton ? 1 : 0)" class="px-6 py-4 text-center text-sm text-gray-500">
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
})

// Handle button click event
const handleButtonClick = (rowIndex) => {
    if (props.onButtonClick) {
        props.onButtonClick(rowIndex)
    }
}
</script>

<style scoped>
</style>
