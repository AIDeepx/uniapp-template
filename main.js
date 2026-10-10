import App from './App'

import Util from './utils/index.js'
import Api from './server/api.js'
import config from './utils/config.js'
import { createSSRApp } from 'vue'
// #ifndef VUE3
import Vue from 'vue'
// #endif

/**
 * 全局注入工具库，组件内可直接使用：
 *   this.util  / this.http  —— 请求、缓存、日期、日志等聚合工具
 *   this.api               —— 接口地址
 *   this.config            —— 多端运行时配置
 *   this.jump              —— 路由跳转封装
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
}

// #ifdef VUE3
export function createApp() {
  const app = createSSRApp(App)
  install(app.config.globalProperties)
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
vue2App.$mount()
// #endif