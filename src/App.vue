<script setup lang="js">
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/userStore.js";
import { getInitTokenDetect } from "@/server/request-apis.js";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();

const mainMinHeight = computed(() => {
	const excludedPaths = ['/login', '/register', '/:pathMatch(.*)*', '/modify-pwd'];
	const headerHeight = excludedPaths.includes(route.path) ? 80 : 172;
	return `calc(100vh - ${headerHeight}px)`;
});

const tokenExamine = async () => {
	const userStore = useAuthStore();
	if (!userStore.getToken()) {
		userStore.logout();
		return; // 确保在登出时不继续执行
	}
	try {
		await getInitTokenDetect(); // 确保处理异步调用
	} catch (error) {
		console.error("Token detection error:", error);
	}
}


const showNavbar = computed(() => {
	return !(route.path === "/login" || route.path === "/register" || route.path === "//:pathMatch(.*)*"
		|| route.path === "/modify-pwd");
});

onMounted(() => {
	tokenExamine();
});
</script>

<template>
	<Navbar class="z-max" v-if="showNavbar"/>
	<main :style="{ 'min-height': mainMinHeight }" class="bg-white sm:pt-10">
		<div class="mx-auto container">
			<router-view></router-view>
		</div>
	</main>
	<footer class="flex justify-center items-center bg-white h-20">
		<p class="text-center text-gray-700">
			杨陵子石科技有限公司
			<a href="https://beian.miit.gov.cn/#/Integrated/index">陕ICP备2024044716号</a>
			|
			<a href="https://beian.mps.gov.cn/#/query/webSearch">陕公网安备61909002000149号</a>
		</p>
	</footer>
</template>

<style scoped>
.z-max {
	z-index: 1999;
}

/* Default styles for mobile (less than 768px) */
@media (max-width: 767px) {
	main {
		min-height: calc(100vh - 80px); /* Adjust height for mobile */
		padding-top: 5px; /* Reduce padding for mobile */
	}
	
	.container {
		padding: 0 1rem; /* Add horizontal padding for mobile */
	}
	
	footer {
		flex-direction: column; /* Stack footer content vertically */
		padding: 1rem; /* Add padding for footer */
	}
	
	footer p {
		text-align: center; /* Center text in footer */
		margin: 0; /* Remove margin */
	}
}

/* Style for <a> tags */
a {
	color: #003f8f;
	text-decoration: none;
	transition: color 0.3s;
}

a:hover {
	color: #2196F3;
}

a:active {
	color: #3F51B5;
}
</style>
