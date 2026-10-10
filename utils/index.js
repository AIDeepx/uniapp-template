/**
 * 工具聚合导出
 * 挂载到全局属性后（Vue3: app.config.globalProperties / Vue2: Vue.prototype），
 * 组件内可通过 this.util / this.http 访问。
 *
 * 注意：这里统一用 ESM 具名导出（不用 module.exports），
 * 因为 Vite / Rollup 的 ESM 严格模式下，CommonJS 的默认导入会取不到 default。
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
import {
  getCurrentPath, setCurrentPath,
  jump, redirect, reLaunch, switchTab, back,
} from './router.js'
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

export {
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
  // 路由（显式列出，避免对象展开语法在小程序编译阶段报错）
  getCurrentPath, setCurrentPath,
  jump, redirect, reLaunch, switchTab, back,
}

/**
 * 默认导出：整体工具对象，供 `import Util from './utils/index.js'` 使用。
 * main.js 正是这种引入方式，因此必须有 default。
 */
const Util = {
  config,
  cache,
  get, post, upload, request, GET, POST,
  setToken, getToken, clearToken, getHost,
  getUser, setUser, clearUser, relogin, getCachedUser,
  warn, logger,
  dayjs, FORMAT, isDayjs, unix,
  getFormate, Str2Date, Date2Str, GetDays, DateReduce, Number2Fix, GetNumberOfMonth,
  getCurrentPath, setCurrentPath,
  jump, redirect, reLaunch, switchTab, back,
}

export default Util