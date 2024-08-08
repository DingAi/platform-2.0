import { createApp } from 'vue'
import './style.css'
import App from '@/App.vue'
import '@/assets/css/style.less'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import router from '@/router/index'
import 'element-plus/dist/index.css' //关于Element plus内容导入
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn' //Element plus国际化-中文



const app = createApp(App);

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})
app.use(ElementPlus)
app.mount('#app')


