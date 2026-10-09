// 全量组件编译验证：把 uni.scss 的令牌注入每个组件的 <style>，确认无未定义变量/语法错误
const sass = require('sass')
const path = require('path')
const fs = require('fs')

const ROOT = path.resolve(__dirname, '..')
const COMPONENTS = path.join(ROOT, 'components')

const importer = {
  findFileUrl(url) {
    if (url.startsWith('@/')) {
      return new URL('file:///' + path.join(ROOT, url.slice(2)).replace(/\\/g, '/'))
    }
    return null
  },
}

// 组件内用到的 mixin 来自 static/css/reset.scss（uni.scss 也会注入）
const mixins = fs.readFileSync(path.join(ROOT, 'static/css/reset.scss'), 'utf8')

// 关键：把 variables.scss 的内容"拍平"后再内联——它内部的相对 @import 在
// compileString 中没有基准目录，需先自行递归展开，避免 Can't find stylesheet。
function inlineScss(file, seen = new Set()) {
  const abs = path.resolve(file)
  if (seen.has(abs)) return ''
  seen.add(abs)
  let out = fs.readFileSync(abs, 'utf8')
  // 递归展开 @import './xxx' / @import "xxx"
  // 注意：必须用 ^\s* 锚定行首，否则会误匹配注释里的 @import
  //（如 semantic.scss 中默认注释掉的 `// @import './theme-dark.scss';`）
  out = out.replace(/^[ \t]*@import\s+(['"])([^'"]+)\1[ \t]*;/gm, (m, q, target) => {
    const next = path.resolve(path.dirname(abs), target)
    if (fs.existsSync(next)) return inlineScss(next, seen)
    if (target.startsWith('@/')) {
      const alias = path.join(ROOT, target.slice(2))
      if (fs.existsSync(alias)) return inlineScss(alias, seen)
    }
    return m // 保留无法解析的 import（如 url() 字体）
  })
  return out
}

const variables = inlineScss(path.join(ROOT, 'styles/variables.scss'))

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = fs.statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (name.endsWith('.vue')) out.push(full)
  }
  return out
}

const files = walk(COMPONENTS)
let pass = 0
const failures = []

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8')
  // 提取所有 <style lang="scss"> 块
  const re = /<style[^>]*lang=["']scss["'][^>]*>([\s\S]*?)<\/style>/g
  let m, idx = 0
  while ((m = re.exec(src))) {
    idx++
    const content = m[1]
    // 拼接：mixins + variables（模拟 uni.scss 注入），并把非 scss 的 @import 去掉
    const prelude = `
${mixins}
${variables}
`
    try {
      sass.compileString(prelude + content, {
        loadPaths: [ROOT, path.dirname(file)],
        importers: [importer],
        silenceDeprecations: ['import'],
        logger: { warn() {}, debug() {} },
      })
      pass++
    } catch (e) {
      failures.push({
        file: path.relative(ROOT, file) + ` (style#${idx})`,
        msg: e.message.split('\n')[0],
      })
    }
  }
}

console.log(`\n组件样式块编译：${pass} 个通过，${failures.length} 个失败`)
if (failures.length) {
  console.log('\n失败详情：')
  for (const f of failures) console.log(`  ✗ ${f.file}\n     ${f.msg}`)
  process.exit(1)
}
console.log('✅ 全部组件样式在新令牌下编译通过')