<template>
    <div class="overflow-x-auto">
        <table class="min-w-full bg-white text-gray-500">
            <thead class="bg-pink-600">
            <tr class="">
                <!-- Render table headers dynamically -->
                <th v-for="(head, index) in header" :key="index"
                    class="px-6 py-3.5 text-left text-sm font-bold text-gray-700">
                    {{ head }}
                </th>
            </tr>
            </thead>
            <tbody>
            <!-- Render table rows dynamically -->
            <tr v-for="(row, rowIndex) in column" :key="rowIndex" class="border-t border-gray-300 hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="px-6 py-3 text-sm text-gray-900">
                    {{ cell }}
                </td>
            </tr>
            <!-- Handle empty table state -->
            <tr v-if="column.length === 0">
                <td :colspan="header.length" class="px-6 py-4 text-center text-sm text-gray-500">
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
})
</script>

<style scoped>

</style>
