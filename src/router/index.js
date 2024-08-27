import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import History from '../views/History.vue'
import Analysis from '../views/Analysis.vue'
import Settings from '../views/Settings.vue'
import Login from '../views/Login.vue'
import Download from '../views/Download.vue'
import InitEnroll from '../views/InitEnroll.vue'
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
        path: '/init-roll',
        name: 'InitEnroll',
        component: InitEnroll
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

// router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//         if (!isAuthenticated()) {
//             next({ name: 'Login' })
//             ElMessage({
//                 showClose: true,
//                 message: "请先完成登录！",
//             });
//         } else {
//             const userRole = getUserRole() // 假设你有一个获取用户角色的函数
//             if (to.meta.role && to.meta.role !== userRole) {
//                 ElMessage({
//                     showClose: true,
//                     message: "无权访问此页面！",
//                 });
//                 next(false) // 阻止导航
//             } else {
//                 next() // 已认证并且有正确的角色，继续导航
//             }
//         }
//     } else {
//         next() // 不需要认证，继续导航
//     }
// })
//
// function getUserRole() {
//     // 假设用户角色存储在 cookie 中
//     return Cookies.get('userRole') || 'user' // 'admin' 或 'user'
// }


function isAuthenticated() {
    // 检查是否存在Token，假设Token名称为`authToken`
    return !!Cookies.get('token')
}

export default router
