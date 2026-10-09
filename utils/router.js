/**
 * 路由封装
 * jump(url, isReplace, params) —— 兼容旧项目写法：isReplace 为 true 时 redirect
 * 另提供 redirect / reLaunch / switchTab / back
 */

function appendQuery(url, params) {
  if (!params || typeof params !== 'object') return url
  const qs = Object.keys(params)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')
  if (!qs) return url
  return url + (url.indexOf('?') > -1 ? '&' : '?') + qs
}

let CurrentPath = '/pages/index/index'
export const getCurrentPath = () => CurrentPath
export const setCurrentPath = (url) => { CurrentPath = url }

export function jump(url, isReplace, params) {
  CurrentPath = url
  const target = appendQuery(url, params)
  if (isReplace) uni.redirectTo({ url: target })
  else uni.navigateTo({ url: target })
}

export function redirect(url, params) {
  uni.redirectTo({ url: appendQuery(url, params) })
}

export function reLaunch(url, params) {
  uni.reLaunch({ url: appendQuery(url, params) })
}

export function switchTab(url) {
  uni.switchTab({ url })
}

export function back(delta = 1) {
  uni.navigateBack({ delta })
}
