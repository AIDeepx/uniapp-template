/**
 * 微信 JS-SDK 底层（仅 H5 端生效）
 *
 * 设计要点（对比旧实现修正了 7 个问题）：
 * 1. **懒加载**：jweixin sdk 用动态 script 注入，不写死 index.html，
 *    非微信环境不下载这 13KB。
 * 2. **并发去重**：同一时刻多次 init 只发一次签名请求，共享同一个 in-flight Promise。
 *    （旧实现并发调 getConfig 会重复请求，微信会拒后续请求）
 * 3. **失败可重试**：任何失败都会清除 ready 标志，下次调用会重新签名。
 *    （旧实现 jwxCfg 只置 true 不复位，签名过期后永久失效）
 * 4. **签名可过期重签**：recordExpireTime 到期自动重新签名，调用方无感。
 * 5. **新版 jsApiList**：旧的 onMenuShareAppMessage / chooseWXPay 等已废弃，
 *    改用 updateAppMessageShareData / updateTimelineShareData / requestPayment 等现行接口。
 * 6. **跨端安全**：非微信环境 isWeixinBrowser() 为 false，所有接口返回
 *    { ok:false, reason:'not-wechat' }，**不抛异常**，小程序/钉钉端不受影响。
 * 7. **脚本加载可失败**：sdkUrl 404 或网络不通时 reject 明确原因，不静默卡死。
 */

// #ifdef H5

/* ---------------- 环境判断 ---------------- */

/**
 * 是否微信内置浏览器（普通微信外浏览器如 QQ/UC 里打开不算）
 */
export function isWeixinBrowser() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (!/micromessenger/i.test(ua)) return false
  // 微信小程序 web-view 里也带 MicroMessenger，但部分 JSSDK 能力受限，
  // 由调用方通过 miniprogram 场景自行判断，这里不做排除。
  return true
}

/** 是否微信小程序 web-view（影响部分接口可用性） */
export function isWeixinWebview() {
  if (typeof navigator === 'undefined') return false
  return /miniProgram/i.test(navigator.userAgent || '')
}

/* ---------------- SDK 懒加载 ---------------- */

let sdkPromise = null

/**
 * 动态注入 jweixin script 并等待就绪。
 * 同一时刻多次调用共享同一个 Promise（脚本只注入一次）。
 */
export function loadScript(url) {
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject({ errCode: 'no-document', errMsg: '当前环境无 document' })
      return
    }
    // 已存在（可能是 index.html 手动引入的）
    if (window.jWeixin) {
      resolve(window.jWeixin)
      return
    }
    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.onload = () => {
      if (window.jWeixin) resolve(window.jWeixin)
      else reject({ errCode: 'sdk-missing', errMsg: 'SDK 加载完成但未挂载 window.jWeixin' })
    }
    script.onerror = () => {
      // 允许下次重试
      sdkPromise = null
      reject({ errCode: 'sdk-load-failed', errMsg: '微信 JSSDK 加载失败：' + url })
    }
    document.head.appendChild(script)
  })
  return sdkPromise
}

/* ---------------- 签名配置 ---------------- */

/** 默认申请的 JS-SDK 权限（新版接口名，旧接口已下线） */
export const DEFAULT_JS_API_LIST = [
  'checkJsApi',
  // 分享（新版；旧的 onMenuShareAppMessage / onMenuShareTimeline 已废弃）
  'updateAppMessageShareData',
  'updateTimelineShareData',
  // 定位
  'getLocation',
  'openLocation',
  'chooseLocation',
  // 扫码
  'scanQRCode',
  // 媒体
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  // 支付
  'requestPayment',
  // 小程序跳转
  'navigateToMiniProgram',
]

/** 状态 */
let ready = false
let expireAt = 0          // 签名过期时间戳（ms），0 表示未知
let inflight = null       // 进行中的配置 Promise，用于并发去重

/** 微信签名有效期约 2 小时，这里提前 5 分钟重签 */
const EXPIRE_GUARD = 5 * 60 * 1000

export function isReady() {
  return ready
}

/** 主动置为未就绪（如检测到接口报签名错误时调用，下次会自动重签） */
export function invalidate() {
  ready = false
  expireAt = 0
  inflight = null
}

/**
 * 获取签名（后端接口）
 * @param {string} url 接口地址
 * @param {object} extra 附加参数
 * @returns {Promise<object>} 签名结果
 */
function fetchSignature(url, extra) {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method: 'GET',
      // 后端签名的 url 必须与页面当前 url 完全一致（去掉 hash）
      data: { url: encodeURIComponent(stripHash(location.href)), ...extra },
      header: { Referer: location.href },
      success: (res) => {
        if (res.statusCode !== 200) {
          reject({ errCode: 'http-' + res.statusCode, errMsg: '获取签名失败 HTTP ' + res.statusCode })
          return
        }
        if (!res.data || !res.data.appId) {
          reject({ errCode: 'no-signature', errMsg: '后端未返回有效签名' })
          return
        }
        resolve(res.data)
      },
      fail: (err) => {
        reject({ errCode: 'request-failed', errMsg: (err && err.errMsg) || '签名请求失败' })
      },
    })
  })
}

