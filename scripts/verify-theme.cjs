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
  border-top: 1px solid $divider-color;
  background-color: $bg-color-input;
  border: 1px solid $border-color-base;
  color: $text-color-placeholder;
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
    ['background: #F5F7FB', '页面底色对齐 enterprise-design-system skill'],
    ['border-radius: 8rpx', '圆角已换算为 rpx'],
    ['font-size: 28rpx', '字号已换算为 rpx'],
    ['color: #F5222D', '错误色对齐 enterprise-design-system skill'],
    ['color: #16C797', '成功色来自 melon-ui green-500（已裁决保留）'],
    ['border-top: 1px solid #EBEEF5', '分隔线对齐 skill #EBEEF5'],
    ['background-color: #F7F8FA', '输入 / 搜索底对齐 skill #F7F8FA'],
    ['border: 1px solid #D9D9D9', '描边灰独立令牌 #D9D9D9（与占位灰拆分）'],
    ['color: #BFBFBF', '占位灰仍为 #BFBFBF（未被描边灰覆盖）'],
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