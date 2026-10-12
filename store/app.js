/**
 * 集中状态管理（Pinia）
 *
 * 定位：项目级「新增共享状态」的单一事实源（用户态、登录态、应用级配置）。
 * 老代码仍走 this.util / cache.js 不受影响；**新写的跨组件共享状态请放这里**，
 * 不要再散落到全局 util 或组件 data 里。
 *
 * 持久化：复用 utils/cache.js（统一前缀 + 过期）。store 只管内存态，
 * 写操作同时落 cache，冷启动时从 cache  hydrate。
 *
 * 用法（Options API 组件内）：
 *   import { useAppStore } from '@/store/app.js'
 *   const app = useAppStore()           // 在 created / methods 里调用即可
 *   app.token / app.isLogin
 *   app.setToken('xxx') / app.login({ token, user }) / app.logout()
 * 或在模板里：<text>{{ app.userInfo?.name }}</text>
 */
import { defineStore } from 'pinia'
import cache from '@/utils/cache.js'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export const useAppStore = defineStore('app', {
  state: () => ({
    token: cache.get(TOKEN_KEY) || '',
    userInfo: cache.get(USER_KEY) || null,
  }),
  getters: {
    isLogin: (state) => !!state.token,
  },
  actions: {
    setToken(token) {
      this.token = token || ''
      if (this.token) cache.set(TOKEN_KEY, this.token)
      else cache.del(TOKEN_KEY)
    },
    setUser(user) {
      this.userInfo = user || null
      if (this.userInfo) cache.set(USER_KEY, this.userInfo)
      else cache.del(USER_KEY)
    },
    // 登录成功后一次性写入 token + 用户态
    login({ token, user }) {
      this.setToken(token)
      this.setUser(user)
    },
    // 退出登录：清 store + 清全部本地缓存
    logout() {
      this.setToken('')
      this.setUser(null)
      cache.clearAll()
    },
  },
})
