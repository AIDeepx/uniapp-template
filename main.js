import App from './App'

import Util from './utils/index.js'
import Api from './server/api.js'
import config from './utils/config.js'

/**
 * 全局注入工具库，组件内可直接使用：
 *   this.util  / this.http  —— 请求、缓存、日期、日志等聚合工具
 *   this.api               —— 接口地址
 *   this.config            —— 多端运行时配置
 *   this.jump              —— 路由跳转封装
 * Vue 2 通过 Vue.prototype 注入；Vue 3 通过 app.config.globalProperties 注入。
 */
function install(proto) {
  if (!proto) return
  proto.util = Util
  proto.http = Util
  proto.api = Api
  proto.config = config
  proto.jump = Util.jump
}

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
install(Vue.prototype)
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createApp } from 'vue'
export function createApp() {
  const app = createApp(App)
  install(app.config.globalProperties)
  return { app }
}
// #endif
