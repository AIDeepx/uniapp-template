<template>
	<m-page>
		<view class="demo">
			<!-- ============ 顶部说明 ============ -->
			<view class="hero">
				<view class="hero__deco hero__deco--1"></view>
				<view class="hero__deco hero__deco--2"></view>
				<view class="hero__badge">UNIAPP TEMPLATE</view>
				<view class="hero__title">跨端初始化模板</view>
				<view class="hero__desc">H5 · 钉钉小程序 · 微信小程序</view>
				<view class="hero__tech">Vue 3 · day.js · melon-ui 主题令牌</view>
				<view class="hero__meta">
					<view class="hero__chip">
						<text class="hero__chip-num">{{ componentCount }}</text>
						<text class="hero__chip-label">组件</text>
					</view>
					<view class="hero__chip">
						<text class="hero__chip-num">{{ utilCount }}</text>
						<text class="hero__chip-label">工具方法</text>
					</view>
					<view class="hero__chip">
						<text class="hero__chip-num">3</text>
						<text class="hero__chip-label">端适配</text>
					</view>
				</view>
			</view>

			<!-- ============ 分组导航 ============ -->
			<view class="nav">
				<view
					v-for="g in groups"
					:key="g.key"
					class="nav__item"
					:class="{ 'is-active': group === g.key }"
					@click="group = g.key">
					{{ g.label }}
				</view>
			</view>

			<!-- ============================================================
			     1. 基础组件
			     ============================================================ -->
			<view v-if="group === 'basic'" class="sec">
				<view class="sec__head">
					<view class="sec__title">基础组件</view>
					<view class="sec__sub">按钮 · 字段 · 标签 · 步骤 · 间距</view>
				</view>
				<!-- 按钮 -->
				<view class="card">
					<view class="card__title">m-button 按钮</view>
					<view class="row">
						<m-button @click="log('主按钮')">主按钮</m-button>
						<m-button type="delete" @click="log('危险按钮')">危险</m-button>
						<m-button ghost @click="log('幽灵按钮')">幽灵</m-button>
						<m-button link @click="log('文字按钮')">文字</m-button>
					</view>
					<view class="row">
						<m-button disabled>禁用</m-button>
						<m-button loading>加载中</m-button>
						<m-button rate-limit @click="log('节流 1.5s')">点击节流</m-button>
					</view>
					<view class="row">
						<m-button block boxshadow @click="log('块级 + 阴影')">块级 + 阴影</m-button>
					</view>
					<view class="row">
						<m-button color="#16C797" @click="log('自定义色')">自定义色</m-button>
						<m-button ghost color="#F79131" border-color="#F79131" @click="log('自定义幽灵')">自定义幽灵</m-button>
					</view>
					<m-space height="20rpx" />
					<m-button-process
						ddid="D20261009001"
						trids="TR20261009002"
						@change="onProcessChange"
						@done="onProcessDone" />
					<view class="hint">↑ m-button-process（同意 / 不同意），未配置后端接口时仅派发事件</view>
				</view>

				<!-- 间距 / 字段 -->
				<view class="card">
					<view class="card__title">m-field 字段容器 · m-space 间距</view>
					<m-field title="普通字段">
						<view class="field-val">字段内容</view>
					</m-field>
					<m-field title="必填字段" :required="true">
						<view class="field-val">带红色星号</view>
					</m-field>
					<m-space height="20rpx" />
					<view class="hint">m-space 是纯占位间隔组件，常用于 flex 布局留白</view>
				</view>

				<!-- 标签 -->
				<view class="card">
					<view class="card__title">m-tag 标签 · m-tag-group 标签组</view>
					<view class="row">
						<m-tag>默认标签</m-tag>
						<m-tag-group :options="tagOptions" />
					</view>
					<m-space height="20rpx" />
					<m-tag-group :options="tagOptions2" />
				</view>

				<!-- 步骤条 -->
				<view class="card">
					<view class="card__title">m-step 步骤条</view>
					<m-step :steps="steps" :current="stepCurrent">
						<view class="step-body">当前步骤：{{ steps[stepCurrent - 1] }}</view>
					</m-step>
					<view class="row">
						<m-button ghost @click="stepCurrent = stepCurrent > 1 ? stepCurrent - 1 : 1">上一步</m-button>
						<m-button ghost @click="stepCurrent = stepCurrent < steps.length ? stepCurrent + 1 : steps.length">下一步</m-button>
					</view>
				</view>
			</view>

			<!-- ============================================================
			     2. 表单组件
			     ============================================================ -->
			<view v-if="group === 'form'" class="sec">
				<view class="sec__head">
					<view class="sec__title">表单组件</view>
					<view class="sec__sub">校验 · 输入 · 选择器 · 单选多选</view>
				</view>
				<view class="card">
					<view class="card__title">m-form 表单校验</view>
					<view class="hint">支持 required 与 rules（pattern / validator / message）</view>
					<m-form ref="form">
						<m-form-item name="name" label="姓名" required>
							<m-input v-model="model.name" placeholder="请输入姓名" />
						</m-form-item>
						<m-form-item name="phone" label="手机号" :rules="phoneRules">
							<m-input v-model="model.phone" type="number" placeholder="请输入手机号" />
						</m-form-item>
						<m-form-item name="gender" label="性别">
							<m-picker v-model="model.gender" :range="genderOptions" range-value="value" range-text="text" />
						</m-form-item>
						<m-form-item name="date" label="预约日期">
							<m-datetime-picker v-model="model.date" format="yyyy-MM-dd" />
						</m-form-item>
						<m-form-item name="datetime" label="日期时间">
							<m-datetime-picker v-model="model.datetime" format="yyyy-MM-dd HH:mm" placeholder="选日期+时间" />
						</m-form-item>
						<m-form-item name="remark" label="备注">
							<m-textarea v-model="model.remark" title="备注说明" placeholder="可填写补充说明" />
						</m-form-item>
						<m-form-item name="locked" label="禁用态">
							<m-input model-value="不可编辑" disabled />
						</m-form-item>
						<m-form-item name="agree" label="是否同意">
							<m-radio-group :value="model.agree" :options="agreeOptions" @change="model.agree = $event" />
						</m-form-item>
						<m-form-item name="hobby" label="兴趣爱好">
							<m-checkbox-group :value="model.hobby" :options="hobbyOptions" @change="model.hobby = $event" />
						</m-form-item>
						<m-form-item>
							<m-button block boxshadow @click="onValidate">提交校验</m-button>
						</m-form-item>
					</m-form>
					<view v-if="validateMsg" class="result" :class="{ 'is-error': !validateOk }">{{ validateMsg }}</view>
					<view class="row">
						<m-button ghost @click="onResetForm">重置表单</m-button>
					</view>
				</view>

				<view class="card">
					<view class="card__title">m-form-view 只读展示</view>
					<m-form-item label="性别">
						<m-form-view :value="model.gender" :value-show="genderText" />
					</m-form-item>
					<view class="hint">未选择时显示占位文案「请选择」</view>
				</view>

				<view class="card">
					<view class="card__title">m-radio / m-checkbox 单项用法</view>
					<view class="hint">
						m-radio-group 与 m-checkbox-group 内部即由这两者组成；
						也可不依赖 group，用 slot 自行编排布局。
					</view>
					<m-radio-group :value="model.radioSingle" @change="model.radioSingle = $event">
						<m-radio :value="1">男</m-radio>
						<m-radio :value="2">女</m-radio>
					</m-radio-group>

					<m-space height="20rpx" />

					<m-checkbox-group :value="model.checkboxSingle" @change="model.checkboxSingle = $event">
						<m-checkbox :value="'a'">阅读</m-checkbox>
						<m-checkbox :value="'b'">运动</m-checkbox>
					</m-checkbox-group>
					<view class="hint">
						当前：单选 {{ model.radioSingle || '（无）' }} / 多选 {{ JSON.stringify(model.checkboxSingle) }}
					</view>
				</view>

				<view class="card">
					<view class="card__title">m-linkpicker 跨页选择</view>
					<m-form-item label="选择部门">
						<m-linkpicker
							:value="linkValue"
							:value-show="linkShow"
							eventname="picker:dept"
							:url="linkUrl"
							@change="onLinkChange" />
					</m-form-item>
					<view class="hint" @click="emitPickerEvent">↑ 点击这行模拟目标页回传结果（uni.$emit 触发）</view>
				</view>
			</view>

			<!-- ============================================================
			     3. 弹层与交互
			     ============================================================ -->
			<view v-if="group === 'overlay'" class="sec">
				<view class="sec__head">
					<view class="sec__title">弹层与交互</view>
					<view class="sec__sub">弹层 · 标签页切换</view>
				</view>
				<view class="card">
					<view class="card__title">m-popup 弹层</view>
					<m-popup v-model="popupVisible">
						<m-button ghost>默认内容弹层</m-button>
						<template v-slot:content>
							<view class="popup-body">
								遮罩使用四边定位（不用 100vh），点击遮罩或右上角关闭按钮即可关闭。
							</view>
						</template>
					</m-popup>

					<m-space height="24rpx" />

					<m-popup v-model="popupCustom" border>
						<m-button ghost>自定义头部弹层</m-button>
						<template v-slot:head>
							<view class="popup-head">
								<text>自定义头部</text>
								<text class="popup-head__close" @click="popupCustom = false">关闭</text>
							</view>
						</template>
						<template v-slot:content>
							<view class="popup-body">使用 v-slot:head 替换了默认标题栏。</view>
						</template>
					</m-popup>
				</view>

				<view class="card">
					<view class="card__title">m-tabs 标签页</view>
					<m-tabs :value="tabValue" :data="tabData" border @change="tabValue = $event" />
					<view class="tabs-body">当前选中：{{ tabValue }}</view>

					<m-space height="24rpx" />

					<m-tabs :value="tabValue2" :data="tabData2" size="small" justify-content="flex-start" @change="tabValue2 = $event" />
					<view class="hint">small 尺寸 + 左对齐</view>
				</view>
			</view>

			<!-- ============================================================
			     4. 数据展示
			     ============================================================ -->
			<view v-if="group === 'data'" class="sec">
				<view class="sec__head">
					<view class="sec__title">数据展示</view>
					<view class="sec__sub">卡片 · 列表 · 筛选 · 列表页容器</view>
				</view>
				<view class="card">
					<view class="card__title">m-card 卡片</view>
					<m-card
						title="请假申请"
						:status="1"
						:color-map="colorMap"
						:desc="cardDesc"
						@click="log('m-card 点击')" />

					<m-space height="20rpx" />

					<m-card title="兼容 value + fieldMap" :value="legacyCard" :field-map="legacyFieldMap" />
				</view>

				<view class="card">
					<view class="card__title">m-list 列表（多选）</view>
					<m-list
						:value="listValue"
						:data="listData"
						:field-map="listFieldMap"
						value-key="id"
						checkbox-visible
						@update:value="listValue = $event" />
					<view class="hint">顶部可全选 / 取消；已选 {{ listValue.length }} 项</view>
				</view>

				<view class="card">
					<view class="card__title">m-list 自定义插槽</view>
					<m-list :data="listData2">
						<template #default="{ dataRow }">
							<view class="custom-row">
								<text class="custom-row__name">{{ dataRow.name }}</text>
								<m-tag>{{ dataRow.tag }}</m-tag>
							</view>
						</template>
					</m-list>
				</view>

				<view class="card">
					<view class="card__title">m-search 条件筛选</view>
					<m-search :value="searchValue" :data="searchData" @change="onSearchChange" />
					<view class="hint">当前筛选：{{ JSON.stringify(searchValue) }}</view>
				</view>

				<view class="card">
					<view class="card__title">m-page-list 列表页容器</view>
					<view class="hint">
						m-page-list 用于「条件筛选 + 列表 + 新增按钮」的组合页面，内置 m-search 与悬浮新增按钮。
					</view>
					<m-page-list :search="{ visible: true, value: pageListSearch, data: searchData }" @search="onPageListSearch">
						<m-list :data="listData" value-key="id">
							<template #default="{ dataRow }">
								<view class="custom-row">
									<text class="custom-row__name">{{ dataRow.name }}</text>
									<m-tag>{{ dataRow.status }}</m-tag>
								</view>
							</template>
						</m-list>
					</m-page-list>
				</view>
			</view>

			<!-- ============================================================
			     5. 业务组件
			     ============================================================ -->
			<view v-if="group === 'biz'" class="sec">
				<view class="sec__head">
					<view class="sec__title">业务组件</view>
					<view class="sec__sub">级联选择 · 审批流 · 业务人员选择</view>
				</view>
				<view class="card">
					<view class="card__title">m-cascade-picker 级联选择</view>
					<view class="hint">未配置 url 时使用本地 data；配置后会请求接口按层级加载</view>
					<m-cascade-picker
						:value="cascadeValue"
						:value-show="cascadeShow"
						:data="cascadeData"
						data-value="id"
						data-text="text"
						@change="onCascadeChange">
						<m-button ghost>打开级联选择</m-button>
					</m-cascade-picker>
				</view>

				<view class="card">
					<view class="card__title">m-form-cascade 级联表单项</view>
					<m-form-item label="所属部门">
						<m-form-cascade
							:value="cascadeValue"
							:value-show="cascadeShow"
							:data="cascadeData"
							data-value="id"
							data-text="text"
							@change="onCascadeChange" />
					</m-form-item>
				</view>

				<view class="card">
					<view class="card__title">m-trans 审批流轴</view>
					<m-trans :data="transData" />
				</view>

				<view class="card">
					<view class="card__title">external-lecturer 业务示例</view>
					<external-lecturer v-model:value="lecturerValue" v-model:search="lecturerSearch" />
					<view class="hint">选中值：{{ lecturerValue || '（无）' }} / 搜索词：{{ lecturerSearch || '（无）' }}</view>
				</view>
			</view>

			<!-- ============================================================
			     6. 工具库 utils
			     ============================================================ -->
			<view v-if="group === 'utils'" class="sec">
				<view class="sec__head">
					<view class="sec__title">工具方法</view>
					<view class="sec__sub">日期 · 缓存 · 令牌 · 配置 · 请求 · 日志 · 路由 · 上传</view>
				</view>
				<!-- 日期 -->
				<view class="card">
					<view class="card__title">日期 · day.js</view>
					<view class="kv"><text class="kv__k">getFormate 默认</text><text class="kv__v">{{ nowText }}</text></view>
					<view class="kv"><text class="kv__k">getFormate('y-m-d')</text><text class="kv__v">{{ getFormate(now, 'y-m-d') }}</text></view>
					<view class="kv"><text class="kv__k">Date2Str</text><text class="kv__v">{{ Date2Str(now) }}</text></view>
					<view class="kv"><text class="kv__k">Date2Str('/')</text><text class="kv__v">{{ Date2Str(now, '/') }}</text></view>
					<view class="kv"><text class="kv__k">GetDays 当月天数</text><text class="kv__v">{{ GetDays(now) }}</text></view>
					<view class="kv"><text class="kv__k">Number2Fix(5)</text><text class="kv__v">{{ Number2Fix(5) }}</text></view>
					<view class="kv"><text class="kv__k">GetNumberOfMonth(+1)</text><text class="kv__v">{{ GetNumberOfMonth(now, 1) }}</text></view>
					<view class="kv"><text class="kv__k">DateReduce</text><text class="kv__v">{{ DateReduce(now, '2026-01-01') }} ms</text></view>
					<view class="kv"><text class="kv__k">Str2Date → format</text><text class="kv__v">{{ Str2Date('2026-10-09').format('YYYY/MM/DD') }}</text></view>
					<view class="kv"><text class="kv__k">subtract(7,'day')</text><text class="kv__v">{{ dayjs(now).subtract(7, 'day').format('YYYY-MM-DD') }}</text></view>
					<view class="kv"><text class="kv__k">startOf('month')</text><text class="kv__v">{{ dayjs(now).startOf('month').format('YYYY-MM-DD') }}</text></view>
					<view class="kv"><text class="kv__k">闰年 2024-02 天数</text><text class="kv__v">{{ dayjs('2024-02-01').daysInMonth() }} 天</text></view>
					<view class="kv"><text class="kv__k">FORMAT.DATE</text><text class="kv__v">{{ FORMAT.DATE }}</text></view>
					<view class="kv"><text class="kv__k">FORMAT.DATETIME</text><text class="kv__v">{{ FORMAT.DATETIME }}</text></view>
					<view class="row">
						<m-button ghost @click="onRefreshTime">刷新时间</m-button>
						<m-button ghost @click="log('isDayjs → ' + isDayjs(now))">isDayjs</m-button>
						<m-button ghost @click="log('unix(1) → ' + unix(1))">unix</m-button>
					</view>
				</view>

				<!-- 缓存 -->
				<view class="card">
					<view class="card__title">本地缓存 · cache</view>
					<view class="kv"><text class="kv__k">CACHE_PREFIX</text><text class="kv__v">{{ config.CACHE_PREFIX }}</text></view>
					<view class="kv"><text class="kv__k">demo 缓存</text><text class="kv__v">{{ cacheText || '（空）' }}</text></view>
					<view class="row">
						<m-button ghost @click="onCacheSet">写入</m-button>
						<m-button ghost @click="onCacheGet">读取</m-button>
						<m-button ghost @click="onCacheDel">删除</m-button>
						<m-button type="delete" ghost @click="onCacheClear">清空全部</m-button>
					</view>
				</view>

				<!-- Token -->
				<view class="card">
					<view class="card__title">令牌 · token</view>
					<view class="kv"><text class="kv__k">当前 token</text><text class="kv__v">{{ tokenText || '（未设置）' }}</text></view>
					<view class="kv"><text class="kv__k">缓存的用户信息</text><text class="kv__v">{{ cachedUserText || '（无）' }}</text></view>
					<view class="row">
						<m-button ghost @click="onTokenSet">写入</m-button>
						<m-button ghost @click="onTokenClear">清除</m-button>
						<m-button ghost @click="onGetUser">获取用户</m-button>
						<m-button ghost @click="onGetCachedUser">读缓存用户</m-button>
						<m-button ghost @click="onSetUser">写入用户</m-button>
						<m-button type="delete" ghost @click="onClearUser">清空用户</m-button>
						<m-button ghost @click="log('getHost → ' + getHost())">getHost</m-button>
					</view>
				</view>

				<!-- 配置 -->
				<view class="card">
					<view class="card__title">多端配置 · config</view>
					<view class="kv"><text class="kv__k">PLATFORM</text><text class="kv__v">{{ config.PLATFORM }}</text></view>
					<view class="kv"><text class="kv__k">AUTH_TYPE</text><text class="kv__v">{{ config.AUTH_TYPE }}</text></view>
					<view class="kv"><text class="kv__k">API_BASE</text><text class="kv__v">{{ config.API_BASE }}</text></view>
					<view class="kv"><text class="kv__k">TIMEOUT</text><text class="kv__v">{{ config.TIMEOUT }} ms</text></view>
					<view class="kv"><text class="kv__k">UNAUTH_CODES</text><text class="kv__v">{{ config.UNAUTH_CODES.join(', ') }}</text></view>
					<view class="kv"><text class="kv__k">isDev</text><text class="kv__v">{{ config.isDev }}</text></view>
				</view>

				<!-- 请求 -->
				<view class="card">
					<view class="card__title">网络请求 · request</view>
					<view class="hint">模板未配置真实后端，请求失败属预期行为，可观察 loading 与错误提示</view>
					<view class="row">
						<m-button ghost @click="onReqGet">GET</m-button>
						<m-button ghost @click="onReqPost">POST</m-button>
						<m-button ghost @click="onReqCallback">回调式 GET</m-button>
					</view>
					<view v-if="reqMsg" class="result" :class="{ 'is-error': reqFail }">{{ reqMsg }}</view>
				</view>

				<!-- 日志 -->
				<view class="card">
					<view class="card__title">日志 · logger</view>
					<view class="hint">输出到控制台，便于在小程序开发者工具中查看</view>
					<view class="row">
						<m-button ghost @click="logger.debug('debug 日志')">debug</m-button>
						<m-button ghost @click="logger.info('info 日志')">info</m-button>
						<m-button ghost @click="warn('warn 日志')">warn</m-button>
						<m-button type="delete" ghost @click="logger.error('error 日志')">error</m-button>
					</view>
				</view>

				<!-- 路由 -->
				<view class="card">
					<view class="card__title">路由 · router</view>
					<view class="kv"><text class="kv__k">getCurrentPath</text><text class="kv__v">{{ currentPath }}</text></view>
					<view class="row">
						<m-button ghost @click="onRefreshPath">刷新当前路径</m-button>
						<m-button ghost @click="onSetPath">setCurrentPath</m-button>
						<m-button ghost @click="onJump">jump(当前页)</m-button>
						<m-button ghost @click="onBack">back(delta)</m-button>
					</view>
					<view class="hint">
						jump / back 会真实改变页面；redirect / reLaunch / switchTab 需配合实际路由使用，故不在此触发。
					</view>
					<m-space height="20rpx" />
					<view class="card__title">重新登录 · relogin</view>
					<view class="row">
						<m-button ghost @click="onRelogin">relogin</m-button>
					</view>
					<view class="hint">H5 端会跳转到 OAuth 地址；小程序端重新走登录流程。</view>
				</view>

				<!-- 接口地址 -->
				<view class="card">
					<view class="card__title">接口地址 · api</view>
					<view class="kv"><text class="kv__k">auth.dingtalkLogin</text><text class="kv__v">{{ api.auth.dingtalkLogin }}</text></view>
					<view class="kv"><text class="kv__k">auth.wechatLogin</text><text class="kv__v">{{ api.auth.wechatLogin }}</text></view>
					<view class="kv"><text class="kv__k">demo.list</text><text class="kv__v">{{ api.demo.list }}</text></view>
					<view class="kv"><text class="kv__k">demo.detail</text><text class="kv__v">{{ api.demo.detail }}</text></view>
					<view class="kv"><text class="kv__k">demo.upload</text><text class="kv__v">{{ api.demo.upload }}</text></view>
				</view>

				<!-- 上传 -->
				<view class="card">
					<view class="card__title">图片上传 · m-upload</view>
					<m-upload v-model="images" title="现场照片" desc="点击选择并上传（需后端）" />
				</view>
			</view>
		</view>
	</m-page>
