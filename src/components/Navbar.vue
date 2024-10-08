<template>
	<nav class="top-0 z-50 sticky bg-[#121212] shadow py-4 text-white shadow-lg" v-if="showNavbar">
		<div class="flex justify-between items-center border-green-100 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
			<div class="flex items-center">
				<router-link to="/" class="font-bold text-pink-500 text-xl">Platfrom</router-link>
			</div>
			<div class="flex items-center">
				<router-link to="/" class="hover:bg-gray-700 mx-2 px-4 py-2 rounded-md"
				             :class="{ 'bg-gray-700 text-green-500': $route.path === '/' }">
					Home
				</router-link>
				<router-link to="/history" class="hover:bg-gray-700 mx-2 px-4 py-2 rounded-md"
				             :class="{ 'bg-gray-700 text-green-500': $route.path === '/history' }">
					历史
				</router-link>
				<router-link to="/analysis" class="hover:bg-gray-700 mx-2 px-4 py-2 rounded-md"
				             :class="{ 'bg-gray-700 text-green-500': $route.path === '/analysis' }">
					数据分析
				</router-link>
				<router-link to="/download" class="hover:bg-gray-700 mx-2 px-4 py-2 rounded-md"
				             :class="{ 'bg-gray-700 text-green-500': $route.path === '/download' }">
					数据下载
				</router-link>
				<div class="relative mx-2" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
					<button :class="{'bg-gray-700 text-green-500':$route.path.startsWith('/type-a-equipment'),}"
					        class="flex items-center hover:bg-gray-700 px-4 py-2 rounded-md">
						我的设备
					</button>
					<div v-if="showSubMenu"
					     class="mt-2 z-10 absolute bg-gray-800 shadow-lg py-2 rounded-md w-48 origin-top-right animate-zoom-in-up
						 max-h-64 overflow-auto" :class="{ 'avatar-hover': isAvatarHovering }">
						<div v-for="(device, index) in devices" :key="index" class="pr-2 pl-2">
							<router-link @click="toggleSubMenu" :to="getPath(device)"
							             :class="{'bg-gray-700 text-green-500 rounded mt-0.5': isActiveRoute(getPath(device),),}"
							             class="block hover:bg-gray-700 px-4 py-2 rounded mt-0.5">
								{{ device.name }}
							</router-link>
						</div>
					</div>
					
				</div>
			</div>
			<!-- 用户头像和下拉菜单 -->
			<div class="relative mx-2" @mouseenter="handleAvatarMouseEnter" @mouseleave="handleAvatarMouseLeave">
				<img
					@click="toggleUserMenu"
					src="@/assets/vue.svg"
					alt="User Avatar"
					class="w-10 h-10 rounded-full cursor-pointer avatar"
					:class="{ 'avatar-hover': isAvatarHovering }"
				/>
				<div v-if="showUserMenu" class="mt-2 z-10 absolute right-0 mt-2 bg-gray-800 shadow-lg py-2 rounded-md
				w-48 origin-top-right animate-zoom-in-up pr-2 pl-2">
					<p class="px-4 py-2 text-white font-bold bg-green-500 rounded">
						{{ Cookies.get("platform_user") }}
					</p>
					<router-link to="/" class="block hover:bg-gray-700 px-4 py-2 text-white rounded mt-0.5"
					             :class="{ 'bg-gray-700 text-green-500': $route.path === '/' }">
						用户主页
					</router-link>
					<router-link to='/file-analysis' class="block hover:bg-gray-700 px-4 py-2 text-white rounded mt-0.5"
					             :class="{'bg-gray-700 text-green-500': $route.path === '/file-analysis',}">
						文件分析
					</router-link>
					<router-link to="/settings" class="block hover:bg-gray-700 px-4 py-2 text-white rounded mt-0.5"
					             :class="{'bg-gray-700 text-green-500': $route.path === '/settings',}">
						设置
					</router-link>
					<router-link to="login"
					             class="block w-full text-left hover:bg-gray-700 px-4 py-2 text-white rounded mt-0.5"
					             :class="{ 'bg-gray-700 text-green-500': $route.path === '/login' }">
						登录界面
					</router-link>
					<button @click="logout"
					        class="block w-full text-left hover:bg-gray-700 px-4 py-2 text-white rounded mt-0.5">
						登出
					</button>
				</div>
			</div>
		</div>
	</nav>
