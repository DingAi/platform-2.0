<template>
    <div class="relative inline-block w-64">
        <div class="relative">
            <input
                type="text"
                v-model="selectedLabel"
                @click="toggleDropdown"
                readonly
                class="w-full py-2 px-4 border border-gray-300 rounded cursor-pointer focus:outline-none"
                :placeholder="placeholder"
            />
            <button @click="clearSelection" v-if="clearable" class="absolute right-3 top-2">
a            </button>
        </div>
        <div v-if="dropdownVisible" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
            <ul class="py-1">
                <li
                    v-for="(option, index) in currentOptions"
                    :key="index"
                    @click="selectOption(option)"
                    class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                    {{ option.label }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    options: Array,
    placeholder: {
        type: String,
        default: 'Please select'
    },
    clearable: {
        type: Boolean,
        default: true
    }
});

const selectedLabel = ref('');
const selectedValues = ref([]);
const currentOptions = ref(props.options);
const dropdownVisible = ref(false);

const toggleDropdown = () => {
    dropdownVisible.value = !dropdownVisible.value;
};

const selectOption = (option) => {
    selectedValues.value.push(option.value);
    selectedLabel.value = option.label;
    dropdownVisible.value = false;

    if (option.children) {
        currentOptions.value = option.children;
    } else {
        currentOptions.value = props.options;
    }
};

const clearSelection = () => {
    selectedValues.value = [];
    selectedLabel.value = '';
    currentOptions.value = props.options;
};
</script>

<style scoped>
/* 你可以根据需要在这里添加自定义样式 */
</style>
