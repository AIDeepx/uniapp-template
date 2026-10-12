/**
 * Store 统一入口
 *
 * 用法：
 *   // Options API 组件内（已全局注入，无需 import）
 *   this.store.isLogin / this.store.setActiveTab('todo')
 *
 *   // Composition API 或任意 JS
 *   import { useAppStore, useTabsStore } from '@/store/index.js'
 *   const app = useAppStore()
 *
 * 初始化由 main.js 调用 installStore(app) 完成：
 *   1. 创建并注册 pinia（含持久化插件）
 *   2. 注入 this.store / this.useStore
 *   3. 订阅登录失效事件，自动清理登录态
 */
import { createPinia } from 'pinia'
import { useAppStore } from './app.js'
import { useTabsStore } from './tabs.js'
import { createPersistPlugin } from './plugins/persist.js'
import { registerPinia, getAppStore } from './bridge.js'

export { useAppStore, useTabsStore, registerPinia, getAppStore }

/** 便捷组合式访问器：拿到 store 实例（Options API 里用 this.useStore() 也可） */
export function useStore() {
  return {
    app: useAppStore(),
    tabs: useTabsStore(),
  }
}

/**
 * 在 main.js 中安装 Pinia。
 * @param {object} app Vue3 app 实例（createSSRApp 的返回值）
 * @param {object} globalProps app.config.globalProperties（Vue2 传 Vue.prototype）
 */
export function installStore(app, globalProps) {
  const pinia = createPinia()
  // 持久化插件：store 内声明 persist 字段即自动落盘
  pinia.use(createPersistPlugin())
  app.use(pinia)
  registerPinia(pinia)

  if (globalProps) {
    globalProps.store = useAppStore(pinia)
    globalProps.tabs = useTabsStore(pinia)
    globalProps.useStore = useStore
  }

  // 登录失效：request 层广播 http:unauthorized 时清空登录态，
  // 保证任意页面的登录态展示都不会残留
  uni.$on('http:unauthorized', () => {
    const appStore = getAppStore()
    if (appStore && appStore.isLogin) appStore.logout()
  })

  return pinia
}
