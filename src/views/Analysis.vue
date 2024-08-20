<template>
    <div class="space-y-4 text-center size-full">
        <div
            class="flex md:flex-row flex-col justify-between items-center bg-gray-700 pt-2 pb-2 h-40 rounded space-x-2">
            <div class="flex items-center justify-center h-full w-1/3 rounded-tl rounded-bl pl-20 pr-20">
                <MultiSelect v-model="selectedValues"/>
            </div>
            <div class="flex items-center justify-center h-full w-1/3 rounded-tl rounded-bl pl-10 pr-10">
                <TimeDatePicker v-model="timeRange"/>
            </div>
            <div class="flex items-center justify-center h-full w-1/3 rounded-tl rounded-bl p-20">
                <SubmitButton class="">
                    分析数据加载
                </SubmitButton>
            </div>
        </div>
        <div class="flex w-full analysis-div space-x-4">
            <div class="w-1/4 bg-gray-900 rounded p-5">
                <el-timeline style="max-width: 600px">
                    <el-timeline-item center timestamp="2018/4/12" placement="top">
                        <el-card>
                            <h4>Update Github template</h4>
                            <p>Tom committed 2018/4/12 20:46</p>
                        </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2018/4/3" placement="top">
                        <el-card>
                            <h4>Update Github template</h4>
                            <p>Tom committed 2018/4/3 20:46</p>
                        </el-card>
                    </el-timeline-item>
                    <el-timeline-item center timestamp="2018/4/2" placement="top">
                        Event start
                    </el-timeline-item>
                    <el-timeline-item timestamp="2018/4/2" placement="top">
                        Event end
                    </el-timeline-item>
                </el-timeline>
            </div>
            <div class="w-3/4 h-full flex flex-col items-center space-y-4">
                <div class="w-full h-1/2 bg-pink-600 rounded"></div>
                <div class="w-full h-1/2 bg-pink-600 rounded"></div>
            </div>
        </div>
        <div
            class="flex md:flex-row flex-col justify-between items-center bg-gray-700 pt-2 pb-2 h-40 rounded space-x-2">

        </div>
    </div>
</template>

<script setup lang="ts">

import SubmitButton from "@/components/SubmitButton.vue";
import TimeDatePicker from "@/components/TimeDatePicker.vue";
import MultiSelect from "@/components/MultiSelect.vue";
import {ref} from "vue";
import {getTimeRange} from "@/utils/tools-functions";


const timeRange = ref(getTimeRange(6))
const selectedValues = ref([]);

interface Option {
    key: number
    label: string
    disabled: boolean
}

const generateData = () => {
    const data: Option[] = []
    for (let i = 1; i <= 15; i++) {
        data.push({
            key: i,
            label: `Option ${i}`,
            disabled: i % 4 === 0,
        })
    }
    return data
}

const data = ref<Option[]>(generateData())
const value = ref([])
</script>

<style scoped>
.analysis-div {
    height: 55rem;
}
</style>