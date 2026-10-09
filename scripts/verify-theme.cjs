// 令牌链路编译验证：styles/variables.scss → 输出关键变量，确认无循环引用/未定义
const sass = require('sass')
const path = require('path')
const fs = require('fs')

const ROOT = path.resolve(__dirname, '..')
const entry = path.join(ROOT, 'styles', 'variables.scss')

// 模拟 uni.scss 的注入方式（以 @import 方式引入 variables.scss）
const probe = `
@import "${entry.replace(/\\/g, '/')}";
.probe {
  color: $blue;
  background: $pageBg;
  border-color: $placeholder;
  font-size: $font-size-medium;
  border-radius: $radius-md;
  color: $text-color-primary;
  color: $color-brand;
  z-index: $z-popup;
  color: $black;
  color: $black5;
  color: $black9;
  color: $red;
  color: $green;
  color: $orange;
  color: $white;
  padding-bottom: $safe-bottom;
}
`

try {
  const res = sass.compileString(probe, {
    loadPaths: [ROOT],
    importers: [{
      // 支持 @import '@/xxx' 与相对路径
      findFileUrl(url) {
        if (!url.startsWith('@/')) return null
        return new URL('file:///' + path.join(ROOT, url.slice(2)).replace(/\\/g, '/'))
      },
    }],
  })
  const css = res.css
  // 提取 probe 块内的声明做人工核对
  const block = css.slice(css.indexOf('.probe'))
  console.log('✅ 编译成功，关键变量解析结果：')
  console.log(block.split('\n').filter(l => l.trim()).join('\n'))

  // 断言若干关键值
  const checks = [
    ['color: #5192FF', '品牌色来自 melon-ui blue-500'],
    ['background: #F2F5F9', '页面底色来自 tokens.json background'],
    ['border-radius: 8rpx', '圆角已换算为 rpx'],
    ['font-size: 28rpx', '字号已换算为 rpx'],
    ['color: #E83838', '错误色来自 melon-ui red-500'],
    ['color: #16C797', '成功色来自 melon-ui green-500'],
  ]
  let bad = 0
  for (const [needle, desc] of checks) {
    const ok = block.includes(needle)
    if (!ok) { bad++; console.log('  ❌ ' + desc + '  期望包含: ' + needle) }
    else console.log('  ✓ ' + desc)
  }
  if (bad) { console.log(`\n❌ ${bad} 项不匹配`); process.exit(1) }
  console.log('\n✅ 全部校验通过')
} catch (e) {
  console.error('❌ 编译失败：')
  console.error(e.message)
  process.exit(1)
}