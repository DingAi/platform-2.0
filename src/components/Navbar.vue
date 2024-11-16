<template>
	<nav class="top-0 z-50 sticky bg-white shadow py-4 font-light">
		<div class="flex flex-row justify-between items-center mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
			<!-- Platform Logo -->
			<div class="flex pl-4">
				<router-link to="/" class="text-pink-600 text-xl font-bold">Platfrom</router-link>
			</div>
			<!-- 汉堡菜单 -->
			<div class="block px-4 sm:hidden items-center space-x-4">
				<button @click="toggleMobileMenu" class="focus:outline-none flex justify-center">
					<el-icon><Menu/></el-icon>
				</button>
			</div>
			<!-- 移动菜单 -->
			<div v-if="showMobileMenu"
			     class="absolute top-16 left-0 right-0 bg-white text-sm font-bold shadow-lg z-50 p-2">
				<router-link to="/"
				             class="flex px-4 py-1 hover:bg-theme-1-color-6 rounded-xl items-center justify-center"
				             :class="{'bg-theme-1-color-1 text-white': $route.path === '/'}"
				             @click="toggleMobileMenu">
					<el-icon>
						<House/>
					</el-icon>
					Home
				</router-link>
				<router-link to="/history"
				             class="flex px-4 py-1 hover:bg-theme-1-color-6 rounded-xl items-center justify-center"
				             :class="{'bg-theme-1-color-1 text-white': $route.path.startsWith('/history')}"
				             @click="toggleMobileMenu">
					<el-icon>
						<Clock/>
					</el-icon>
					历史
				</router-link>
				<router-link to="/analysis"
				             class="flex px-4 py-1 hover:bg-theme-1-color-6 rounded-xl items-center justify-center"
				             :class="{'bg-theme-1-color-1 text-white': $route.path.startsWith('/analysis')}"
				             @click="toggleMobileMenu">
					<el-icon>
						<Histogram/>
					</el-icon>
					数据分析
				</router-link>
				<router-link @click="toggleMobileMenu"
				             to="/download"
				             class="flex px-4 py-1 hover:bg-theme-1-color-6 rounded-xl items-center justify-center"
				             :class="{'bg-theme-1-color-1 text-white': $route.path.startsWith('/download')}">
					<el-icon>
						<Download/>
					</el-icon>
					数据下载
				</router-link>
				<div class="relative mx-2" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
					<button :class="{'bg-theme-1-color-1 text-white': $route.path.startsWith('/type-a-equipment')}"
					        class="flex hover:bg-theme-1-color-6 p-2 rounded-xl items-center justify-center"
					        @click="toggleMobileMenu">
						<el-icon>
							<ArrowDownBold/>
						</el-icon>
						我的设备
					</button>
					<div class="mt-2 z-10 absolute bg-white shadow py-2 rounded-xl w-48 origin-top-right animate-zoom-in-up">
						<div v-for="(device, index) in devices" :key="index" class="pr-2 pl-2">
							<router-link @click="toggleMobileMenu"
							             :to="getPath(device)"
							             :class="{'bg-theme-1-color-1 text-white rounded mt-0.5': isActiveRoute(getPath(device))}"
							             class="block hover:bg-theme-1-color-6 px-4 py-2 rounded mt-0.5">{{ device.name }}
							</router-link>
						</div>
					</div>
				</div>
			</div>
			
			<!-- 桌面版 Menu -->
			<div class="hidden sm:flex items-center space-x-2">
				<router-link to="/"
				             class="hover:bg-theme-1-color-1 hover:text-white px-4 py-2 rounded-xl font-bold"
				             :class="{ 'bg-theme-1-color-1 text-white': $route.path === '/' }">Home
				</router-link>
				<router-link to="/history"
				             class="hover:bg-theme-1-color-1 hover:text-white px-4 py-2 rounded-xl"
				             :class="{ 'bg-theme-1-color-1 text-white': $route.path === '/history' }">历史
				</router-link>
				<router-link to="/analysis"
				             class="hover:bg-theme-1-color-1 hover:text-white px-4 py-2 rounded-xl"
				             :class="{ 'bg-theme-1-color-1 text-white': $route.path === '/analysis' }">数据分析
				</router-link>
				<router-link to="/download"
				             class="hover:bg-theme-1-color-1 hover:text-white px-4 py-2 rounded-xl"
				             :class="{ 'bg-theme-1-color-1 text-white': $route.path === '/download' }">数据下载
				</router-link>
				<div class="relative mx-2" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
					<button :class="{'bg-theme-1-color-1 text-white':$route.path.startsWith('/type-a-equipment'),}"
					        class="flex items-center hover:bg-theme-1-color-1 hover:text-white px-4 py-2 rounded-xl">我的设备
					</button>
					<div v-if="showSubMenu"
					     class="mt-2 z-10 absolute bg-white shadow py-2 rounded-xl w-48 origin-top-right animate-zoom-in-up">
						<div v-for="(device, index) in devices" :key="index" class="pr-2 pl-2">
							<router-link @click="toggleSubMenu"
							             :to="getPath(device)"
							             :class="{'bg-theme-1-color-1 text-white rounded mt-0.5': isActiveRoute(getPath(device))}"
							             class="block hover:bg-theme-1-color-1 hover:text-white px-4 py-2 rounded mt-0.5">
								{{ device.name }}
							</router-link>
						</div>
					</div>
				</div>
			</div>
			<!-- 用户头像和下拉菜单 -->
			<div class="relative mx-2 rounded p-2"
			     @mouseenter="handleAvatarMouseEnter"
			     @mouseleave="handleAvatarMouseLeave">
				<div class="flex flex-row justify-center items-center">
					<el-avatar
						style="background: #3F51B5; color: #ffffff"
						class="font-bold"
						:class="{ 'avatar-hover': isAvatarHovering }"
					>
						{{ avatarInitial }}
					</el-avatar>
					<span class="pl-4 font-bold text-gray-700"> {{ Cookies.get('platform_user') }}</span>
				</div>
				<div v-if="showUserMenu"
				     class="z-10 absolute right-0 mt-2 bg-white shadow-lg py-2 rounded-xl w-48 origin-top-right animate-zoom-in-up pr-2 pl-2">
					<router-link to="/settings"
					             class="block hover:bg-theme-1-color-6 px-4 py-2 rounded mt-0.5"
					             :class="{'bg-theme-1-color-1': $route.path === '/settings'}">设置
					</router-link>
					<button @click="logout" class="block w-full text-left hover:bg-theme-1-color-6 px-4 py-2 rounded mt-0.5">
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
import {ArrowDownBold, Clock, Histogram, House} from "@element-plus/icons";

const authStore = useAuthStore();
const {SCGData} = storeToRefs(authStore);

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

// 根据设备编码的第一个字母生成不同的路由路径
const devices = computed(() => {
	return SCGData.value[1].map((name, index) => {
		const id = SCGData.value[0][index];
		const type = id.startsWith("A") ? "type-a-equipment" : "type-b-equipment";
		return {id, name, path: `/${type}/${id}`,};
	});
});

const avatarInitial = computed(() => {
	const user = Cookies.get('platform_user');
	return user ? user.charAt(0).toUpperCase() : 'Null';
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

const showMobileMenu = ref(false);

const toggleMobileMenu = () => {
	showMobileMenu.value = !showMobileMenu.value;
};

const logout = () => {
	// 处理注销逻辑
	authStore.logout();
	console.log("用户登出");
};
</script>

<style scoped>
.relative:hover .hidden {
	display: block;
}

.avatar-hover {
	transform: scale(1.2); /* Scale effect */
	border: 2px solid #3F51B5; /* Green border */
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

@media (max-width: 640px) {
	.flex.items-center.space-x-4 {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	
	.flex.items-center {
		justify-content: space-between;
	}
	
	nav .flex {
		width: 100%;
	}
}

</style>
