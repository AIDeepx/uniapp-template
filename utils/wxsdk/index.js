/**
 * 微信 JSSDK 统一对外接口
 *
 * 与旧实现（utils/wxjssdk.js）的关键差异：
 * - 全部接口**返回 Promise**（旧实现 chooseImage / previewImage / getLocalImgData
 *   是 async 但不 return，调用方拿不到结果）
 * - 调用时**自动确保已初始化**，业务侧不需要先 getConfig()
 * - 非微信环境返回明确 reason，不抛异常、不卡死
 * - 签名失败自动重签
 *
 * 用法：
 *   // 1) 直接调用（首次会自动初始化）
 *   const res = await this.wxsdk.scanQRCode()
 *   const loc = await this.wxsdk.getLocation({ type: 'gcj02' })
 *
 *   // 2) 需要分享时先自定义分享内容（新版接口）
 *   this.wxsdk.readyForShare({ title, desc, link, imgUrl })
 *   this.wxsdk.setShareData({ title, desc, link, imgUrl })
 *
 *   // 3) 页面进入时可预热（可选，不阻塞）
 *   this.wxsdk.preload()
 */

// #ifdef H5
import { init, invoke, invalidate, isReady, isWeixinBrowser, DEFAULT_JS_API_LIST } from './core.js'
import config from '../config.js'

/** 从 config 读取 JSSDK 配置（可运行时覆盖） */
function initOptions(overrides = {}) {
  const c = config.WX_SDK || {}
  return {
    url: c.url || '',
    extra: { tag: c.tag },
    debug: c.debug,
    sdkUrl: c.sdkUrl,
    ...overrides,
  }
}

/* ---------------- 生命周期 ---------------- */

/**
 * 主动初始化（幂等 + 并发去重）。
 * 多数场景不需要手动调用——业务接口内部会自动 init。
 */
export function ready(overrides) {
  return init(initOptions(overrides)).then((res) => {
    if (!res.ok) {
      console.warn('[wxsdk] 未就绪：' + (res.reason || ''))
    }
    return res
  })
}

/** 页面进入时预热，避免首次点击才加载 sdk 造成的延迟 */
export function preload() {
  if (!isWeixinBrowser()) return
  init(initOptions()).catch((e) => {
    console.warn('[wxsdk] 预热失败：' + (e && e.errMsg))
  })
}

/** 强制重新签名（如切换页面后 url 变化） */
export function refresh() {
  invalidate()
  return ready()
}

/* ---------------- 基础能力 ---------------- */

/** 扫码 */
export function scanQRCode(options = {}) {
  return invoke('scanQRCode', { needResult: 1, scanType: ['qrCode', 'barCode'], ...options }, initOptions())
}

/** 获取位置 */
export function getLocation(options = {}) {
  return invoke('getLocation', { type: 'gcj02', ...options }, initOptions())
}

/** 打开地图 */
export function openLocation(options = {}) {
  return invoke('openLocation', { scale: 16, ...options }, initOptions())
}

/** 选择位置 */
export function chooseLocation(options = {}) {
  return invoke('chooseLocation', options, initOptions())
}

/* ---------------- 媒体 ---------------- */

/** 拍照或从相册选图（返回 Promise，旧实现是 bug） */
export function chooseImage(options = {}) {
  return invoke('chooseImage', { count: 9, sizeType: ['compressed', 'original'], sourceType: ['album', 'camera'], ...options }, initOptions())
}

/** 预览本地图片 */
export function previewImage(options = {}) {
  return invoke('previewImage', { urls: [], current: '', ...options }, initOptions())
}

/** 上传图片到微信服务器 */
export function uploadImage(options = {}) {
  return invoke('uploadImage', options, initOptions())
}

/** 下载微信服务器上的图片 */
export function downloadImage(options = {}) {
  return invoke('downloadImage', options, initOptions())
}

