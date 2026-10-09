/**
 * 网络请求封装（跨端统一）
 * - 基于 uni.request，H5 / 微信小程序 / 钉钉小程序 通用
 * - 自动拼接基础地址、注入 token、统一处理业务状态码
 * - 登录失效（UNAUTH_CODES）自动广播 http:unauthorized 事件，由 user.js 处理重登
 *
 * 用法：
 *   get(url, data, options)        // GET
 *   post(url, data, options)       // POST(JSON)
 *   upload(url, filePath, options) // 文件上传
 *   request({ url, method, data, header, loading, ignore })
 */

import config from './config.js'
import cache from './cache.js'

const TOKEN_KEY = config.CACHE_PREFIX + 'token'

/* ------------------------- token ------------------------- */
export function setToken(token) {
  if (token) cache.set('token', token)
  else cache.del('token')
}
export function getToken() {
  return cache.get('token') || ''
}
export function clearToken() {
  cache.del('token')
}
export function getHost() {
  return config.API_BASE
}

/* ------------------------- 内部工具 ------------------------- */
function buildUrl(url) {
  if (/^https?:\/\//.test(url)) return url
  return config.API_BASE + (url.startsWith('/') ? url : '/' + url)
}

function authHeader() {
  const t = getToken()
  return t ? { token: t } : {}
}

function handleUnauthorized() {
  if (handleUnauthorized._ing) return
  handleUnauthorized._ing = true
  uni.showToast({ title: '登录失效，请重新登录', icon: 'none' })
  uni.$emit('http:unauthorized')
  setTimeout(() => { handleUnauthorized._ing = false }, 1500)
}

/* ------------------------- 核心请求 ------------------------- */
export function request(options) {
  const {
    url,
    method = 'GET',
    data = {},
    header = {},
    loading = true,
    ignore = false,
    dataType = 'json',
  } = options

  if (loading) uni.showLoading({ title: '加载中...', mask: false })

  return new Promise((resolve, reject) => {
    uni.request({
      url: buildUrl(url),
      method,
      data,
      header: {
        'content-type': 'application/json',
        ...authHeader(),
        ...header,
      },
      dataType,
      timeout: config.TIMEOUT,
      success: (res) => {
        if (res.statusCode !== 200) {
          reject({ status: res.statusCode, msg: `网络错误(${res.statusCode})` })
          return
        }
        const body = res.data
        if (ignore) { resolve(body); return }
        if (config.UNAUTH_CODES.includes(body.status)) {
          handleUnauthorized()
          reject({ status: body.status, msg: body.msg || '登录失效' })
          return
        }
        if (body.status !== 200) {
          uni.showToast({ title: body.msg || '请求失败', icon: 'none' })
          reject({ status: body.status, msg: body.msg })
          return
        }
        // 兼容两种后端返回结构：{ data: ... } 或裸数据
        resolve(body.data !== undefined ? body.data : body)
      },
      fail: (err) => {
        reject({ status: -1, msg: (err && err.errMsg) || '网络异常' })
      },
      complete: () => {
        if (loading) uni.hideLoading()
      },
    })
  })
}

/* ------------------------- 便捷方法 ------------------------- */
export function get(url, data, options = {}) {
  return request({ url, method: 'GET', data: data || {}, ...options })
}

export function post(url, data, options = {}) {
  return request({ url, method: 'POST', data: data || {}, ...options })
}

export function upload(url, filePath, options = {}) {
  const { name = 'file', formData = {}, header = {}, loading = true } = options
  if (loading) uni.showLoading({ title: '上传中...', mask: false })
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: buildUrl(url),
      filePath,
      name,
      formData,
      header: { ...authHeader(), ...header },
      success: (res) => {
        if (res.statusCode !== 200) {
          reject({ status: res.statusCode, msg: `上传失败(${res.statusCode})` })
          return
        }
        let body = res.data
        if (typeof body === 'string') {
          try { body = JSON.parse(body) } catch (e) { resolve(body); return }
        }
        if (config.UNAUTH_CODES.includes(body.status)) {
          handleUnauthorized()
          reject({ status: body.status, msg: body.msg || '登录失效' })
          return
        }
        if (body.status !== 200) {
          uni.showToast({ title: body.msg || '上传失败', icon: 'none' })
          reject({ status: body.status, msg: body.msg })
          return
        }
        resolve(body.data !== undefined ? body.data : body)
      },
      fail: (err) => {
        reject({ status: -1, msg: (err && err.errMsg) || '上传异常' })
      },
      complete: () => {
        if (loading) uni.hideLoading()
      },
    })
  })
}
