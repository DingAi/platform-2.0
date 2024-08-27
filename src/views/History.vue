<template>
    <div class="space-y-4 text-center size-full">
        <div class="flex md:flex-row flex-col justify-between items-center bg-gray-700 pt-2 pb-2 h-40 rounded space-x-2">
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
        <div class="bg-slate-800 p-2 w-full history-chart rounded" ref="tempChartRef">

        </div>
    </div>
</template>

<script setup>
import SubmitButton from "@/components/SubmitButton.vue";
import {getTimeRange} from '@/utils/tools-functions.js'
import {onMounted, ref} from "vue";
import TimeDatePicker from "@/components/ElementTimeDatePicker.vue";
import MultiSelect from "@/components/ElementMultiSelect.vue";
import {lineOptionTemplate} from "@/assets/echarts-template/line-chart.js";
import {addSeriesData, refInitEcharts, setChartType, setOptionXAxis, setSeriesData} from "@/utils/eharts-init.js";
import {useAuthStore} from "@/stores/userStore.js";
import {storeToRefs} from "pinia";

const authStore = useAuthStore();
const {SCGData, user} = storeToRefs(authStore);


const timeRange = ref(getTimeRange(6))
const selectedValues = ref([]);
let option = lineOptionTemplate;
const tempChartRef = ref(null);

onMounted(() =>{
    const dom = refInitEcharts(tempChartRef.value);
    //JS中循环使用in获取的是index，使用of是获取到值
    option = setOptionXAxis(option,SCGData.value[1])
    let randomList = []
    for(let i=0; i<SCGData.value[1].length; i++){
        randomList.push(Math.random(10,100)*100);
    }
    option = setSeriesData(option, randomList)
    //图表类型：bar、line、pie、scatter、radar
    option = setChartType(option,'line')
    dom.setOption(option);

    // 确保图表在窗口大小变化时重新计算尺寸
    window.onresize = function () {
        dom.resize();
    };
})
</script>

<style scoped lang="less">
.history-chart {
    height: 43rem;
}

</style>