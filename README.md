# uniapp-template

通用 uniapp 初始化模板，沉淀自多个真实项目，内置一套**跨端通用的 UI 组件**与**工具库**。

> 适配目标：**H5、钉钉小程序（mp-dingtalk）、微信小程序（mp-weixin）**，**不涉及 APP / 其他小程序端**。

---

## 特性

- **跨端请求封装**：统一基于 `uni.request`，告别历史版本硬编码的 `dd.httpRequest`。
- **多端鉴权**：钉钉 `dd.getAuthCode`、微信 `wx.login`、H5 cookie/OAuth 三种登录自动分发，登录失效自动重登。
- **设计令牌（Design Tokens）**：颜色、圆角、间距、层级、安全区集中在 `styles/variables.scss`，组件无需手动 import。
- **表单校验**：`m-form` + `m-form-item` 通过 `provide/inject` 组合，子组件自动回写值，`validate()` 返回 `{ valid, errors, data }`。
- **easycom 自动引入**：`m-*` / `external-*` 组件无需 import，直接使用。

## 目录结构

```
├── main.js                 # 全局注入 util / http / api / config / jump
├── manifest.json           # 仅保留 h5 / mp-weixin / mp-dingtalk
├── pages.json              # easycom 规则 + 示例页
├── uni.scss                # 自动注入 variables.scss / reset.scss
├── styles/
│   ├── variables.scss      # 主题入口（转发到 theme/semantic.scss）
│   └── theme/              # 令牌体系：palette / semantic / theme-dark
├── scripts/
│   ├── sync-theme.mjs           # 从 melon-ui tokens.json 同步令牌
│   ├── verify-theme.cjs         # 校验令牌链
│   ├── verify-components.cjs    # 校验全部组件样式编译
│   ├── verify-date.cjs# 日期工具单元测试（29 项）
│   └── verify-demo.cjs# 校验 demo 覆盖全部组件与 utils
├── utils/
│   ├── config.js           # 多端配置（API_BASE / AUTH_TYPE / 未授权码等）
│   ├── request.js          # 跨端请求封装（request/get/post/upload/token）
│   ├── user.js             # 多端鉴权与重登
│   ├── cache.js            # 带前缀的本地缓存
│   ├── router.js           # 跳转封装（jump/redirect/reLaunch/switchTab/back）
│   ├── debug.js            # 日志 logger / warn / info / error
│   ├── wxlog.js            # 微信端日志（条件编译安全降级）
│   ├── date.js             # 日期工具（基于 day.js，替代旧手写实现）
│   └── index.js            # 聚合导出（全局注入 util/http）
├── server/
│   └── api.js              # 接口地址集中管理
├── components/
│   ├── m-*                 # 通用 UI 组件（按钮/表单/弹层/卡片/列表/选择器等）
│   └── external-lecturer/  # 业务示例组件
└── pages/demo/index.vue    # 组件与请求演示页
```

## 全局 API

`main.js` 已把工具库挂到全局属性（Vue 3：`app.config.globalProperties`；Vue 2：`Vue.prototype`），组件内可直接使用：

| 调用 | 说明 |
| --- | --- |
| `this.util` / `this.http` | 请求、缓存、日期、日志等聚合工具 |
| `this.api` | 接口地址（`server/api.js`） |
| `this.config` | 多端运行时配置（`utils/config.js`） |
| `this.jump` | 路由跳转封装 |

请求示例：

```js
// GET
this.http.get(this.api.demo.list, { id: 1 }).then(res => {}).catch(err => {})
// POST
this.http.post(this.api.demo.detail, { id: 1 })
// 上传（组件内已封装）
this.http.upload('/common/upload', filePath)
```

## 日期工具（day.js）

日期能力统一由 `lib/day.min.js`（day.js）提供，`utils/date.js` 只是它的一层薄封装——**不再维护手写日期逻辑**。

