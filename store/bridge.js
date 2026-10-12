/**
 * store 桥接层：让 utils/ 下的普通模块也能安全访问 Pinia store。
 *
 * 为什么要它：utils/request.js、utils/user.js 是纯工具模块，
 * 运行时并不在组件 setup 上下文里，直接 useAppStore() 在某些
 * 时机（模块初始化早于 app.use(pinia)）会取不到 active pinia 而报错。
 * bridge 缓存 pinia 引用并做「未就绪时降级为内存态」的兜底，
 * 保证即便 store 尚未安装，请求层也不会崩。
 */
import { getActivePinia } from 'pinia'
import { useAppStore } from './app.js'

let piniaRef = null
let appStoreRef = null

/** 在 main.js 里 app.use(pinia) 之后调用，注册 pinia 实例 */
export function registerPinia(pinia) {
  piniaRef = pinia
  appStoreRef = null
}

/** 获取 pinia（优先用注册的，其次尝试 active） */
export function getPinia() {
  if (!piniaRef) {
    try {
      piniaRef = getActivePinia()
    } catch (e) {
      piniaRef = null
    }
  }
  return piniaRef
}

/**
 * 获取 useAppStore。
 * 若 pinia 尚未就绪，返回一个内存态的最小替身，
 * 保证 request/user 等模块在任何时机调用都安全（值不会丢，但不持久化）。
 */
export function getAppStore() {
  if (appStoreRef) return appStoreRef
  const pinia = getPinia()
  if (pinia) {
    appStoreRef = useAppStore(pinia)
    return appStoreRef
  }
  // 兜底：极简内存替身（不持久化）
  if (!appStoreRef) appStoreRef = createFallbackStore()
  return appStoreRef
}

/** 重置引用（测试用 / HMR 用） */
export function resetStoreBridge() {
  piniaRef = null
  appStoreRef = null
}

function createFallbackStore() {
  let token = ''
  let userInfo = null
  return {
    get token() { return token },
    set token(v) { token = v },
    get userInfo() { return userInfo },
    set userInfo(v) { userInfo = v },
    get isLogin() { return !!token },
    setToken(v) { token = v || '' },
    setUser(v) { userInfo = v || null },
    logout() { token = ''; userInfo = null },
    login({ token: t, user }) { token = t || ''; userInfo = user || null },
  }
}
