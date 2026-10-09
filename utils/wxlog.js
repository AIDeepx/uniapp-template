/**
 * 微信实时日志（仅在微信小程序端有效，其余端安全降级为空操作）
 */
let manager = null
// #ifdef MP-WEIXIN
try {
  manager = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
} catch (e) {
  manager = null
}
// #endif

function safe(method, args) {
  if (!manager || !manager[method]) return
  manager[method].apply(manager, args)
}

export default {
  info(...args) { safe('info', args) },
  warn(...args) { safe('warn', args) },
  error(...args) { safe('error', args) },
  setFilterMsg(msg) {
    if (!manager || !manager.setFilterMsg || typeof msg !== 'string') return
    manager.setFilterMsg(msg)
  },
  addFilterMsg(msg) {
    if (!manager || !manager.addFilterMsg || typeof msg !== 'string') return
    manager.addFilterMsg(msg)
  },
}
