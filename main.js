import App from './App'

import Util from './utils/index.js'
import Api from './server/api.js'
import config from './utils/config.js'
import { createSSRApp } from 'vue'
import { installStore } from './store/index.js'
// 微信 JS-SDK 统一封装（仅 H5 端有效，其他端被条件编译剔除）
import wxsdk from './utils/wxsdk/index.js'
// #ifndef VUE3
import Vue from 'vue'
import { createPinia } from 'pinia'
import { createPersistPlugin } from './store/plugins/persist.js'
import { registerPinia, useAppStore, useTabsStore } from './store/index.js'
// #endif

/**
 * 全局注入工具库，组件内可直接使用：
 *   this.util  / this.http  —— 请求、缓存、日期、日志等聚合工具
 *   this.api               —— 接口地址
 *   this.config            —— 多端运行时配置
 *   this.jump              —— 路由跳转封装
 *   this.store             —— 应用级状态（登录态 / 用户态），见 store/app.js
 *   this.tabs              —— 多标签状态（选中项 / 徽标），见 store/tabs.js
 *   this.useStore()        —— 组合拿到 { app, tabs }
 *   this.wxsdk             —— 微信 JS-SDK 统一封装（H5 端；非微信环境安全降级）
 *
 * 关于微信 JSSDK 的初始化时机：
 * **刻意不在 main.js 里强制 init**。原因：
 * - 签名依赖当前页面 url，而应用启动时 url 往往还不是最终页面（重定向/hash 未定）
 * - 强制 init 会与页面 onLoad 竞态，且非微信环境产生无谓请求
 * 因此采用「首次调用自动初始化 + 页面 onShow 可选预热」策略，
 * 详见 utils/wxsdk/index.js 顶部说明。
 *
 * 注意：Vue 3 分支必须导出名为 createApp 的函数（uni-app 运行时约定）。
 * 但 HBuilderX 的 mainJs 插件在 legacy 分支会用 `code.replace('createApp','createVueApp')`
 * 把第一个 createApp 子串重命名，若此处用 `import { createApp }` 会抢占该替换位，
 * 导致插件注入的 `function createApp` 与导出的 createApp 撞名（浏览器报 Identifier 已声明）。
 * 故 Vue 工厂函数必须用 createSSRApp 导入（命中插件的 createSSRApp 分支，不再注入冲突函数）。
 */
function install(proto) {
  if (!proto) return
  proto.util = Util
  proto.http = Util
  proto.api = Api
  proto.config = config
  proto.jump = Util.jump
  proto.wxsdk = wxsdk
}

// #ifdef VUE3
export function createApp() {
  const app = createSSRApp(App)
  install(app.config.globalProperties)
  // Pinia：注册 pinia + 持久化插件 + 注入 this.store / this.tabs / this.useStore
  installStore(app, app.config.globalProperties)
  return { app }
}
// #endif

// #ifndef VUE3
Vue.config.productionTip = false
install(Vue.prototype)
App.mpType = 'app'
const vue2App = new Vue({
  ...App
})
// Vue2 同样安装 Pinia，保证两端 store 能力一致
const pinia2 = createPinia()
pinia2.use(createPersistPlugin())
vue2App.use(pinia2)
registerPinia(pinia2)
Vue.prototype.$store = useAppStore(pinia2)
Vue.prototype.store = Vue.prototype.$store
Vue.prototype.tabs = useTabsStore(pinia2)
vue2App.$mount()
// #endif