/**
 * 用户与登录（多端鉴权）
 * - 钉钉小程序：dd.getAuthCode -> 后端换 token
 * - 微信小程序：wx.login -> 后端换 token
 * - H5：后端以 cookie / 重定向 OAuth 维持会话，直接拉取用户信息
 *
 * 登录失效时 request 会广播 http:unauthorized，这里统一处理重登。
 */

import config from './config.js'
import cache from './cache.js'
import { post, get, setToken, clearToken } from './request.js'

const USER_KEY = config.CACHE_PREFIX + 'user'

let userinfo = null
let logging = false

export function setUser(info) {
  userinfo = info
  if (info) cache.set('user', info)
}
export function clearUser() {
  userinfo = null
  clearToken()
  cache.del('user')
}
export function getCachedUser() {
  return userinfo || cache.get('user')
}

export async function getUser() {
  if (userinfo) return userinfo
  const cached = cache.get('user')
  if (cached && getToken()) {
    userinfo = cached
    return userinfo
  }
  return login()
}

/* ------------------------- 登录分发 ------------------------- */
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
    // #ifdef MP-DINGTALK
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
    // #ifndef MP-DINGTALK
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
  if (data.token) setToken(data.token)
  const info = { ...data }
  delete info.token
  setUser(info)
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