```js
// 1. 兼容层：与旧 date.js 同名 API，行为保持一致，可直接替换
this.util.getFormate(date)                // '2026-10-09 14:05:07'
this.util.getFormate(date, 'y-m-d')       // '2026-10-09'（旧的小写格式串仍可用）
this.util.Date2Str(date, '/')            // '2026/10/09'
this.util.GetDays(date)                  // 31
this.util.DateReduce(d1, d2)              // 毫秒差
this.util.Number2Fix(5)                   // '05'
this.util.GetNumberOfMonth(date, 1)       // 下个月

// 2. 直接用 day.js 完整能力（推荐用于新代码）
this.util.dayjs().subtract(7, 'day').format('YYYY-MM-DD')
this.util.dayjs('2026-10-09').diff(this.util.dayjs('2026-10-01'), 'day')
this.util.dayjs().startOf('month').format('YYYY-MM-DD')
this.util.dayjs().isBefore(this.util.dayjs('2026-12-31'))

// 3. 常用格式预设
this.util.FORMAT.DATE      // 'YYYY-MM-DD'
this.util.FORMAT.DATETIME  // 'YYYY-MM-DD HH:mm:ss'
```

**关于格式串**：day.js 用 `YYYY-MM-DD`，旧的 `date.js` 用 `y-m-d`。`getFormate()` 已做归一化，两种写法都能传；其他方法（直接调 `dayjs().format()`）请遵循 day.js 规范。注意 `mm` 在 day.js 中是「分钟」，「月」必须写 `MM`。

`lib/day.min.js` 是 UMD 产物，小程序端无 CommonJS，`utils/date.js` 内已做 interop 兼容（H5 / 微信 / 钉钉三端可用）。需要更多能力（如 `relativeTime` 相对时间）时，可自行引入 day.js 官方插件并 `dayjs.extend()`。

## 多端鉴权

`utils/config.js` 通过编译期变量自动识别平台并设置 `AUTH_TYPE`：

- 钉钉小程序：`dd.getAuthCode` → 后端换 token（`#ifdef MP-DINGTALK` 保护）
- 微信小程序：`wx.login` → 后端换 token
- H5：后端以 cookie / 重定向 OAuth 维持会话

请求返回 `UNAUTH_CODES`（401/403/408）时，框架广播 `http:unauthorized`，`user.js` 统一触发重登。

## 表单校验

```vue
<m-form ref="form">
  <m-form-item name="name" label="姓名" required>
    <m-input v-model="model.name" />
  </m-form-item>
</m-form>

<!-- 提交时 -->
const { valid, errors, data } = this.$refs.form.validate()
```

支持的表单项：`m-input` / `m-picker` / `m-datetime-picker` / `m-textarea` / `m-radio-group` / `m-checkbox-group`，均会自动把值回写到所属 `m-form-item`。

## 主题体系（与 PC 端 melon-ui 统一）

模板的令牌与 PC 端 `melon-ui` 的主题系统同源，**`melon-ui/src/theme/tokens.json` 是唯一事实源**。

```
styles/theme/
├── palette.scss      L1 原始层：色板 + 尺寸，由 tokens.json 自动生成（勿手改）
├── semantic.scss     L2 语义层：把 L1 组合成用途令牌 + 模板兼容变量名
└── theme-dark.scss   可选深色主题覆盖（默认关闭）
styles/variables.scss 主题入口，被 uni.scss 注入所有组件
scripts/sync-theme.mjs    同步脚本（tokens.json → palette.scss）
```

### 换肤流程

改完 `melon-ui` 的 `tokens.json` 后，在本目录执行：

```bash
node scripts/sync-theme.mjs                        # 默认 melon-ui 路径
node scripts/sync-theme.mjs --src D:/path/to/melon-ui   # 指定路径
```

生成的 `palette.scss` 已提交进仓库，**模板不依赖 melon-ui 也能独立编译**。

### 为什么不用 PC 端的 CSS 变量方案

melon-ui 的语义层是 `:root` + `var(--melon-*)`，靠 `theme-mode` 属性运行时切主题。但小程序**没有 `:root` 选择器、也不能操作 `document`**，因此移动端改为**编译期 SCSS 变量**落值，三端（H5 / 微信 / 钉钉）通用。代价是深色主题需重新编译而非运行时切换——深色值已预置在 `theme-dark.scss`，取消 `semantic.scss` 末尾的注释即可启用。

### 单位换算

