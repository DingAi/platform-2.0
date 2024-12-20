import { createApp } from 'vue'
import './style.css'
import App from '@/App.vue'
import '@/assets/css/style.less'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import router from '@/router/index'
import 'element-plus/dist/index.css' //关于Element plus内容导入
import 'element-plus/theme-chalk/dark/css-vars.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn' //Element plus国际化-中文
import * as ElIcons from '@element-plus/icons'



const app = createApp(App);

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(ElementPlus, {locale: zhCn,})
app.use(ElementPlus)
for (const name in ElIcons){
    app.component(name,(ElIcons as any)[name])
}
app.mount('#app')


