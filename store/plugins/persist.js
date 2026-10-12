/**
 * Pinia 持久化插件（基于 utils/cache.js）
 *
 * 为什么需要：各 store 手写 `cache.set` 极易漏写 / 字段漂移，
 * 插件化后「声明即持久化」，新增 state 不用改写盘逻辑。
 *
 * 用法（在 store 里声明 persist 字段）：
 *   export const useAppStore = defineStore('app', {
 *     state: () => ({ token: '', userInfo: null }),
 *     persist: true,                       // 全量持久化
 *     // 或精细控制：
 *     // persist: { paths: ['token', 'userInfo'], expire: 7 * 24 * 3600 },
 *   })
 *
 * 约定：
 * - 复用 cache.js（统一 CACHE_PREFIX + 过期秒数），与老代码 this.util.cache 同一份存储
 * - 持久化 key = `pinia:<storeId>`，与业务 cache key 不冲突
 * - 读盘时机为插件安装后首次创建 store 时（hydrate），不会覆盖后端刚返回的值
 */
import cache from '@/utils/cache.js'

const PREFIX = 'pinia:'

export function createPersistPlugin(options = {}) {
  /**
   * @param {object} ctx Pinia 插件上下文
   */
  return (ctx) => {
    const store = ctx.store
    // persist 配置有两个来源，兼容两种写法：
    //   1) options.persist —— store 定义时写在顶层的字段（推荐）
    //   2) store.$persist —— 兼容 persist-path 插件把 options 映射到 $persist 的行为
    const conf = (ctx.options && ctx.options.persist) || store.$persist
    if (!conf) return

    const opt = typeof conf === 'object' ? conf : {}
    // paths 为空表示全量持久化
    const paths = Array.isArray(opt.paths) && opt.paths.length ? opt.paths : null
    const expire = opt.expire || 0
    const key = PREFIX + store.$id

    const pick = (state) => {
      if (!paths) return JSON.parse(JSON.stringify(state))
      const out = {}
      paths.forEach((p) => { out[p] = state[p] })
      return out
    }

    // 1. hydrate：以缓存为准（缓存里没有的字段保持 store 默认值）
    const cached = cache.get(key)
    if (cached && typeof cached === 'object') {
      const patch = {}
      Object.keys(cached).forEach((k) => {
        if (paths && !paths.includes(k)) return
        if (k in store.$state) patch[k] = cached[k]
      })
      if (Object.keys(patch).length) store.$patch(patch)
    }

    // 2. 订阅：任何变更自动写盘
    store.$subscribe((mutation, state) => {
      cache.set(key, pick(state), expire)
    }, { detached: true })
  }
}

/**
 * 供 store 声明 persist 用的辅助函数（可选，仅为类型提示 / 少写一个字）。
 * 直接写 `persist: true` 或 `persist: { paths: [...] }` 即可，无需调用。
 */
export const persist = { plugin: createPersistPlugin }