/** 去掉 url 的 hash 部分（微信签名以 hash 之前的 url 为准） */
export function stripHash(url) {
  const i = url.indexOf('#')
  return i > -1 ? url.slice(0, i) : url
}

/**
 * 初始化微信 JSSDK：加载 sdk → 取签名 → config → 等待 ready
 *
 * 并发安全：同一时刻多次调用共享 inflight，不会重复请求后端。
 *
 * @param {object} options
 * @param {string} options.url 签名接口
 * @param {object} [options.extra] 附加参数（如 tag）
 * @param {boolean} [options.debug] 是否开启调试
 * @param {string} [options.sdkUrl] sdk 地址
 * @param {string[]} [options.jsApiList] 申请的接口列表
 * @param {number} [options.timeout] ready 超时（ms），默认 10000
 * @returns {Promise<{ok:boolean, reason?:string, data?:object}>}
 */
export function init(options = {}) {
  const {
    url,
    extra = {},
    debug = false,
    sdkUrl = '/static/js/jweixin-1.6.0.js',
    jsApiList = DEFAULT_JS_API_LIST,
    timeout = 10000,
  } = options

  // 非微信环境：直接降级返回，不抛异常
  if (!isWeixinBrowser()) {
    return Promise.resolve({ ok: false, reason: 'not-wechat' })
  }
  if (!url) {
    return Promise.resolve({ ok: false, reason: 'no-config-url' })
  }

  // 已就绪且未临近过期 → 直接返回
  if (ready && (expireAt === 0 || Date.now() < expireAt - EXPIRE_GUARD)) {
    return Promise.resolve({ ok: true, cached: true })
  }

  // 并发去重：共享进行中的 Promise
  if (inflight) return inflight

  inflight = loadScript(sdkUrl)
    .then((wx) =>
      fetchSignature(url, extra).then((sig) => ({ wx, sig }))
    )
    .then(({ wx, sig }) =>
      new Promise((resolve, reject) => {
        let settled = false
        const timer = setTimeout(() => {
          if (settled) return
          settled = true
          invalidate()
          reject({ errCode: 'ready-timeout', errMsg: 'wx.ready 超时' })
        }, timeout)

        wx.config({
          debug,
          appId: sig.appId,
          timestamp: sig.timestamp,
          nonceStr: sig.nonceStr,
          signature: sig.signature,
          jsApiList,
          openTagList: ['wx-open-launch-weapp'],
        })

        wx.ready(() => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          ready = true
          // 优先用后端返回的过期时间，没有则按微信默认 2 小时估算
          const ttl = sig.expireTime ? Number(sig.expireTime) : 2 * 60 * 60 * 1000
          expireAt = sig.expireTime ? Number(sig.expireTime) : Date.now() + ttl
          resolve({ ok: true, data: sig })
        })

        wx.error((err) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          // 失败必须清除标志，否则永远无法重试（旧实现的 bug）
          invalidate()
          reject({ errCode: (err && err.errCode) || 'config-error', errMsg: (err && err.errMsg) || 'wx.config 失败' })
        })
      })
    )
    .catch((err) => {
      invalidate()
      throw err
    })
    .finally(() => {
      inflight = null
    })

  return inflight
}

/**
 * 调用任意 wx 接口的通用包装：
 * - 自动等待初始化
 * - Promise 化
 * - 签名类错误自动 invalidate 以便下次重签
 *
 * @param {string} name 接口名，如 'scanQRCode'
 * @param {object} options 接口参数
 * @param {object} initOptions init 配置
 */
export function invoke(name, options = {}, initOptions = {}) {
  return init(initOptions)
    .then((res) => {
      if (!res.ok) {
        return Promise.reject({ errCode: res.reason || 'not-ready', errMsg: 'JSSDK 未就绪：' + (res.reason || '') })
      }
      return new Promise((resolve, reject) => {
        const wx = window.jWeixin
        if (!wx || typeof wx[name] !== 'function') {
          reject({ errCode: 'unsupported', errMsg: '当前环境不支持 ' + name })
          return
        }
        wx[name]({
          ...options,
          success: (r) => resolve(r),
          fail: (e) => {
            // 签名失效类错误：清除 ready，下次自动重签
            const msg = (e && e.errMsg) || ''
            if (/signature|config:fail|invalid signature/i.test(msg)) invalidate()
            reject({ errCode: (e && e.errCode) || 'invoke-fail', errMsg: msg || name + ' 调用失败', data: e })
          },
        })
      })
    })
}

// #endif
