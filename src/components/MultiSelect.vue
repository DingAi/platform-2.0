<template>
    <el-cascader
        :options="resolvedOptions"
        :props="cascadeProps"
        size="large"
        collapse-tags
        collapse-tags-tooltip
        clearable
        class="w-full"
        v-model="selectedValues"
        @change="handleValueChange"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const defaultOptions = [
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
];

interface CascadeProps {
    multiple?: boolean;
    props?: {
        value: string;
        label: string;
        children: string;
    };
    options?: any[];
    modelValue?: any[];
}

const props = withDefaults(defineProps<CascadeProps>(), {
    multiple: true,
    props: () => ({
        value: 'value',
        label: 'label',
        children: 'children',
    }),
    options: () => [],
    modelValue: () => [],
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: any[]): void;
}>();

const selectedValues = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

const resolvedOptions = computed(() => props.options.length > 0 ? props.options : defaultOptions);

const cascadeProps = computed(() => ({
    multiple: props.multiple,
    ...props.props,
}));

const handleValueChange = (values: any[]) => {
    selectedValues.value = values;
};
</script>