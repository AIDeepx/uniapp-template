/**
 * 主题令牌同步脚本（melon-ui → uniapp-template）
 *
 * 单一事实源：melon-ui 的 src/theme/tokens.json
 * 本脚本读取它，生成移动端可用的 rpx 令牌：styles/theme/palette.scss
 *
 * 设计要点：
 *   1. 颜色是 hex，与运行端无关，原样复用（保证 PC / 移动端视觉一致）。
 *   2. 尺寸 PC 用 px，移动端用 rpx，按 1px = 2rpx 换算（750rpx = 375px 设计稿）。
 *   3. 生成结果提交进仓库，模板无需依赖 melon-ui 也能独立编译。
 *
 * 用法：
 *   node scripts/sync-theme.mjs                       # 使用默认路径
 *   node scripts/sync-theme.mjs --src <melon-ui 路径>  # 指定 melon-ui 目录
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_FILE = path.join(ROOT, 'styles', 'theme', 'palette.scss')

/** 默认的 melon-ui 位置，可用 --src 覆盖 */
const DEFAULT_SRC = 'C:/Users/Deepx/fastcode/melon-ui'

/** px → rpx 换算系数：750rpx 设计稿 = 375px，即 1px = 2rpx */
const PX_TO_RPX = 2

/* ---------------------------------- 参数 ---------------------------------- */
function parseArgs() {
  const args = process.argv.slice(2)
  let src = DEFAULT_SRC
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--src' && args[i + 1]) src = args[++i]
  }
  return { src }
}

