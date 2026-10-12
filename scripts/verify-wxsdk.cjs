/**
 * 微信 JSSDK 封装逻辑校验
 * 运行：node scripts/verify-wxsdk.cjs
 *
 * 覆盖：环境判断 / hash 剥离 / 并发去重 / 幂等 / 失败可重试 / 签名过期重签 /
 *       新版 jsApiList / 跨端降级不抛异常 / 对外接口 Promise 化
 *
 * 说明：core.js / index.js 带 `#ifdef H5` 条件编译注释，
 * node 直接执行时它们只是注释、代码照常运行（等价于 H5 编译后），故可在 node 下测。
 */
const path = require('path')
const fs = require('fs')
const vm = require('vm')
const Module = require('module')

const ROOT = path.resolve(__dirname, '..')

let pass = 0
let fail = 0
const ok = (n) => { pass++; console.log('  ✓ ' + n) }
const bad = (n, e) => { fail++; console.log('  ✗ ' + n + (e ? '  → ' + e : '')) }

/* ---------------- mock 浏览器 / uni ---------------- */
// ⚠️ Node 18+ 内置了只读的全局 navigator（userAgent = 'Node.js/xx'），
// 直接赋值会被静默忽略，必须用 defineProperty 强制覆盖，否则 UA 永远是 Node.js。
let ua = 'Mozilla/5.0 (iPhone) MicroMessenger/8.0.40'
const requestHandlers = []
Object.defineProperty(globalThis, 'navigator', {
  value: { get userAgent() { return ua } },
  writable: true,
  configurable: true,
})
globalThis.location = { href: 'https://example.com/page/index?a=1#/detail' }
globalThis.document = {
  head: { appendChild: () => {} },
  createElement: () => ({ set src(v) { this._src = v }, async: true }),
  title: '测试页',
}
globalThis.window = { jWeixin: null }
globalThis.uni = {
  request(opts) { requestHandlers.push(opts) },
  showToast() {},
}

/* ---------------- ESM loader ---------------- */
const origResolve = Module._resolveFilename
Module._resolveFilename = function (request, ...args) {
  if (request.startsWith('@/')) request = path.join(ROOT, request.slice(2))
  return origResolve.call(this, request, ...args)
}

