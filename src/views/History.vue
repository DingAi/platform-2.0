<template>
    <div class="space-y-4 text-center size-full">
        <div class="flex md:flex-row flex-col justify-between items-center bg-slate-600 pt-2 pb-2 h-40 rounded space-x-2">
            <div class="flex items-center justify-center h-full w-1/3 rounded-tl rounded-bl pl-20 pr-20">
                <el-cascader
                    style="--el-color-primary:#22c55e"
                    :options="options"
                    :props="props"
                    size="large"
                    collapse-tags
                    collapse-tags-tooltip
                    clearable
                    class="w-full"
                />
            </div>
            <div class="w-1/2 h-full"></div>
            <div class="flex items-center justify-center h-full w-1/3 rounded-tl rounded-bl p-20">
                <SubmitButton class="">
                    图表加载
                </SubmitButton>
            </div>
        </div>
        <div class="bg-slate-400 p-2 w-full history-chart rounded">
            <h1 class="text-9xl text-green-300 ">ANALYSIS DATA PAGES</h1>
        </div>
    </div>
</template>

<script setup lang="ts">
import SubmitButton from "@/components/SubmitButton.vue";

const props = { multiple: true }
const options = [
    {
        value: 1,
        label: 'Asia',
        children: [
            {
                value: 2,
                label: 'China',
                children: [
                    { value: 3, label: 'Beijing' },
                    { value: 4, label: 'Shanghai' },
                    { value: 5, label: 'Hangzhou' },
                ],
            },
            {
                value: 6,
                label: 'Japan',
                children: [
                    { value: 7, label: 'Tokyo' },
                    { value: 8, label: 'Osaka' },
                    { value: 9, label: 'Kyoto' },
                ],
            },
            {
                value: 10,
                label: 'Korea',
                children: [
                    { value: 11, label: 'Seoul' },
                    { value: 12, label: 'Busan' },
                    { value: 13, label: 'Taegu' },
                ],
            },
        ],
    },
    {
        value: 14,
        label: 'Europe',
        children: [
            {
                value: 15,
                label: 'France',
                children: [
                    { value: 16, label: 'Paris' },
                    { value: 17, label: 'Marseille' },
                    { value: 18, label: 'Lyon' },
                ],
            },
            {
                value: 19,
                label: 'UK',
                children: [
                    { value: 20, label: 'London' },
                    { value: 21, label: 'Birmingham' },
                    { value: 22, label: 'Manchester' },
                ],
            },
        ],
    },
    {
        value: 23,
        label: 'North America',
        children: [
            {
                value: 24,
                label: 'US',
                children: [
                    { value: 25, label: 'New York' },
                    { value: 26, label: 'Los Angeles' },
                    { value: 27, label: 'Washington' },
                ],
            },
            {
                value: 28,
                label: 'Canada',
                children: [
                    { value: 29, label: 'Toronto' },
                    { value: 30, label: 'Montreal' },
                    { value: 31, label: 'Ottawa' },
                ],
            },
        ],
    },
]
</script>

<style scoped lang="less">
.history-chart {
    height: 55rem;
}

</style>