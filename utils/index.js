/**
 * 工具聚合导出
 * 挂载到全局属性后（Vue3: app.config.globalProperties / Vue2: Vue.prototype），
 * 组件内可通过 this.util / this.http 访问。
 */
import config from './config.js'
import cache from './cache.js'
import {
  get, post, upload, request, setToken, getToken, clearToken, getHost,
} from './request.js'
import {
  getUser, setUser, clearUser, relogin, getCachedUser,
} from './user.js'
import { warn, logger } from './debug.js'
import * as router from './router.js'
import {
  dayjs, FORMAT, isDayjs, unix,
  getFormate, Str2Date, Date2Str, GetDays, DateReduce, Number2Fix, GetNumberOfMonth,
} from './date.js'

/**
 * 兼容旧项目的回调式写法（m-trans / m-button-process 等业务组件仍在使用）：
 *   this.util.GET({ url, data, success, fail, complete })
 */
function adapt(method) {
  return (opts = {}) => {
    const { url, data, success, fail, complete } = opts
    return method(url, data || {})
      .then((res) => { success && success(res); return res })
      .catch((err) => { fail && fail(err) })
      .finally(() => { complete && complete() })
  }
}
const GET = adapt(get)
const POST = adapt(post)

module.exports = {
  config,
  cache,
  // 请求
  get, post, upload, request, GET, POST,
  setToken, getToken, clearToken, getHost,
  // 用户
  getUser, setUser, clearUser, relogin, getCachedUser,
  // 日志
  warn, logger,
  // 日期（基于 day.js，见 utils/date.js）
  dayjs, FORMAT, isDayjs, unix,
  getFormate, Str2Date, Date2Str, GetDays, DateReduce, Number2Fix, GetNumberOfMonth,
  // 路由
  ...router,
}
