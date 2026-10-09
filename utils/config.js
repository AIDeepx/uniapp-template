/**
 * 全局配置（多端）
 * 模板默认适配：H5、微信小程序(mp-weixin)、钉钉小程序(mp-dingtalk)，不涉及 APP。
 * 切换平台后，编译器会保留对应 #ifdef 分支，其余被剔除，不会打包多余代码。
 */

const isDev = process.env.NODE_ENV === 'development'

// 当前运行平台（编译期确定）
let PLATFORM = 'h5'
// #ifdef MP-WEIXIN
PLATFORM = 'mp-weixin'
// #endif
// #ifdef MP-DINGTALK
PLATFORM = 'mp-dingtalk'
// #endif
// #ifdef H5
PLATFORM = 'h5'
// #endif

// 各端接口基础地址（部署时按实际后端修改）
const API_BASE = {
  'h5': isDev ? '/api' : 'https://your-domain.com/api',
  'mp-weixin': 'https://your-domain.com/api',
  'mp-dingtalk': 'https://your-domain.com/api',
}

// 鉴权方式：不同端走不同登录流程
const AUTH_TYPE = {
  'h5': 'h5', // 由后端 cookie / 重定向 OAuth 维持会话
  'mp-weixin': 'wechat', // wx.login -> code
  'mp-dingtalk': 'dingtalk', // dd.getAuthCode -> code
}

// 鉴权相关接口 / 地址（与 server/api.js 中的 auth 对应）
const AUTH_API = {
  wechatLogin: '/auth/wechatLogin',
  dingtalkLogin: '/auth/dingtalkLogin',
  userInfo: '/auth/userInfo',
  // H5 未登录时跳转的鉴权重定向地址（由后端完成 OAuth 后回跳）
  h5Redirect: 'https://your-domain.com/auth/h5',
}

const config = {
  isDev,
  PLATFORM,
  API_BASE: API_BASE[PLATFORM],
  AUTH_TYPE: AUTH_TYPE[PLATFORM],
  AUTH_API,
  // 本地缓存 key 前缀
  CACHE_PREFIX: 'zfsw_',
  // 视为“未登录 / 登录失效”的业务状态码
  UNAUTH_CODES: [401, 403, 408],
  // 请求超时（毫秒）
  TIMEOUT: 30000,
}

export default config