</template>

<script>
	export default {
		data() {
			return {
				group: 'basic',
				groups: [
					{ key: 'basic', label: '基础' },
					{ key: 'form', label: '表单' },
					{ key: 'overlay', label: '弹层' },
					{ key: 'data', label: '展示' },
					{ key: 'biz', label: '业务' },
					{ key: 'utils', label: '工具' },
				],
				componentCount: 31,
				utilCount: 24,

				/* ---- 基础 ---- */
				tagOptions: ['轻量', '快速'],
				tagOptions2: ['一', '二', '三', '四', '五'],
				steps: ['提交申请', '部门审批', '财务复核', '完成'],
				stepCurrent: 2,

				/* ---- 表单 ---- */
				model: {
					name: '',
					phone: '',
					gender: '',
					date: '',
					datetime: '',
					remark: '',
					agree: '',
					hobby: [],
				},
				phoneRules: [
					{ required: true, message: '手机号不能为空' },
					{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
				],
				genderOptions: [
					{ value: 1, text: '男' },
					{ value: 2, text: '女' },
				],
				agreeOptions: [
					{ value: 1, text: '同意' },
					{ value: 0, text: '不同意' },
				],
				hobbyOptions: [
					{ value: 'a', text: '阅读' },
					{ value: 'b', text: '运动' },
					{ value: 'c', text: '音乐' },
				],
				validateMsg: '',
				validateOk: true,
				radioSingle: '',
				checkboxSingle: [],
				linkValue: '',
				linkShow: '',
				linkUrl: '/pages/demo/index',

				/* ---- 弹层 ---- */
				popupVisible: false,
				popupCustom: false,
				tabValue: 'a',
				tabData: [
					{ value: 'a', text: '选项A' },
					{ value: 'b', text: '选项B' },
					{ value: 'c', text: '选项C' },
				],
				tabValue2: 'x',
				tabData2: [
					{ value: 'x', text: '左对齐1' },
					{ value: 'y', text: '左对齐2' },
					{ value: 'z', text: '左对齐3' },
				],

				/* ---- 展示 ---- */
				colorMap: { 1: '#16C797', 2: '#E83838' },
				cardDesc: [
					{ label: '状态', text: '已通过' },
					{ label: '负责人', text: '张三' },
					{ label: '时间', text: '2026-10-09' },
				],
				legacyCard: {
					title: '旧版用法',
					status: '待处理',
					desc: [
						{ label: '类型', text: '请假' },
						{ label: '天数', text: '3 天' },
					],
				},
				legacyFieldMap: { title: 'title', status: 'status', desc: { label: 'label', text: 'text' } },
				listValue: [],
				// m-list 未传 slot 时内部用 m-card 渲染，需告诉它标题字段，否则行内空白
				listFieldMap: { title: 'name', status: 'status', desc: { label: 'label', text: 'text' } },
				listData: [
					{ id: 1, name: '张三', status: '已通过' },
					{ id: 2, name: '李四', status: '待处理' },
					{ id: 3, name: '王五', status: '已驳回' },
				],
				listData2: [
					{ name: '项目 A', tag: '进行中' },
					{ name: '项目 B', tag: '已完成' },
				],
				searchValue: {},
				pageListSearch: {},
				searchData: [
					{
						title: '状态',
						field: 'status',
						tags: [
							{ id: 1, text: '待处理' },
							{ id: 2, text: '已通过' },
							{ id: 3, text: '已驳回' },
						],
					},
				],

				/* ---- 业务 ---- */
				cascadeValue: [],
				cascadeShow: [],
				cascadeData: [
					{ id: 1, text: '技术部', leaf: false, children: [{ id: 11, text: '前端组' }, { id: 12, text: '后端组' }] },
					{ id: 2, text: '市场部', leaf: false, children: [{ id: 21, text: '品牌组' }, { id: 22, text: '销售组' }] },
				],
				transData: [
					{
						D_TransactionBegin: '2026-10-08 09:12:00',
						C_QueueName: '部门审批',
						blr: '李四',
						action: '同意',
						C_TransactionComment: '情况属实，同意',
					},
					{
						D_TransactionBegin: '2026-10-09 14:30:00',
						C_QueueName: '财务复核',
						blr: '王五',
						action: '',
						C_TransactionComment: '',
					},
				],
				lecturerValue: '',
				lecturerSearch: '',

				/* ---- 工具 ---- */
				now: new Date(),
				cacheText: '',
				tokenText: '',
				cachedUserText: '',
				reqMsg: '',
				reqFail: false,
				back: 1,
				currentPath: '',
				images: [],
			}
		},
		computed: {
			nowText() { return this.util.getFormate(this.now) },
			genderText() {
				const hit = this.genderOptions.find((o) => o.value === this.model.gender)
				return hit ? hit.text : ''
			},
		},
		created() {
			this.currentPath = this.util.getCurrentPath()
			const c = this.util.cache.get('demo')
			this.cacheText = c ? JSON.stringify(c) : ''
			this.tokenText = this.util.getToken() || ''
		},
		methods: {
			/* ---------- 通用 ---------- */
			getFormate(...args) {
			return this.util.getFormate(...args)
		},
		log(title) {
				uni.showToast({ title, icon: 'none' })
				this.util.logger.debug('[demo]', title)
			},

			/* ---------- 表单 ---------- */
			onValidate() {
				const res = this.$refs.form.validate()
				this.validateOk = res.valid
				this.validateMsg = res.valid
					? '校验通过，数据：' + JSON.stringify(res.data)
					: '校验未通过：' + res.errors.map((e) => e.msg).join('；')
			},
			onResetForm() {
				this.$refs.form.reset()
				this.model.name = ''
				this.model.phone = ''
				this.model.remark = ''
				this.validateMsg = ''
				this.log('表单已重置')
			},
			onLinkChange(v) {
				this.linkValue = v
				this.linkShow = v
				this.log('linkpicker → ' + v)
			},
			emitPickerEvent() {
				// 模拟目标页回传结果：触发 m-linkpicker 内注册的 uni.$once 监听
				uni.$emit('picker:dept', { value: '技术部', valueShow: '技术部' })
			},

			/* ---------- 业务 ---------- */
			onProcessChange(status) {
				this.log(status ? 'm-button-process：同意' : 'm-button-process：不同意')
			},
			onProcessDone() {
				this.log('m-button-process：处理完成')
			},
			onCascadeChange(v) {
				this.cascadeValue = v
				this.log('级联选择：' + JSON.stringify(v))
			},
			onSearchChange(v) {
				this.searchValue = v
				this.log('筛选：' + JSON.stringify(v))
			},
			onPageListSearch(v) {
				this.pageListSearch = v
				this.log('page-list 筛选：' + JSON.stringify(v))
			},

			/* ---------- 日期 ---------- */
			onRefreshTime() {
				this.now = new Date()
				this.log('时间已刷新')
			},

			/* ---------- 缓存 ---------- */
			onCacheSet() {
				this.util.cache.set('demo', { n: Date.now() }, 60)
				const v = this.util.cache.get('demo')
				this.cacheText = v ? JSON.stringify(v) : ''
				this.log('已写入缓存（60s 过期）')
			},
			onCacheGet() {
				const v = this.util.cache.get('demo')
				this.cacheText = v ? JSON.stringify(v) : ''
				this.log(v ? '读取成功' : '缓存不存在或已过期')
			},
			onCacheDel() {
				this.util.cache.del('demo')
				this.cacheText = ''
				this.log('已删除')
			},
			onCacheClear() {
				this.util.cache.clearAll()
				this.cacheText = ''
				this.tokenText = ''
				this.log('已清空全部缓存')
			},

			/* ---------- Token ---------- */
			onTokenSet() {
				this.util.setToken('demo-token-123')
				this.tokenText = this.util.getToken()
				this.log('token 已写入')
			},
			onTokenClear() {
				this.util.clearToken()
				this.tokenText = ''
				this.log('token 已清除')
			},
			onGetUser() {
				this.util.getUser()
					.then((u) => this.log('用户：' + (u ? JSON.stringify(u) : '未登录')))
					.catch(() => this.log('获取用户失败'))
			},
			onGetCachedUser() {
				const u = this.util.getCachedUser()
				this.cachedUserText = u ? JSON.stringify(u) : ''
				this.log(u ? '已读取缓存用户' : '无缓存用户')
			},
			onSetUser() {
				const u = { name: '张三', role: '管理员' }
				this.util.setUser(u)
				this.cachedUserText = JSON.stringify(u)
				this.log('已写入用户：' + JSON.stringify(u))
			},
			onClearUser() {
				this.util.clearUser()
				this.cachedUserText = ''
				this.tokenText = ''
				this.log('已清空用户与token')
			},

			/* ---------- 请求 ---------- */
			onReqGet() {
				this.reqMsg = 'GET 请求中…'
				this.reqFail = false
				this.util.get(this.api.demo.list, { id: 1 })
					.then((r) => { this.reqMsg = '成功：' + JSON.stringify(r) })
					.catch((e) => {
						this.reqFail = true
						this.reqMsg = '失败（预期）：' + (e && e.msg ? e.msg : e)
					})
			},
			onReqPost() {
				this.reqMsg = 'POST 请求中…'
				this.reqFail = false
				this.util.post(this.api.demo.detail, { id: 1 })
					.then((r) => { this.reqMsg = '成功：' + JSON.stringify(r) })
					.catch((e) => {
						this.reqFail = true
						this.reqMsg = '失败（预期）：' + (e && e.msg ? e.msg : e)
					})
			},
			onReqCallback() {
				this.reqMsg = '回调式 GET 请求中…'
				this.reqFail = false
				this.GET({
					url: this.api.demo.list,
					data: { id: 1 },
					success: (r) => { this.reqMsg = '成功：' + JSON.stringify(r) },
					fail: (e) => {
						this.reqFail = true
						this.reqMsg = '失败（预期）：' + (e && e.msg ? e.msg : e)
					},
					complete: () => this.util.logger.info('回调 complete 已触发'),
				})
			},

			/* ---------- 路由 ---------- */
			onRefreshPath() {
				this.currentPath = this.util.getCurrentPath()
				this.log('当前路径：' + this.currentPath)
			},
			onSetPath() {
				this.util.setCurrentPath('/pages/demo/index')
				this.currentPath = this.util.getCurrentPath()
				this.log('setCurrentPath → ' + this.currentPath)
			},
			onJump() {
				this.log('jump 到当前页（不会跳转）')
				this.jump('/pages/demo/index')
			},
			onBack() {
				this.log('back(delta=' + this.back + ')')
				this.util.back(this.back)
			},
			onRelogin() {
				uni.showModal({
					title: '重新登录',
					content: '将调用 relogin()，H5 会跳转 OAuth 地址，确定继续？',
					success: (res) => {
						if (res.confirm) this.util.relogin()
					},
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	/* =====================================================================
	 * 组件 Demo 页视觉
	 * 设计语言：品牌渐变头图 + 浮动胶囊导航 + 浮层卡片 + 令牌驱动
	 * 三端约束：仅用 SCSS 令牌 / 渐变 / 阴影；不使用 CSS 变量与
	 *           backdrop-filter（小程序不支持）；sticky 仅 H5 生效。
	 * ===================================================================== */
	$demo-shadow:    0 6rpx 20rpx rgba(40, 48, 54, 0.06);
	$demo-shadow-lg: 0 10rpx 30rpx rgba(59, 112, 219, 0.18);

	.demo {
		padding-bottom: calc(80rpx + env(safe-area-inset-bottom));
	}

	/* ---------- 头图 ---------- */
	.hero {
		position: relative;
		overflow: hidden;
		padding: 48rpx 40rpx 100rpx;
		background-color: $blue-600;
		background-image: linear-gradient(180deg, $blue-600 0%, $blue-600 18%, $blue-500 62%, $purple-500 100%);

		&__deco {
			position: absolute;
			border-radius: 50%;
			&--1 {
				top: -160rpx;
				right: -100rpx;
				width: 360rpx;
				height: 360rpx;
				background-color: rgba(255, 255, 255, 0.14);
			}
			&--2 {
				bottom: -120rpx;
				left: -60rpx;
				width: 240rpx;
				height: 240rpx;
				background-color: rgba(255, 255, 255, 0.10);
			}
		}

		&__badge {
			display: inline-block;
			padding: 6rpx 20rpx;
			border-radius: 100rpx;
			border: 1rpx solid rgba(255, 255, 255, 0.36);
			background-color: rgba(255, 255, 255, 0.18);
			font-size: 20rpx;
			letter-spacing: 3rpx;
			color: $white;
		}
		&__title {
			margin-top: 24rpx;
			font-size: 48rpx;
			font-weight: 700;
			letter-spacing: 1rpx;
			color: $white;
		}
		&__desc {
			margin-top: 14rpx;
			font-size: 26rpx;
			color: rgba(255, 255, 255, 0.90);
		}
		&__tech {
			margin-top: 8rpx;
			font-size: 22rpx;
			color: rgba(255, 255, 255, 0.66);
		}
		&__meta {
			display: flex;
			flex-wrap: wrap;
			margin-top: 32rpx;
		}
		&__chip {
			display: flex;
			align-items: center;
			margin: 0 16rpx 12rpx 0;
			padding: 10rpx 24rpx;
			border-radius: 100rpx;
			border: 1rpx solid rgba(255, 255, 255, 0.26);
			background-color: rgba(255, 255, 255, 0.16);
		}
		&__chip-num {
			font-size: 30rpx;
			font-weight: 700;
			color: $white;
		}
		&__chip-label {
			margin-left: 8rpx;
			font-size: 22rpx;
			color: rgba(255, 255, 255, 0.82);
		}
	}

	/* ---------- 分组导航（浮于头图之上的胶囊） ---------- */
	.nav {
		position: relative;
		z-index: 2;
		display: flex;
		margin: -68rpx 24rpx 0;
		padding: 10rpx;
		border-radius: 100rpx;
		background-color: $white;
		box-shadow: $demo-shadow-lg;

		/* #ifdef H5 */
		position: sticky;
		top: 44px;
		/* #endif */

		&__item {
			flex: 1;
			height: 64rpx;
			line-height: 64rpx;
			border-radius: 100rpx;
			text-align: center;
			font-size: 26rpx;
			color: $black5;
			transition: color 0.2s, background-color 0.2s;

			&.is-active {
				font-weight: 600;
				color: $white;
				background-color: $blue-500;
				background-image: linear-gradient(135deg, $blue-500, $purple-500);
				box-shadow: 0 4rpx 14rpx rgba(81, 146, 255, 0.36);
			}
		}
	}

	/* ---------- 分组标题 ---------- */
	.sec {
		padding: 40rpx 24rpx 0;

		&__head {
			display: flex;
			align-items: baseline;
			margin: 0 8rpx 24rpx;
		}
		&__title {
			font-size: 32rpx;
			font-weight: 700;
			color: $black;
		}
		&__sub {
			margin-left: 16rpx;
			font-size: 22rpx;
			color: $black9;
		}
	}

	/* ---------- 卡片 ---------- */
	.card {
		margin-bottom: 26rpx;
		padding: 30rpx 32rpx;
		border-radius: 24rpx;
		background-color: $white;
		box-shadow: $demo-shadow;
		box-sizing: border-box;

		&__title {
			display: flex;
			align-items: center;
			margin-bottom: 24rpx;
			font-size: 30rpx;
			font-weight: 700;
			line-height: 42rpx;
			color: $black;

			&::before {
				content: '';
				flex-shrink: 0;
				width: 8rpx;
				height: 30rpx;
				margin-right: 16rpx;
				border-radius: 4rpx;
				background-image: linear-gradient(180deg, $blue-400, $purple-500);
			}
		}
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 8rpx;
		> view { margin: 0 16rpx 16rpx 0; }
	}

	/* ---------- 说明气泡 ---------- */
	.hint {
		margin-top: 16rpx;
		padding: 16rpx 22rpx;
		border-radius: 12rpx;
		border-left: 6rpx solid $blue-200;
		background-color: $blue-50;
		font-size: 22rpx;
		line-height: 36rpx;
		color: $gray-400;
		box-sizing: border-box;
	}

	.field-val { font-size: 28rpx; color: $black5; }

	.step-body {
		margin: 8rpx 0 24rpx;
		padding: 22rpx 24rpx;
		border-radius: 12rpx;
		background-color: $bg-base;
		font-size: 26rpx;
		color: $black5;
		text-align: center;
	}

	.tabs-body {
		padding: 24rpx 0 4rpx;
		font-size: 26rpx;
		color: $black5;
	}

	/* ---------- 键值展示 ---------- */
	.kv {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 18rpx 0;
		font-size: 26rpx;
		& + & { border-top: 2rpx solid $divider-color; }

		&__k { flex-shrink: 0; color: $black5; }
		&__v {
			margin-left: 24rpx;
			font-weight: 500;
			color: $black;
			word-break: break-all;
			text-align: right;
		}
	}

	/* ---------- 结果提示 ---------- */
	.result {
		margin-top: 20rpx;
		padding: 20rpx 24rpx;
		border-radius: 12rpx;
		border: 2rpx solid rgba(22, 199, 151, 0.32);
		background-color: $green-50;
		font-size: 24rpx;
		line-height: 36rpx;
		color: $green-600;
		word-break: break-all;
		box-sizing: border-box;

		&.is-error {
			border-color: rgba(232, 56, 56, 0.32);
			background-color: $red-50;
			color: $red-600;
		}
	}

	/* ---------- 弹层内容 ---------- */
	.popup-body {
		font-size: 28rpx;
		line-height: 44rpx;
		color: $black5;
	}
	.popup-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30rpx;
		font-weight: 600;
		color: $black;

		&__close {
			font-size: 26rpx;
			font-weight: 400;
			color: $blue;
		}
	}

	/* ---------- 自定义列表行 ---------- */
	.custom-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 26rpx 0;

		&__name { font-size: 30rpx; color: $black; }
	}
</style>
