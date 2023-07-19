import { createApp } from 'vue'
// 加载 store
import pinia from './stores'
// 加载 element
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import ElSvg from './components/SvgIcon/ElSvg'

// 加载根组件
import App from './App.vue'

// 加载路由配置
import router from './router'

// 全局样式
import './styles/index.scss'

// 加载鉴权逻辑，注册 beforeEach 函数，不会现在执行
import './permission'

const app = createApp(App)


ElSvg(app)

app.use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app')