</template>

<script setup>
import {computed, ref} from "vue";
import {useAuthStore} from "@/stores/userStore";
import {storeToRefs} from "pinia";
import {useRoute} from "vue-router";
import Cookies from "js-cookie";

const authStore = useAuthStore();
const {SCGData, user} = storeToRefs(authStore);

const showSubMenu = ref(false);
const showUserMenu = ref(false);
const showAnalysisMenu = ref(false);
const isEquipmentHovering = ref(false);
const isAnalysisHovering = ref(false);
const isAvatarHovering = ref(false);

const route = useRoute();

const is404 = computed(() => {
	return route.path === '/:pathMatch(.*)*'
})

const showNavbar = computed(() => {
	return !(route.path === "/login" || route.path === "/register" || route.path === "//:pathMatch(.*)*"
	 || route.path === "/modify-pwd");
});

// 根据设备编码的第一个字母生成不同的路由路径
const devices = computed(() => {
	return SCGData.value[1].map((name, index) => {
		const id = SCGData.value[0][index];
		const type = id.startsWith("A") ? "type-a-equipment" : "type-b-equipment";
		return {
			id,
			name,
			path: `/${type}/${id}`,
		};
	});
});

const getPath = (device) => {
	return device.path;
};

const isActiveRoute = (path) => {
	return route.path === path;
};

function toggleSubMenu() {
	showSubMenu.value = !showSubMenu.value;
}

function handleMouseEnter() {
	isEquipmentHovering.value = true;
	showSubMenu.value = true;
}

function handleMouseLeave() {
	isEquipmentHovering.value = false;
	setTimeout(() => {
		if (!isEquipmentHovering.value) {
			showSubMenu.value = false;
		}
	}, 100);
}

function handleAvatarMouseEnter() {
	isAvatarHovering.value = true;
	showUserMenu.value = true;
}

function handleAvatarMouseLeave() {
	isAvatarHovering.value = false;
	setTimeout(() => {
		if (!isAvatarHovering.value) {
			showUserMenu.value = false;
		}
	}, 100);
}

function handleAnalysisEnter() {
	isAnalysisHovering.value = true;
	showAnalysisMenu.value = true;
}

function handleAnalysisLeave() {
	isAnalysisHovering.value = false;
	setTimeout(() => {
		if (!isAnalysisHovering.value) {
			showAnalysisMenu.value = false;
		}
	}, 100);
}

const toggleUserMenu = () => {
	showUserMenu.value = !showUserMenu.value;
};

const logout = () => {
	// 处理注销逻辑
	authStore.logout();
	console.log("User logged out");
};
</script>

<style scoped>
.relative:hover .hidden {
	display: block;
}

.avatar-hover {
	transform: scale(1.2); /* Scale effect */
	border: 2px solid #4caf50; /* Green border */
}

.logo-hover {
	transform: scale(1.2); /* Scale effect */
}

.animate-zoom-in-up {
	animation: zoom-in-up 0.3s ease-out;
}

@keyframes zoom-in-up {
	0% {
		transform: scale(0.95) translateY(10px);
		opacity: 0;
	}
	
	100% {
		transform: scale(1) translateY(0);
		opacity: 1;
	}
}

@media (max-width: 767px) {
	/* Navbar styles for mobile */
	.navbar {
		flex-direction: column; /* Stack items vertically */
		align-items: flex-start; /* Align items to the start */
		padding: 1rem; /* Padding for mobile */
	}
	
	.navbar .flex {
		justify-content: space-between; /* Space out items */
		width: 100%; /* Full width */
	}
	
	.navbar .px-4 {
		padding-left: 1rem;
		padding-right: 1rem;
	}
	
	.navbar a {
		width: 100%; /* Full width for links */
		text-align: center; /* Center text */
		margin: 0.5rem 0; /* Margin between links */
	}
	
	.relative {
		width: 100%; /* Full width for dropdowns */
	}
	
	.hidden {
		display: none; /* Hide by default */
	}
	
	.avatar {
		width: 40px; /* Smaller avatar */
		height: 40px; /* Smaller avatar */
	}
}
</style>
