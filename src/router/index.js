import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import History from '../views/History.vue'
import Analysis from '../views/Analysis.vue'
import Settings from '../views/Settings.vue'
import Login from '../views/Login.vue'
import Download from '../views/Download.vue'
import Register from '../views/Register.vue'
import Page404 from '../views/Page404.vue'
import LocalAnalysis from '../views/LocalAnalysis.vue'
import ModifyPassword from '../views/ModifyPassword.vue'
import Cookies from 'js-cookie'
import {ElMessage} from "element-plus";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {requiresAuth: true} // 需要认证的路由
    },
    {
        path: '/history',
        name: 'History',
        component: History,
        meta: {requiresAuth: true}
    },
    {
        path: '/analysis',
        name: 'Analysis',
        component: Analysis,
        meta: {requiresAuth: true}
    },
    {
        path: '/file-analysis',
        name: 'LocalAnalysis',
        component: LocalAnalysis,
        meta: {requiresAuth: true}
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings,
        meta: {requiresAuth: true}
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/modify-pwd',
        name: 'ModifyPassword',
        component: ModifyPassword
    },
    {
        path: '/download',
        name: 'Download',
        component: Download,
        meta: {
            folders: null,
            files: null,
            showNavbar: false
        },
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/type-a-equipment/:id',
        name: 'TypeAEquipment',
        component: () => import('@/views/SingleChannel.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/type-b-equipment/:id',
        name: 'TypeBEquipment',
        component: () => import('@/views/MultiChannel.vue'),
        meta: {requiresAuth: true}
    },
    // 404界面
    {
        path: '/:pathMatch(.*)*',  // 捕获所有未匹配的路由
        name: 'Page404',
        component: Page404,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // 检查用户是否已认证
        if (!isAuthenticated()) {
            next({name: 'Login'}) // 重定向到登录页面
            ElMessage({
                showClose: true,
                message: "请先完成登录！",
            });
        } else {
            next() // 已认证，继续导航
        }
    } else {
        next() // 不需要认证，继续导航
    }
})


function isAuthenticated() {
    // 检查是否存在Token，假设Token名称为`authToken`
    return !!Cookies.get('platform_token')
}

export default router
