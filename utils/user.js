/**
 * 用户与登录（多端鉴权）
 * - 钉钉小程序：dd.getAuthCode -> 后端换 token
 * - 微信小程序：wx.login -> 后端换 token
 * - H5：后端以 cookie / 重定向 OAuth 维持会话，直接拉取用户信息
 *
 * 登录失效时 request 会广播 http:unauthorized，这里统一处理重登。
 */

import config from './config.js'
import { post, get, clearToken } from './request.js'
import { getAppStore } from '../store/bridge.js'

/**
 * 用户态读写统一转发到 store/app.js（唯一真相源）。
 * 旧导出保留仅为兼容老业务代码，模块内不再维护 userinfo 副本，
 * 避免「store 清了但这里还留着」导致退出登录后仍显示已登录。
 */
export function setUser(info) {
  getAppStore().setUser(info)
}
export function clearUser() {
  getAppStore().setUser(null)
  clearToken()
}
export function getCachedUser() {
  return getAppStore().userInfo
}

export async function getUser() {
  const app = getAppStore()
  // 已有用户态且带 token → 直接复用，避免重复登录
  if (app.userInfo && app.token) return app.userInfo
  return login()
}

/* ------------------------- 登录分发 ------------------------- */
let logging = false
async function login() {
  if (logging) return new Promise((r) => setTimeout(() => r(getUser()), 300))
  logging = true
  try {
    let info = null
    if (config.AUTH_TYPE === 'dingtalk') info = await loginByDingtalk()
    else if (config.AUTH_TYPE === 'wechat') info = await loginByWechat()
    else info = await loginByH5()
    return info
  } finally {
    logging = false
  }
}

function loginByDingtalk() {
  return new Promise((resolve, reject) => {
    // 钉钉小程序复用支付宝 mp-alipay 编译，运行时编译宏为 MP-ALIPAY（非 MP-DINGTALK）
    // #ifdef MP-ALIPAY
    dd.getAuthCode({
      success: async (res) => {
        try {
          const data = await post(config.AUTH_API.dingtalkLogin, { code: res.authCode })
          resolve(finishLogin(data))
        } catch (e) { reject(e) }
      },
      fail: () => {
        uni.showModal({ title: '登录失败', content: '获取钉钉授权码失败，请重试', showCancel: false })
        reject(false)
      },
    })
    // #endif
    // #ifndef MP-ALIPAY
    resolve(false)
    // #endif
  })
}

function loginByWechat() {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    wx.login({
      success: async (res) => {
        try {
          const data = await post(config.AUTH_API.wechatLogin, { code: res.code })
          resolve(finishLogin(data))
        } catch (e) { reject(e) }
      },
      fail: () => {
        uni.showModal({ title: '登录失败', content: '获取微信登录凭证失败，请重试', showCancel: false })
        reject(false)
      },
    })
    // #endif
    // #ifndef MP-WEIXIN
    resolve(false)
    // #endif
  })
}

function loginByH5() {
  return get(config.AUTH_API.userInfo)
    .then((data) => finishLogin(data))
    .catch(() => false)
}

function finishLogin(data) {
  if (!data) return false
  const info = { ...data }
  delete info.token
  // token 与用户态一并写入 store（store 内部同步到持久化）
  getAppStore().login({ token: data.token, user: info })
  return info
}

/* ------------------------- 重新登录 ------------------------- */
export function relogin() {
  clearUser()
  // #ifdef H5
  window.location.href = config.AUTH_API.h5Redirect
  // #endif
  // #ifndef H5
  getUser().then(() => uni.$emit('user:login'))
  // #endif
}

// 监听请求层的登录失效事件，统一触发重登（模块级注册一次）
uni.$on('http:unauthorized', () => relogin())
