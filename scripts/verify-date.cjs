/**
 * 日期工具单元测试（直接针对 utils/date.js 源码运行，非复制逻辑）
 * 运行：node scripts/verify-date.cjs
 */
const fs = require('fs')
const path = require('path')
const ROOT = path.resolve(__dirname, '..')

const dayjs = require(path.join(ROOT, 'lib/day.min.js'))

// 从 date.js 源码里提取 normalizeFormat，保证测的是真实实现
const src = fs.readFileSync(path.join(ROOT, 'utils/date.js'), 'utf8')
const fnSrc = src.match(/function normalizeFormat\(fmt\)\s*\{[\s\S]*?\n\}/)
if (!fnSrc) {
  console.error('❌ 未能从 utils/date.js 提取到 normalizeFormat')
  process.exit(1)
}
const FORMAT = { DATETIME: 'YYYY-MM-DD HH:mm:ss' }
const normalizeFormat = new Function('FORMAT', fnSrc[0] + '; return normalizeFormat')(FORMAT)

let pass = 0
const fail = []

function eq(name, actual, expected) {
  if (actual === expected) { pass++; console.log(`  ✓ ${name.padEnd(30)} ${actual}`) }
  else { fail.push(name); console.log(`  ✗ ${name.padEnd(30)} 实际=${actual} 期望=${expected}`) }
}

console.log('\n【1】格式串归一化（新旧写法兼容）')
const D = new Date(2026, 9, 9, 14, 5, 7) // 2026-10-09 14:05:07（时/分/秒皆个位）
const d = dayjs(D)
const fmtCases = [
  [undefined, '2026-10-09 14:05:07'],
  ['y-m-d h:i:s', '2026-10-09 14:05:07'],
  ['YYYY-MM-DD HH:mm:ss', '2026-10-09 14:05:07'],
  ['y-m-d', '2026-10-09'],
  ['YYYY-MM-DD', '2026-10-09'],
  ['y/m/d', '2026/10/09'],
  ['y-m-d h:i', '2026-10-09 14:05'],
  ['h:i:s', '14:05:07'],
  ['HH:mm:ss', '14:05:07'],
  ['y年m月d日', '2026年10月09日'],
  ['YYYY-MM-DDTHH:mm:ss', '2026-10-09T14:05:07'],
]
for (const [f, exp] of fmtCases) {
  eq(`getFormate(${String(f)})`, d.format(normalizeFormat(f)), exp)
}

console.log('\n【2】与旧 date.js 的行为等价性')
// 旧实现（原样保留用于对比）
const old = {
  Number2Fix(n) { const rs = n < 10 ? '0' + n : n; return rs.toString() },
  Str2Date(s) { return s ? new Date(String(s).replace(/-/g, '/')) : new Date() },
  getFormate(ds, dt) {
    let dd = ''
    if (typeof ds === 'object') dd = ds; else dd = old.Str2Date(ds)
    dt = dt ? dt : 'y-m-d h:i:s'
    dt = dt.replace(/y|Y/g, dd.getFullYear().toString())
    dt = dt.replace(/m|M/g, old.Number2Fix(dd.getMonth() + 1))
    dt = dt.replace(/d|D/g, old.Number2Fix(dd.getDate()))
    dt = dt.replace(/h|H/g, old.Number2Fix(dd.getHours()))
    dt = dt.replace(/i|I/g, old.Number2Fix(dd.getMinutes()))
    dt = dt.replace(/s|S/g, old.Number2Fix(dd.getSeconds()))
    return dt
  },
  Date2Str(date, delim) {
    if (!date) date = new Date()
    delim = delim ? delim : '-'
    let y = date.getFullYear(); let mo = date.getMonth() + 1; let dd = date.getDate()
    mo = mo < 10 ? '0' + mo : mo; dd = dd < 10 ? '0' + dd : dd
    return [y, mo, dd].join(delim)
  },
  GetDays(date) {
    const cm = date.getMonth(); const cd = date.getDate()
    date.setMonth(cm + 1); date.setDate(0)
    const a = date.getDate()
    date.setMonth(cm); date.setDate(cd)
    return a
  },
}
eq('getFormate(默认)', d.format(normalizeFormat(undefined)), old.getFormate(D))
eq('getFormate(y-m-d h:i:s)', d.format(normalizeFormat('y-m-d h:i:s')), old.getFormate(D, 'y-m-d h:i:s'))
eq('Date2Str', d.format('YYYY-MM-DD'), old.Date2Str(D))
eq('Date2Str(斜杠)', d.format('YYYY/MM/DD'), old.Date2Str(D, '/'))
eq('GetDays', d.daysInMonth(), old.GetDays(D))
eq('Number2Fix(5)', '05', old.Number2Fix(5))
eq('Number2Fix(15)', '15', old.Number2Fix(15))

console.log('\n【3】day.js 高级能力（相对旧实现的增量）')
eq('add(1,month)', d.add(1, 'month').format('YYYY-MM-DD'), '2026-11-09')
eq('subtract(7,day)', d.subtract(7, 'day').format('YYYY-MM-DD'), '2026-10-02')
// 注意：diff 按完整毫秒差换算天数，会向下取整，故用「纯日期」构造以得到整日差
eq('diff 相差天数', dayjs('2026-10-10').diff(dayjs('2026-10-09'), 'day'), 1)
eq('diff 相差小时', dayjs('2026-10-09T16:00:00').diff(dayjs('2026-10-09T14:00:00'), 'hour'), 2)
eq('startOf(month)', d.startOf('month').format('YYYY-MM-DD'), '2026-10-01')
eq('isBefore', d.isBefore(dayjs('2026-10-10')), true)
eq('daysInMonth 闰年2月', dayjs('2024-02-01').daysInMonth(), 29)
eq('unix 时间戳', d.unix(), Math.floor(D.getTime() / 1000))

console.log('\n【4】边界与容错')
eq('空值走默认格式', dayjs(undefined).format(normalizeFormat(undefined)).length, 19)
eq('非法日期不崩溃', typeof dayjs('not-a-date').format('YYYY-MM-DD'), 'string')
eq('dayjs 可链式', d.format('YYYY') , '2026')

console.log(`\n结果：${pass} 通过，${fail.length} 失败`)
if (fail.length) {
  console.log('失败项：' + fail.join(', '))
  process.exit(1)
}
console.log('✅ 日期工具全部测试通过')