function loadEsm(file) {
  let src = fs.readFileSync(file, 'utf8')
  const names = []
  let hasDefault = false
  src = src.replace(/import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"]/g, (_, n, p) => `const ${n} = __i(__req('${p}'))`)
  src = src.replace(/import\s+\{([\s\S]*?)\}\s+from\s+['"]([^'"]+)['"]/g, (_, ns, p) => `const {${ns.replace(/\s+/g, ' ')}} = __i(__req('${p}'))`)
  let m
  if (/export\s+default\s/.test(src)) hasDefault = true
  const re = /export\s+(?:const|function|let|var)\s+([A-Za-z_$][\w$]*)/g
  while ((m = re.exec(src))) names.push(m[1])
  src = src.replace(/export\s+default\s+/g, '__default = ')
  src = src.replace(/export\s+(const|function|let|var)\s+/g, '$1 ')
  const exp = names.slice()
  if (hasDefault) exp.push('__default')
  src = 'let __default=null;\n' + src + '\n;module.exports={' + exp.join(',') + '};\n'

  const mod = { exports: {} }
  const dir = path.dirname(file)
  const req = (id) => {
    if (id.startsWith('@/')) return loadEsm(path.join(ROOT, id.slice(2)))
    if (id.startsWith('.')) return loadEsm(path.resolve(dir, id))
    return require(id)
  }
  const interop = (m) => (m && m.__default !== undefined && m.__default !== null ? m.__default : m)
  vm.runInThisContext('(function(module,__req,__i){' + src + '\n})', { filename: file })(mod, req, interop)
  return mod.exports
}

/** 让出一轮微任务，等异步链推进 */
const tick = () => new Promise((r) => setTimeout(r, 0))

console.log('\n【微信 JSSDK 封装校验】')

;(async function () {
try {
  const core = loadEsm(path.join(ROOT, 'utils/wxsdk/core.js'))

  /* ---------- 1. 环境判断 ---------- */
  ua = 'Mozilla/5.0 (iPhone) MicroMessenger/8.0.40'
  core.isWeixinBrowser() ? ok('isWeixinBrowser：微信内置浏览器 = true') : bad('isWeixinBrowser 微信')
  ua = 'Mozilla/5.0 (iPhone) Safari/604.1'
  core.isWeixinBrowser() === false ? ok('isWeixinBrowser：普通 Safari = false') : bad('isWeixinBrowser Safari')
  ua = 'Mozilla/5.0 MicroMessenger/8.0 (miniProgram)'
  core.isWeixinWebview() ? ok('isWeixinWebview：小程序 web-view = true') : bad('isWeixinWebview')
  ua = 'Mozilla/5.0 (iPhone) MicroMessenger/8.0.40'

  /* ---------- 2. hash 剥离 ---------- */
  const stripped = core.stripHash('https://example.com/a?b=1#/detail')
  stripped === 'https://example.com/a?b=1' ? ok('stripHash：去掉 hash（微信签名按 hash 前 url）') : bad('stripHash', stripped)
  core.stripHash('https://example.com/a') === 'https://example.com/a'
    ? ok('stripHash：无 hash 时原样返回') : bad('stripHash 无hash')

  /* ---------- 3. jsApiList 用新版接口 ---------- */
  const list = core.DEFAULT_JS_API_LIST
  list.indexOf('updateAppMessageShareData') > -1 ? ok('jsApiList 含新版 updateAppMessageShareData') : bad('新版分享接口缺失')
  list.indexOf('updateTimelineShareData') > -1 ? ok('jsApiList 含新版 updateTimelineShareData') : bad('新版朋友圈接口缺失')
  list.indexOf('requestPayment') > -1 ? ok('jsApiList 含新版 requestPayment') : bad('requestPayment 缺失')
  list.indexOf('navigateToMiniProgram') > -1 ? ok('jsApiList 含 navigateToMiniProgram') : bad('navigateToMiniProgram 缺失')
  list.indexOf('onMenuShareAppMessage') === -1 ? ok('jsApiList 已移除废弃的 onMenuShareAppMessage') : bad('仍有废弃接口')
  list.indexOf('chooseWXPay') === -1 ? ok('jsApiList 已移除废弃的 chooseWXPay') : bad('仍有 chooseWXPay')

  /* ---------- 4. 非微信环境降级（不抛异常）---------- */
  ua = 'Mozilla/5.0 Safari'
  const degraded = await core.init({ url: '/wx/jsSdkConfig' })
  degraded.ok === false && degraded.reason === 'not-wechat'
    ? ok('非微信环境 init 返回 { ok:false, reason:"not-wechat" } 且不抛异常')
    : bad('非微信降级', JSON.stringify(degraded))
  ua = 'Mozilla/5.0 (iPhone) MicroMessenger/8.0.40'
  const noUrl = await core.init({ url: '' })
  noUrl.ok === false && noUrl.reason === 'no-config-url'
    ? ok('微信环境但未配置签名接口 → reason:"no-config-url"') : bad('no-config-url', JSON.stringify(noUrl))
  ua = 'Mozilla/5.0 (iPhone) MicroMessenger/8.0.40'

  /* ---------- 5. 并发去重 + 幂等 ---------- */
  const core2 = loadEsm(path.join(ROOT, 'utils/wxsdk/core.js'))
  let lastConfig = null
  let pendingErrorCb = null
  let pendingReadyCb = null
  global.window.jWeixin = {
    config(o) {
      lastConfig = o
      setTimeout(() => { if (pendingReadyCb) { const c = pendingReadyCb; pendingReadyCb = null; c() } }, 0)
    },
    ready(cb) { pendingReadyCb = cb },
    error(cb) { pendingErrorCb = cb },
    scanQRCode(o) { o.success({ result: 'scan-ok' }) },
  }

  requestHandlers.length = 0
  const p1 = core2.init({ url: '/wx/jsSdkConfig' })
  const p2 = core2.init({ url: '/wx/jsSdkConfig' })
  await tick()
  const reqCount = requestHandlers.length
  reqCount === 1
    ? ok('并发去重：同时 init 两次只发 1 次签名请求（实际 ' + reqCount + '）')
    : bad('并发去重', '请求数=' + reqCount)

  requestHandlers.forEach((r) => {
    r.success({ statusCode: 200, data: { appId: 'wx123', timestamp: '1', nonceStr: 'n', signature: 's' } })
  })
  const res1 = await p1
  const res2 = await p2
  res1.ok === true ? ok('init 成功返回 { ok:true }') : bad('init 返回', JSON.stringify(res1))
  res2.ok === true ? ok('并发的第二个调用同样 resolve（共享 inflight）') : bad('并发第二调用', JSON.stringify(res2))
  core2.isReady() ? ok('isReady：初始化后为 true') : bad('isReady')
  lastConfig && lastConfig.appId === 'wx123' ? ok('config 正确传入 appId') : bad('config appId')
  lastConfig && lastConfig.signature === 's' ? ok('config 正确传入 signature') : bad('config signature')
  lastConfig && lastConfig.jsApiList.indexOf('updateAppMessageShareData') > -1
    ? ok('config 传入的是新版 jsApiList') : bad('config jsApiList')

  requestHandlers.length = 0
  const again = await core2.init({ url: '/wx/jsSdkConfig' })
  again.cached === true ? ok('幂等：已就绪时返回 cached=true 不重复请求') : bad('幂等', JSON.stringify(again))
  requestHandlers.length === 0 ? ok('幂等：确实未再发签名请求') : bad('幂等仍发请求')

  /* ---------- 6. 失败可重试（旧实现的致命 bug）---------- */
  core2.invalidate()
  core2.isReady() === false ? ok('invalidate：可主动置为未就绪（签名过期时用）') : bad('invalidate')

  requestHandlers.length = 0
  // mock：config 时不立刻触发，改为在下一轮把已注册的 error 回调打掉
  global.window.jWeixin.error = (cb) => { pendingErrorCb = cb }
  global.window.jWeixin.config = (o) => {
    lastConfig = o
    setTimeout(() => {
      if (pendingErrorCb) { const c = pendingErrorCb; pendingErrorCb = null; c({ errCode: 'e1', errMsg: 'config:fail invalid signature' }) }
    }, 0)
  }
  let caught = null
  const failing = core2.init({ url: '/wx/jsSdkConfig' })
  await tick()
  requestHandlers.forEach((r) => {
    r.success({ statusCode: 200, data: { appId: 'wx123', timestamp: '1', nonceStr: 'n', signature: 's' } })
  })
  try {
    await failing
  } catch (e) { caught = e }
  caught ? ok('config 失败会 reject（不静默吞异常）') : bad('config 失败未 reject')
  caught && caught.errCode === 'e1' ? ok('失败时透传 errCode') : bad('errCode 透传', caught && caught.errCode)
  core2.isReady() === false ? ok('失败后已清除 ready 标志 → 可重试') : bad('失败后 ready 未清除')

  // 恢复正常：config 后触发 ready
  global.window.jWeixin.error = (cb) => { pendingErrorCb = cb }
  global.window.jWeixin.ready = (cb) => { pendingReadyCb = cb }
  global.window.jWeixin.config = (o) => {
    lastConfig = o
    setTimeout(() => { if (pendingReadyCb) { const c = pendingReadyCb; pendingReadyCb = null; c() } }, 0)
  }
  requestHandlers.length = 0
  const retrying = core2.init({ url: '/wx/jsSdkConfig' })
  await tick()
  requestHandlers.forEach((r) => {
    r.success({ statusCode: 200, data: { appId: 'wx123', timestamp: '2', nonceStr: 'n2', signature: 's2' } })
  })
  const retry = await retrying
  retry.ok === true ? ok('失败后重试可成功签名（旧实现此处会永久失效）') : bad('重试', JSON.stringify(retry))

  /* ---------- 7. invoke ---------- */
  const scan = await core2.invoke('scanQRCode', {}, { url: '/wx/jsSdkConfig' })
  scan && scan.result === 'scan-ok' ? ok('invoke：透传参数并 resolve wx 结果') : bad('invoke resolve', JSON.stringify(scan))

  let unsup = null
  try {
    await core2.invoke('notExistApi', {}, { url: '/wx/jsSdkConfig' })
  } catch (e) { unsup = e }
  unsup && unsup.errCode === 'unsupported' ? ok('invoke：不支持的接口 reject errCode=unsupported') : bad('unsupported', unsup && unsup.errCode)

  /* ---------- 8. 签名失效自动 invalidate ---------- */
  core2.invalidate()
  requestHandlers.length = 0
  const resigning = core2.init({ url: '/wx/jsSdkConfig' })
  await tick()
  requestHandlers.forEach((r) => {
    r.success({ statusCode: 200, data: { appId: 'wx123', timestamp: '3', nonceStr: 'n3', signature: 's3' } })
  })
  await resigning
  core2.isReady() ? ok('重新签名成功，isReady 恢复 true') : bad('重新签名')
  global.window.jWeixin.scanQRCode = (o) => o.fail({ errCode: 'f1', errMsg: 'invalid signature' })
  let sigErr = null
  try {
    await core2.invoke('scanQRCode', {}, { url: '/wx/jsSdkConfig' })
  } catch (e) { sigErr = e }
  sigErr ? ok('接口报 invalid signature 时 reject') : bad('invalid signature 未 reject')
  core2.isReady() === false ? ok('检测到签名失效自动 invalidate → 下次自动重签') : bad('签名失效未 invalidate')

  /* ---------- 9. 静态检查 ---------- */
  const idx = fs.readFileSync(path.join(ROOT, 'utils/wxsdk/index.js'), 'utf8')
  const required = ['scanQRCode', 'getLocation', 'openLocation', 'chooseLocation',
    'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getLocalImgData',
    'setShareData', 'readyForShare', 'checkJsApi', 'navigateToMiniProgram',
    'payment', 'preload', 'refresh', 'available']
  const missing = required.filter((fn) => idx.indexOf('export function ' + fn) === -1)
  missing.length === 0
    ? ok('index.js 导出全部约定接口（' + required.length + ' 个）')
    : bad('index.js 缺接口', missing.join(','))

  const retChoose = idx.indexOf("return invoke('chooseImage'") > -1
  retChoose ? ok('chooseImage 返回 Promise（旧实现 async 不 return 的 bug 已修）') : bad('chooseImage 未返回')
  const retPreview = idx.indexOf("return invoke('previewImage'") > -1
  retPreview ? ok('previewImage 返回 Promise') : bad('previewImage 未返回')
  const retUpload = idx.indexOf("return invoke('uploadImage'") > -1
  retUpload ? ok('uploadImage 返回 Promise') : bad('uploadImage 未返回')

  idx.indexOf('#ifdef H5') > -1 ? ok('index.js 带 #ifdef H5（非 H5 端剔除）') : bad('index.js 缺条件编译')
  fs.readFileSync(path.join(ROOT, 'utils/wxsdk/core.js'), 'utf8').indexOf('#ifdef H5') > -1
    ? ok('core.js 带 #ifdef H5') : bad('core.js 缺条件编译')

  const mainSrc = fs.readFileSync(path.join(ROOT, 'main.js'), 'utf8')
  mainSrc.indexOf('proto.wxsdk = wxsdk') > -1 ? ok('main.js 已注入 this.wxsdk') : bad('main.js 未注入 wxsdk')
  mainSrc.indexOf('installStore(app, app.config.globalProperties)') > -1
    ? ok('main.js store 注入未被破坏') : bad('main.js store 注入')
  const noInitInMain = mainSrc.indexOf('wxsdk.ready()') === -1 && mainSrc.indexOf('wxsdk.preload()') === -1
  noInitInMain ? ok('main.js 未强制初始化（采用「首次调用自动 init」策略）') : bad('main.js 存在强制初始化')

  fs.readFileSync(path.join(ROOT, 'utils/config.js'), 'utf8').indexOf('WX_SDK') > -1
    ? ok('config.js 已定义 WX_SDK 配置块') : bad('config 缺 WX_SDK')
  fs.existsSync(path.join(ROOT, 'static/js/jweixin-1.6.0.js'))
    ? ok('static/js/jweixin-1.6.0.js 已就位（懒加载目标）') : bad('SDK 文件缺失')
} catch (e) {
  bad('测试执行异常', e.message)
  console.log('   ' + (e.stack || '').split('\n').slice(0, 5).join('\n   '))
}

console.log('\n结果：' + pass + ' 通过，' + fail + ' 失败')
if (fail) process.exit(1)
console.log('✅ 微信 JSSDK 封装全部测试通过')
})()
