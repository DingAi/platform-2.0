<template>
    <div class="space-y-2 text-center size-full">
        <p class="text-8xl text-emerald-300">
            MASTER STATION PAGE
        </p>
        <p class="text-white">{{mqttData}}</p>
    </div>
</template>

<script setup>
    import {onMounted, ref} from "vue";
    const mqttData = ref('')
    const refresh = async () =>{

    }

    onMounted(()=>{
        refresh();
    })
    // axios.get("/api/users")
</script>

<style scoped>

</style>