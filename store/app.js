/**
 * 应用级状态（Pinia）—— 登录态 / 用户态的**唯一真相源**
 *
 * 设计约束（2026-10-12 重构）：
 * 1. token / userInfo 以本 store 为准；持久化交给 persist 插件，不再手写 cache.set。
 * 2. utils/request.js 与 utils/user.js 的 setToken/getUser 等旧导出全部改为
 *    「转发到本 store」，保证老业务代码零改动、且不会出现两份 token 不一致。
 * 3. 登录态失效由 request 层广播 http:unauthorized，main.js 侧订阅后调用
 *    logout()，因此任何页面都不会出现「已登出但界面仍显示登录态」。
 *
 * 用法（Options API 组件内，已全局注入，无需 import）：
 *   this.store.isLogin / this.store.userInfo / this.store.token
 *   this.store.login({ token, user }) / this.store.logout()
 * 或（Composition API / 任意 JS）：
 *   import { useAppStore } from '@/store/index.js'
 *   const app = useAppStore()
 */
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    token: '',
    userInfo: null,
    // 应用级 UI 状态：底部/侧边折叠、启动图是否已关闭等
    systemInfo: null,
  }),

  getters: {
    isLogin: (state) => !!state.token,
    userId: (state) => (state.userInfo && (state.userInfo.id || state.userInfo.userId)) || '',
    userName: (state) => (state.userInfo && (state.userInfo.name || state.userInfo.realName)) || '',
    // 常用权限位读取：hasPermission('xxx') 返回布尔
    hasPermission: (state) => (code) => {
      const list = (state.userInfo && (state.userInfo.permissions || state.userInfo.roles)) || []
      return list.indexOf(code) > -1
    },
  },

  actions: {
    /** 登录成功后一次性写入 token + 用户态 */
    login({ token, user }) {
      this.setToken(token)
      this.setUser(user)
      return this
    },
    setToken(token) {
      this.token = token || ''
    },
    setUser(user) {
      this.userInfo = user || null
    },
    setSystemInfo(info) {
      this.systemInfo = info || null
    },
    /** 局部更新用户信息（如资料页改昵称） */
    patchUser(patch) {
      if (!this.userInfo || !patch) return
      this.userInfo = { ...this.userInfo, ...patch }
    },
    /**
     * 退出登录：清登录态。
     * 注意不清全部本地缓存——各业务方自己的草稿缓存应保留；
     * 若需彻底清理，请调用 this.util.cache.clearAll()。
     */
    logout() {
      this.token = ''
      this.userInfo = null
    },
    /** 强制退出（登录失效场景）：连同本地缓存一起清 */
    forceLogout() {
      this.logout()
      try {
        uni.removeStorageSync('__pinia_app__')
      } catch (e) { /* 小程序端无此 key 时忽略 */ }
    },
  },

  // 持久化：token / userInfo 落本地，systemInfo 不落
  persist: { paths: ['token', 'userInfo'] },
})
