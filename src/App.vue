<script setup lang="js">
import Nav from "./components/Navbar.vue";
import {useRoute} from "vue-router";
import {computed, onMounted} from "vue";
import {useAuthStore} from "@/stores/userStore.js";

const route = useRoute();

const mainMinHeight = computed(() => {
    const headerHeight = () => {
        if (route.path === '/login' || route.path === '/init-roll' || route.path === '/:pathMatch(.*)*') {
            return 80;
        } else {
            return 152;
        }
    };
    return `calc(100vh - ${headerHeight()}px)`;
});

const tokenExamine = () =>{
	const userStore = useAuthStore()
	if (!userStore.getToken()){
		userStore.logout();
	}
}

onMounted(()=>{
	tokenExamine()
})

</script>

<template>
    <Nav class="z-max"/>
    <main :style="{ 'min-height': mainMinHeight }" class="bg-gradient-to-b from-gray-800 to-gray-900 pt-10 sm:pt-10">
        <div class="mx-auto container">
            <router-view></router-view>
        </div>
    </main>
    <footer class="flex justify-center items-center bg-gray-900 dark:bg-gray-900 from-gray-800 h-20">
        <p class="text-center text-white"> Copyright 2024 测试备案号文本 <a href="/">@连接测试</a></p>
    </footer>
</template>

<style scoped>
.z-max{
    z-index: 1999;
}

main {
    min-height: calc(100vh - 152px);
}
/* 默认样式适用于手机端（小于 768px） */
@media (max-width: 767px) {
    main {
        min-height: 100%;
    }
}

/* 为 <a> 标签添加样式 */
a {
    color: #459a66;
    text-decoration: none;
    transition: color 0.3s;
}

a:hover {
    color: #5bc963;
}

a:active {
    color: #3ae6aa;
}
</style>
