/**
 * 日志工具
 * 提供分级日志；warn 保留原导出名以兼容旧代码。
 */
const LEVEL = { debug: 0, info: 1, warn: 2, error: 3 }

function emit(level, args) {
  const fn = console[level] ? console[level].bind(console) : console.log.bind(console)
  fn(`[${level}]`, ...args)
}

export const logger = {
  debug: (...a) => emit('debug', a),
  info: (...a) => emit('info', a),
  warn: (...a) => emit('warn', a),
  error: (...a) => emit('error', a),
}

export const warn = (...a) => emit('warn', a)
export const debug = (...a) => emit('debug', a)
export const info = (...a) => emit('info', a)
export const error = (...a) => emit('error', a)
