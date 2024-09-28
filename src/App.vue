<script setup lang="js">
import Nav from "./components/Navbar.vue";
import {useRoute} from "vue-router";
import {computed, onMounted} from "vue";
import {useAuthStore} from "@/stores/userStore.js";

const route = useRoute();

const mainMinHeight = computed(() => {
	const headerHeight = () => {
		const excludedPaths = ['/login', '/register', '/:pathMatch(.*)*', '/modify-pwd'];
		return excludedPaths.includes(route.path) ? 80 : 152;
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
	<main :style="{ 'min-height': mainMinHeight }" class="bg-[#212121] pt-10 sm:pt-10">
		<div class="mx-auto container">
			<router-view></router-view>
		</div>
	</main>
	<footer class="flex justify-center items-center bg-[#212121] h-20">
		<p class="text-center text-white">
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

main {
	min-height: calc(100vh - 152px);
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
