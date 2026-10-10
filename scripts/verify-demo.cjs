/**
 * demo 覆盖度校验
 * 1) components/ 下每个组件是否都在 demo 中被使用
 * 2) utils/index.js 导出的每个方法是否在 demo 中有演示
 * 3) utils/ 各模块的关键 API 是否被覆盖
 */
const fs = require('fs')
const path = require('path')
const ROOT = path.resolve(__dirname, '..')

const demo = fs.readFileSync(path.join(ROOT, 'pages/demo/index.vue'), 'utf8')

/* ---------- 1. 组件覆盖 ---------- */
const compDir = path.join(ROOT, 'components')
const comps = fs.readdirSync(compDir).filter((d) =>
  fs.statSync(path.join(compDir, d)).isDirectory()
)
// demo 模板里用到的组件标签
const used = new Set([...demo.matchAll(/<(m-[a-z0-9-]+|external-[a-z0-9-]+)[\s>]/g)].map((m) => m[1]))

console.log(`\n【1】组件覆盖（共 ${comps.length} 个）`)
const missComp = []
for (const c of comps) {
  const ok = used.has(c)
  if (!ok) missComp.push(c)
  console.log(`  ${ok ? '✓' : '✗'} ${c}`)
}

/* ---------- 2. utils/index.js 导出覆盖 ---------- */
const idx = fs.readFileSync(path.join(ROOT, 'utils/index.js'), 'utf8')
// 收集 module.exports 里的标识符
const expBlock = idx.slice(idx.indexOf('module.exports'))
const exported = new Set()
for (const m of expBlock.matchAll(/^\s*([A-Za-z_$][\w$]*)\s*[,:}]?\s*$/gm)) exported.add(m[1])
for (const m of expBlock.matchAll(/([A-Za-z_$][\w$]*)\s*,/g)) exported.add(m[1])
// spread 的 router
if (/\.\.\.router/.test(expBlock)) {
  const router = fs.readFileSync(path.join(ROOT, 'utils/router.js'), 'utf8')
  for (const m of router.matchAll(/export (?:function|const) (\w+)/g)) exported.add(m[1])
}

console.log(`\n【2】utils 导出方法覆盖（${exported.size} 个）`)
// 演示中通过 this.xxx 调用的方法
const called = new Set([...demo.matchAll(/\bthis\.(\w+)\s*\(/g)].map((m) => m[1]))
// 模板中直接在插值里用的（如 {{ getFormate(...) }}、{{ dayjs(...) }}、{{ config.X }}）
const tpl = new Set([...demo.matchAll(/\{\{\s*([A-Za-z_$][\w$]*)\s*\(/g)].map((m) => m[1]))
const demoAll = new Set([...called, ...tpl])

// 非函数的导出（对象/常量），只需在模板中被引用
const NON_FN = new Set(['default'])
const missUtil = []
for (const name of [...exported].sort()) {
  if (NON_FN.has(name)) continue
  const ok = called.has(name) || tpl.has(name) || demo.includes(name)
  if (!ok) missUtil.push(name)
  console.log(`  ${ok ? '✓' : '✗'} this.${name}`)
}

/* ---------- 3. 关键 API 覆盖 ---------- */
console.log(`\n【3】关键 API 覆盖`)
const mustHave = [
  ['date: getFormate', /\bgetFormate\s*\(/],
  ['date: Date2Str', /\bDate2Str\s*\(/],
  ['date: GetDays', /\bGetDays\s*\(/],
  ['date: DateReduce', /\bDateReduce\s*\(/],
  ['date: Number2Fix', /\bNumber2Fix\s*\(/],
  ['date: GetNumberOfMonth', /\bGetNumberOfMonth\s*\(/],
  ['date: Str2Date', /\bStr2Date\s*\(/],
  ['date: dayjs 直传', /\bdayjs\s*\(/],
  ['date: FORMAT', /\bFORMAT\./],
  ['cache: set', /cache\.set\s*\(/],
  ['cache: get', /cache\.get\s*\(/],
  ['cache: del', /cache\.del\s*\(/],
  ['cache: clearAll', /cache\.clearAll\s*\(/],
  ['token: setToken', /setToken\s*\(/],
  ['token: getToken', /getToken\s*\(/],
  ['token: clearToken', /clearToken\s*\(/],
  ['token: getHost', /getHost\s*\(/],
  ['user: getUser', /getUser\s*\(/],
  ['request: get', /this\.(util\.)?get\s*\(/],
  ['request: post', /this\.(util\.)?post\s*\(/],
  ['request: GET 回调', /this\.GET\s*\(/],
  ['log: logger', /logger\./],
  ['log: warn', /\bwarn\s*\(\s*['"]/],
  ['router: getCurrentPath', /getCurrentPath\s*\(/],
  ['router: setCurrentPath', /setCurrentPath\s*\(/],
  ['router: jump', /this\.jump\s*\(/],
  ['router: back', /this\.(util\.)?back\s*\(/],
  ['user: setUser', /this\.(util\.)?setUser\s*\(/],
  ['user: clearUser', /this\.(util\.)?clearUser\s*\(/],
  ['user: getCachedUser', /this\.(util\.)?getCachedUser\s*\(/],
  ['user: relogin', /this\.(util\.)?relogin\s*\(/],
  ['api: this.api', /this\.api\./],
  ['config: config 引用', /\bconfig\.(PLATFORM|AUTH_TYPE|API_BASE|CACHE_PREFIX)\b/],
  ['v-model: m-input', /<m-input[^>]*v-model/],
  ['v-model: m-picker', /<m-picker[^>]*v-model/],
  ['v-model: m-textarea', /<m-textarea[^>]*v-model/],
  ['v-model: m-datetime-picker', /<m-datetime-picker[^>]*v-model/],
  ['v-model: m-upload', /<m-upload[^>]*v-model/],
  ['v-model: m-popup', /<m-popup[^>]*v-model/],
  ['named v-model: external-lecturer', /external-lecturer[^>]*v-model:value/],
  ['form: validate()', /refs\.form\.validate\s*\(/],
  ['form: reset()', /refs\.form\.reset\s*\(/],
  ['radio 单项', /<m-radio\b/],
  ['checkbox 单项', /<m-checkbox\b/],
  ['page-list 渲染', /<m-page-list\b/],
  ['slot: v-slot:content', /v-slot:content/],
  ['slot: v-slot:head', /v-slot:head/],
  ['slot: scoped default', /#default="\{/],
]
const missMust = []
for (const [label, re] of mustHave) {
  const ok = re.test(demo)
  if (!ok) missMust.push(label)
  console.log(`  ${ok ? '✓' : '✗'} ${label}`)
}

/* ---------- 汇总 ---------- */
console.log('\n' + '='.repeat(56))
const totalMiss = missComp.length + missUtil.length + missMust.length
if (totalMiss === 0) {
  console.log('✅ demo 已完整覆盖全部组件与工具方法')
} else {
  console.log(`❌ 遗漏 ${totalMiss} 项：`)
  if (missComp.length) console.log('组件: ' + missComp.join(', '))
  if (missUtil.length) console.log('utils: ' + missUtil.join(', '))
  if (missMust.length) console.log('API : ' + missMust.join(', '))
  process.exit(1)
}