/** 获取 base64 数据（本地图片） */
export function getLocalImgData(options = {}) {
  return invoke('getLocalImgData', options, initOptions())
}

/* ---------------- 分享 ---------------- */

/**
 * 设置分享内容（新版统一接口，同时设置好友与朋友圈）
 * 必须在 wx.ready 之后调用；本方法内部已确保 ready。
 *
 * 注意：微信要求分享内容设置在**分享触发时**仍有效，
 * 建议在 onShow 里调用（从分享卡片返回时不会重置）。
 */
export function setShareData({ title, desc, link, imgUrl }) {
  const share = {
    title: title || document.title,
    desc: desc || '',
    link: link || location.href.split('#')[0],
    imgUrl: imgUrl || '',
  }
  return invoke('updateAppMessageShareData', share, initOptions())
    .then(() => {
      // 朋友圈分享需单独设置，字段不同
      return invoke('updateTimelineShareData', {
        title: share.title,
        link: share.link,
        imgUrl: share.imgUrl,
      }, initOptions())
    })
}

/**
 * 页面 onShow 时调用：确保已签名 + 设置分享内容。
 * 非微信环境静默跳过。
 */
export function readyForShare(share) {
  if (!isWeixinBrowser()) return Promise.resolve({ ok: false, reason: 'not-wechat' })
  return ready()
    .then((res) => {
      if (!res.ok) return res
      return setShareData(share).then(() => ({ ok: true }))
    })
    .catch((e) => {
      console.warn('[wxsdk] 分享初始化失败：' + (e && e.errMsg))
      return { ok: false, reason: (e && e.errMsg) || 'share-failed' }
    })
}

/** 检测当前环境支持哪些接口 */
export function checkJsApi(jsApiList = DEFAULT_JS_API_LIST) {
  return invoke('checkJsApi', { jsApiList }, initOptions())
}

/* ---------------- 小程序跳转 ---------------- */

/**
 * 跳转到小程序
 * @param {string} appId 小程序 appId
 * @param {string} path 小程序页面路径
 * @param {object} extra 额外参数（query 会拼到 path）
 */
export function navigateToMiniProgram(appId, path = '', extra = {}) {
  const query = Object.keys(extra)
    .filter((k) => extra[k] !== undefined && extra[k] !== null && extra[k] !== '')
    .map((k) => `${k}=${encodeURIComponent(extra[k])}`)
    .join('&')
  const fullPath = query ? `${path}${path.includes('?') ? '&' : '?'}${query}` : path
  return invoke('navigateToMiniProgram', { appId, path: fullPath, envVersion: 'release' }, initOptions())
}

/* ---------------- 支付 ---------------- */

/**
 * 微信支付
 * @param {object} pay 后端返回的支付参数
 *   { appId, timeStamp, nonceStr, package, signType, paySign }
 */
export function payment(pay = {}) {
  return invoke(
    'requestPayment',
    {
      appId: pay.appId,
      timeStamp: pay.timeStamp,
      nonceStr: pay.nonceStr,
      package: pay.package,
      signType: pay.signType || 'MD5',
      paySign: pay.paySign,
    },
    initOptions()
  )
}

/* ---------------- 其它 ---------------- */

/** 跳转到指定文章（需要公众号资质） */
export function openOfficialArticle(url) {
  return invoke('openOfficialArticle', { url }, initOptions())
}

/** 是否当前可用（微信环境 + 已就绪） */
export function available() {
  return isWeixinBrowser() && isReady()
}

export default {
  // 生命周期
  ready, preload, refresh, available,
  // 基础
  scanQRCode, getLocation, openLocation, chooseLocation,
  // 媒体
  chooseImage, previewImage, uploadImage, downloadImage, getLocalImgData,
  // 分享
  setShareData, readyForShare, checkJsApi,
  // 小程序 / 支付
  navigateToMiniProgram, payment,
  // 其它
  openOfficialArticle,
}

// #endif
