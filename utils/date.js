/**
 * 日期工具 —— 基于 day.js (lib/day.min.js)
 *
 * 关于引入方式（踩坑记录，重要）：
 *   lib/day.min.js 是 UMD 产物，H5（浏览器 / Vite ESM）与小程序（CJS）的
 *   引入机制完全相反，必须条件编译区分，否则任一端运行时会报错：
 *     - H5：浏览器里没有 `require`（`require is not defined`）；且 Vite 把
 *           项目源码目录下的 .js 当原生 ESM，不给 UMD 合成 default 导出，写
 *           `import dayjs from` 会报 "does not provide an export named
 *           'default'"。故改用语效导入 `import '@/lib/day.min.js'`，UMD 加载
 *           时把 dayjs 挂到 globalThis，再从全局取工厂函数。
 *     - 小程序：是 CJS 运行时，UMD 的 module.exports 直接给出 dayjs 工厂函数，
 *           用 `require('@/lib/day.min.js')` 即可。
 *   故用 `#ifdef H5` / `#ifndef H5` 分别走 全局副作用导入 与 require 两条路径。
 *
 * 本模块替代了旧的 utils/date.js（已废弃），API 保持同名，
 * 因此 utils/index.js 的导出与业务调用方式均无需改动。
 */

// #ifdef H5
// Vite 把项目源码目录（非 node_modules）下的 .js 当作原生 ESM，不会给 UMD
// 合成 default 导出，写 `import dayjs from` 会报
// "does not provide an export named 'default'"。
// 故改用语效导入：UMD 加载时把 dayjs 挂到 globalThis，再从全局取工厂函数。
import '@/lib/day.min.js'
const dayjs = globalThis.dayjs
// #endif

// #ifndef H5
// 小程序是 CJS 运行时，UMD 的 module.exports 直接给出 dayjs 工厂函数
const dayjsModule = require('@/lib/day.min.js')
const dayjs =
  (typeof dayjsModule === 'function' && dayjsModule) ||
  (dayjsModule && (dayjsModule.default || dayjsModule.dayjs)) ||
  (typeof globalThis !== 'undefined' && globalThis.dayjs) ||
  dayjsModule
// #endif

/**
 * 常用格式预设
 */
export const FORMAT = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
}

/**
 * dayjs 工厂函数（用于链式调用），也支持 dayjs.extend 注册插件
 */
export { dayjs }

/**
 * 格式串归一化：兼容旧实现的小写格式
 *
 * 旧 date.js 用单字母 `y`/`m`/`d`/`h`/`i`/`s` 表示年月日时分秒，
 * 而 day.js 要求 `YYYY`/`MM`/`DD`/`HH`/`mm`/`ss`。
 * 直接把旧格式丢给 day.js 会输出错误结果，故在此统一映射。
 *
 * 正则里长的合法 token 排在前面优先匹配，保证 'YYYY-MM-DD' 这类
 * 已是 day.js 写法的格式串原样通过（不会被逐字符重复转换）。
 *
 * 注意：'mm' 在 day.js 中表示「分钟」，旧格式的「月」是 'm'，二者不可混用。
 */
function normalizeFormat(fmt) {
  if (!fmt) return FORMAT.DATETIME
  return fmt.replace(/YYYY|MM|DD|HH|mm|ss|[ymdhis]/g, (t) => {
    switch (t) {
      // 已是 day.js 合法 token，原样保留
      case 'YYYY':
      case 'MM':
      case 'DD':
      case 'HH':
      case 'mm':
      case 'ss':
        return t
      // 旧的小写写法 → day.js token
      case 'y': return 'YYYY' // 年
      case 'm': return 'MM'   // 月
      case 'd': return 'DD'   // 日
      case 'h': return 'HH'   // 时
      case 'i': return 'mm'   // 分
      case 's': return 'ss'   // 秒
      default: return t
    }
  })
}

/**
 * 格式化日期
 * @param {Date|string|number|object} [ds] 任意可解析值，默认当前时间
 * @param {string} [dt] 格式，默认 'YYYY-MM-DD HH:mm:ss'。
 *   同时兼容旧的小写格式串，如'y-m-d h:i:s'。
 * @returns {string}
 */
export function getFormate(ds, dt) {
  return dayjs(ds === undefined ? undefined : ds).format(normalizeFormat(dt))
}

/**
 * 解析为 dayjs 对象（替代旧的 Str2Date）
 * @param {string|Date|number} [str]
 * @returns {object} dayjs 对象
 */
export function Str2Date(str) {
  return dayjs(str === undefined ? undefined : str)
}

/**
 * Date → 'YYYY-MM-DD' 字符串（支持自定义分隔符）
 * @param {Date|string|number} [date]
 * @param {string} [delimiter] 默认 '-'
 * @returns {string}
 */
export function Date2Str(date, delimiter) {
  return dayjs(date === undefined ? undefined : date).format('YYYY' + (delimiter || '-') + 'MM' + (delimiter || '-') + 'DD')
}

/**
 * 当月天数
 * @param {Date|string|number} [date]
 * @returns {number}
 */
export function GetDays(date) {
  return dayjs(date === undefined ? undefined : date).daysInMonth()
}

/**
 * 两个日期相差毫秒数（d1 - d2）
 * @param {string|Date|number} d1
 * @param {string|Date|number} d2
 * @returns {number}
 */
export function DateReduce(d1, d2) {
  return dayjs(d1).valueOf() - dayjs(d2).valueOf()
}

/**
 * 数字补零（< 10 补前导零）
 * @param {number|string} n
 * @returns {string}
 */
export function Number2Fix(n) {
  const v = Number(n)
  return (v < 10 ? '0' + v : String(v))
}

/**
 * 获取某月的月初日期对象
 * @param {Date|string|number} date 参考日期
 * @param {number} [num] 月份偏移，默认 0
 * @returns {object} dayjs 对象
 */
export function GetNumberOfMonth(date, num) {
  return dayjs(date === undefined ? undefined : date).add(num || 0, 'month')
}

/* =========================================================================
 * day.js 直接透传 —— 避免为了用高级 API 而再包一层
 * 用法：this.util.dayjs().subtract(7, 'day').format('YYYY-MM-DD')
 * ========================================================================= */
export const isDayjs = dayjs.isDayjs
export const unix = (...args) => dayjs.unix(...args)

export default dayjs