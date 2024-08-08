<template>
    <div class="space-y-4 text-center size-full">
        <div class="flex md:flex-row flex-col justify-between items-center bg-slate-600 pt-2 pb-2 h-40 rounded space-x-2">
            <div class="flex items-center justify-center h-full w-1/3 rounded-tl rounded-bl pl-20 pr-20">
                <MultiSelect v-model="selectedValues" />
            </div>
            <div class="flex items-center justify-center h-full w-1/3 rounded-tl rounded-bl pl-10 pr-10">
                <TimeDatePicker v-model="timeRange"/>
            </div>
            <div class="flex items-center justify-center h-full w-1/3 rounded-tl rounded-bl p-20">
                <SubmitButton class="bg-pink-600">
                    图表加载
                </SubmitButton>
            </div>
        </div>
        <div class="bg-slate-400 p-2 w-full history-chart rounded">
            <h1 class="text-9xl text-green-300 ">ANALYSIS DATA PAGES</h1>
        </div>
    </div>
</template>

<script setup>
import SubmitButton from "@/components/SubmitButton.vue";
import {getTimeRange} from '@/utils/tools-functions.js'
import {ref} from "vue";
import TimeDatePicker from "@/components/TimeDatePicker.vue";
import MultiSelect from "@/components/MultiSelect.vue";


const timeRange = ref(getTimeRange(6))
const selectedValues = ref([]);

</script>

<style scoped lang="less">
.history-chart {
    height: 55rem;
}

</style>