| 来源 | 原始单位 | 移动端 | 系数 |
|---|---|---|---|
| 颜色 | hex | hex | 原样复用（与端无关） |
| 尺寸 / 字号 / 圆角 / 间距 | `px` | `rpx` | ×2（750rpx = 375px 设计稿） |

PC 端 `14px` 字号 → 移动端 `28rpx`；`4px` 圆角 → `8rpx`。

### 组件里怎么用

组件样式直接引用变量，无需 import（由 `uni.scss` 注入）：

```scss
.my-card {
  color: $black;          // 兼容名（= $text-color-primary）
  background: $white;     // 兼容名
  border-radius: $radius-md;
  padding: $spacing-md;
}
// 也可以用语义名，与 PC 端一一对应
.my-card {
  color: $text-color-primary;
  background: $bg-color-container;
  border-color: $divider-color;
}
```

组件中硬编码的颜色建议逐步替换为语义令牌（`$text-color-secondary`、`$border-color-base` 等），这样换肤时不会漏改。

### 校验

改动令牌后可跑一次编译校验，确保所有组件样式仍可编译：

```bash
node scripts/verify-theme.cjs       # 校验令牌链解析结果
node scripts/verify-components.cjs  # 校验 31 个组件样式全部编译通过
```

## 校验脚本

项目内置 4 个校验脚本，改动后建议跑一遍：

```bash
node scripts/verify-theme.cjs       # 令牌链解析结果（颜色/rpx 换算断言）
node scripts/verify-components.cjs  # 31 个组件样式全部编译通过
node scripts/verify-date.cjs        # 日期工具单元测试（29 项）
node scripts/verify-demo.cjs        # demo 是否覆盖全部组件与 utils 方法
```

`verify-demo.cjs` 会自动核对：`components/` 下每个组件是否都在 demo 中被使用、`utils/index.js` 导出的每个方法是否有演示、以及 46 项关键 API（各 v-model 变体、slot 语法、表单校验等）。新增组件或 utils 方法后跑一次，能立刻发现 demo 是否遗漏。

> 运行这些脚本需要 sass：`npm i sass` 或设置 `NODE_PATH` 指向已安装 sass 的目录。

## Demo 页

`pages/demo/index.vue` 是完整的功能演示页（6 个分组：基础 / 表单 / 弹层 / 展示 / 业务 / 工具），覆盖全部 31 个组件与 utils 的 38 个导出方法。其中：

- **表单区**演示 `m-form` 的 `validate()` / `reset()`，含`pattern` 规则校验
- **工具区**逐项展示 day.js 日期、cache 增删改查、token、config、request（含回调式）、logger、router、api
- 依赖后端的请求在模板中会失败，属预期行为（页面会给出提示）

## Vue 3 适配

本项目已适配 **Vue 3**（uni-app 的 Vue3 编译模式）。组件仍采用 Options API 写法（Vue 3 完全兼容），无需改写为 `<script setup>`。

- **全局注入**：`main.js` 在 Vue 3 下通过 `app.config.globalProperties` 注入，在 Vue 2 下通过 `Vue.prototype` 注入，组件内统一用 `this.util` 等访问。
- **v-model 约定**：
  - 输入/字段类组件（`m-input` / `m-picker` / `m-datetime-picker` / `m-textarea` / `m-popup` / `m-upload`）使用标准 `v-model`（底层 `modelValue` + `update:modelValue`），可直接 `v-model="xxx"`。
  - 选择/切换类组件（`m-tabs` / `m-radio-group` / `m-checkbox-group` / `m-list` / `m-search` / `m-cascade-picker` / `m-form-cascade` 等）使用 `:value` + `@change`（或命名 v-model `v-model:value`），事件为 `update:value`。
- **已规避的 Vue 2 废弃 API**：`v-bind.sync` → 改用 `v-model` / `v-model:prop`；`this.$set` → 直接赋值；`beforeDestroy` → `beforeUnmount`；`model` 组件选项已移除；`$slots.default.length` → `Boolean($slots.default)`。

## 启动

用 HBuilderX 或 CLI 以 **Vue 3 模式**打开本目录（HBuilderX：右键项目根目录 → “将项目转为 Vue3”，或在创建时选择 Vue3），再选择运行端（浏览器 / 微信开发者工具 / 钉钉开发者工具）预览 `pages/demo/index` 演示页。
