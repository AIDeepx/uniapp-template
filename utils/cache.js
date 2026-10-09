/**
 * 本地缓存封装
 * - 统一前缀、支持过期时间（秒）
 * - 自动 JSON 序列化
 */
import config from './config.js'

const prefix = config.CACHE_PREFIX

export default {
  set(name, data, expire) {
    const ts = Date.parse(new Date())
    uni.setStorageSync(prefix + name, JSON.stringify({
      data,
      expire: expire ? ts + expire * 1000 : 0,
    }))
  },
  get(name) {
    const raw = uni.getStorageSync(prefix + name)
    if (!raw) return null
    let obj
    try { obj = JSON.parse(raw) } catch (e) { return null }
    if (!obj) return null
    const ts = Date.parse(new Date())
    if (obj.expire !== 0 && obj.expire <= ts) {
      uni.removeStorageSync(prefix + name)
      return null
    }
    return obj.data
  },
  del(name) {
    uni.removeStorageSync(prefix + name)
    return true
  },
  // 清空本项目所有缓存
  clearAll() {
    const regex = new RegExp('^' + prefix)
    uni.getStorageInfoSync().keys.forEach((k) => {
      if (regex.test(k)) uni.removeStorageSync(k)
    })
  },
}