/* --------------------------------- token 读取 -------------------------------- */
function readTokens(srcDir) {
  const file = path.join(srcDir, 'src', 'theme', 'tokens.json')
  if (!fs.existsSync(file)) {
    console.error(`[theme] 找不到 tokens.json：${file}`)
    console.error('[theme] 请用 --src 指定 melon-ui 目录，例如：')
    console.error('[theme]   node scripts/sync-theme.mjs --src D:/path/to/melon-ui')
    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

/** tokens.json 里可能是 {value} 也可能是裸值 */
function raw(v) {
  if (v && typeof v === 'object' && 'value' in v) return v.value
  return v
}

/** 把 "12px" / 12 / "12" 统一成数字（单位 px） */
function num(v) {
  const s = String(raw(v))
  const m = s.match(/^(-?[\d.]+)/)
  return m ? Number(m[1]) : null
}

function px(v) {
  return num(v) + 'px'
}

function rpx(v) {
  const n = num(v)
  if (n === null) return null
  return n * PX_TO_RPX + 'rpx'
}

/** 颜色值保持原样（统一大写十六进制，去掉多余引号） */
function color(v) {
  const s = String(raw(v)).trim()
  const m = s.match(/^#([0-9a-fA-F]{3,8})$/)
  return m ? ('#' + m[1].toUpperCase()) : s
}

/* --------------------------------- 生成 SCSS -------------------------------- */
const L = []
const line = (s = '') => L.push(s)

function buildPalette(tokens) {
  const g = tokens.global || {}
  const colorGroup = g.color || {}

  line('// =========================================================================')
  line('// 原始色板 / 尺寸令牌 (Palette / Primitives)')
  line('// AUTO-GENERATED from melon-ui src/theme/tokens.json by scripts/sync-theme.mjs')
  line('// 请勿手动编辑；修改设计令牌请改 melon-ui 的 tokens.json 后重新执行同步脚本。')
  line('//')
  line('// 颜色：与 melon-ui 保持完全一致（hex 与运行端无关）')
  line(`// 尺寸：melon-ui 的 px × ${PX_TO_RPX} → rpx（750rpx = 375px 设计稿）`)
  line('// =========================================================================')
  line()

  /* ---------- 品牌 / 功能色阶 ---------- */
  const GROUPS = [
    ['blue', 'blue'],
    ['red', 'red'],
    ['green', 'green'],
    ['gray', 'gray'],
    ['orange', 'orange'],
    ['purple', 'purple'],
  ]
  line('/* ---------- 原始色阶 ---------- */')
  for (const [group, prefix] of GROUPS) {
    const set = colorGroup[group]
    if (!set) continue
    for (const step of Object.keys(set).sort((a, b) => num(a) - num(b))) {
      if (step === 'value' || step === 'type') continue
      line(`$${prefix}-${step}: ${color(set[step])};`)
    }
  }
  if (colorGroup.white) line(`$white: ${color(colorGroup.white)};`)
  line()

  /* ---------- 背景 ---------- */
  line('/* ---------- 背景 ---------- */')
  if (colorGroup.background) line(`$bg-base: ${color(colorGroup.background)};`)
  line()

  /* ---------- 字号 ---------- */
  line('/* ---------- 字号（rpx） ---------- */')
  for (const [k, v] of Object.entries(g.fontsize || {})) {
    const r = rpx(v)
    if (r) line(`$font-size-${k.replace(/\./g, '-')}: ${r};`)
  }
  line()

  /* ---------- 字重 ---------- */
  line('/* ---------- 字重 ---------- */')
  for (const [k, v] of Object.entries(g['font-weight'] || {})) {
    line(`$font-weight-${k.replace(/\./g, '-')}: ${raw(v)};`)
  }
  line()

  /* ---------- 行高 ---------- */
  line('/* ---------- 行高 ---------- */')
  for (const [k, v] of Object.entries(g.lineheight || {})) {
    line(`$line-height-${k.replace(/\./g, '-')}: ${raw(v)};`)
  }
  line()

  /* ---------- 间距 ---------- */
  line('/* ---------- 间距（rpx） ---------- */')
  const space = g.space || {}
  for (const kind of ['margin', 'padding']) {
    for (const [k, v] of Object.entries(space[kind] || {})) {
      const r = rpx(v)
      if (r) line(`$space-${kind}-${k.replace(/\./g, '-')}: ${r};`)
    }
  }
  line()

  /* ---------- 圆角 ---------- */
  line('/* ---------- 圆角（rpx） ---------- */')
  for (const [k, v] of Object.entries(g['border-radius'] || {})) {
    const val = String(raw(v))
    // 百分比（50%）保持原样，px 换算成 rpx
    const r = val.includes('%') ? val : rpx(v)
    if (r) line(`$border-radius-${k.replace(/\./g, '-')}: ${r};`)
  }
  line()

  /* ---------- 控件尺寸（rpx） ---------- */
  line('/* ---------- 控件尺寸（rpx） ---------- */')
  // 移动端不适用的 PC 专属尺寸（表格最小宽度等）
  const SKIP_SIZE = new Set(['table-min-width'])
  const walkSize = (obj, prefix) => {
    for (const [k, v] of Object.entries(obj || {})) {
      if (k === 'value' || k === 'type') continue
      const name = [prefix, k.replace(/\./g, '-')].filter(Boolean).join('-')
      if (SKIP_SIZE.has(name)) continue
      if (v && typeof v === 'object' && !('value' in v)) walkSize(v, name)
      else {
        const r = rpx(v)
        if (r) line(`$size-${name}: ${r};`)
      }
    }
  }
  walkSize(g.size, '')
  line()

  /* ---------- 边框 / 透明度 ---------- */
  line('/* ---------- 边框 / 透明度 ---------- */')
  for (const [k, v] of Object.entries(g['border-width'] || {})) {
    const r = rpx(v)
    if (r) line(`$border-width-${k.replace(/\./g, '-')}: ${r};`)
  }
  for (const [k, v] of Object.entries(g['border-style'] || {})) {
    line(`$border-style-${k.replace(/\./g, '-')}: ${raw(v)};`)
  }
  for (const [k, v] of Object.entries(g.opacity || {})) {
    line(`$opacity-${k.replace(/\./g, '-')}: ${raw(v)};`)
  }
  line()

  /* ---------- 字体族 ---------- */
  line('/* ---------- 字体族 ---------- */')
  for (const [k, v] of Object.entries(g['font-family'] || {})) {
    line(`$font-family-${k.replace(/\./g, '-')}: ${raw(v)};`)
  }

  return L.join('\n')
}

/* ---------------------------------- 主流程 ---------------------------------- */
const { src } = parseArgs()
const tokens = readTokens(src)

// 校验：至少要有 global set
if (!tokens.global) {
  console.error('[theme] tokens.json 缺少 global set')
  process.exit(1)
}

const scss = buildPalette(tokens)
fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
fs.writeFileSync(OUT_FILE, scss, 'utf8')

console.log(`[theme] 已生成 ${path.relative(ROOT, OUT_FILE)}  (来源: ${src})`)
console.log(`[theme] px→rpx 系数: ${PX_TO_RPX}`)