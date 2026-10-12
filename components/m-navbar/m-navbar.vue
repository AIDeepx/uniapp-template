<template>
	<view class="m-navbar-root">
		<!-- 固定模式下占位，避免内容被导航条遮挡 -->
		<view v-if="fixed && placeholder" class="m-navbar-placeholder" :style="{ height: navHeight + 'px' }"></view>

		<view
			class="m-navbar"
			:class="[typeClass, { 'is-fixed': fixed, 'has-border': border && type === 'default' }]"
			:style="navStyle">
			<view class="m-navbar__left">
				<slot name="left">
					<view v-if="showBack" class="m-navbar__back" hover-class="m-navbar__back--hover" @click="onBack">
						<view class="m-navbar__arrow"></view>
					</view>
				</slot>
			</view>

			<view class="m-navbar__title">
				<slot>{{ title }}</slot>
			</view>

			<view class="m-navbar__right">
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'm-navbar',
		props: {
			// 标题（也可通过默认插槽完全自定义中间区域）
			title: { type: String, default: '' },
			// 是否显示左侧返回按钮（默认显示）
			showBack: { type: Boolean, default: true },
			// 样式：default 白底 / gradient 蓝色渐变头（白字）
			type: { type: String, default: 'default' },
			// 是否固定到页面顶部
			fixed: { type: Boolean, default: true },
			// fixed 时是否渲染等高占位块
			placeholder: { type: Boolean, default: true },
			// 是否预留状态栏高度（沉浸式页面可关）
			safeTop: { type: Boolean, default: true },
			// default 类型是否显示底部 1px 分隔线
			border: { type: Boolean, default: true },
		},
		data() {
			return {
				statusBarHeight: 0,
			}
		},
		computed: {
			typeClass() {
				return this.type === 'gradient' ? 'm-navbar--gradient' : 'm-navbar--default'
			},
			navHeight() {
				return (this.safeTop ? this.statusBarHeight : 0) + 44
			},
			navStyle() {
				return {
					paddingTop: (this.safeTop ? this.statusBarHeight : 0) + 'px',
					height: '44px',
				}
			},
		},
		mounted() {
			try {
				this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0
			} catch (e) {
				this.statusBarHeight = 0
			}
		},
		methods: {
			onBack() {
				this.$emit('back')
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-navbar-root {
		.m-navbar-placeholder {
			width: 100%;
		}

		.m-navbar {
			display: flex;
			align-items: center;
			box-sizing: border-box;
			width: 100%;
			background-color: $bg-color-container;
			color: $text-color-primary;
			font-size: 34rpx; // 17px 导航标题

			&.is-fixed {
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				z-index: 1000;
			}

			&.has-border {
				border-bottom: 1px solid $divider-color;
			}

			&--gradient {
				background-image: linear-gradient(135deg, $blue-500, $blue-300);
				color: $white;
			}

			&__left,
			&__right {
				display: flex;
				align-items: center;
				flex-shrink: 0;
				height: 44px;
				min-width: 120rpx;
				padding: 0 24rpx;
				box-sizing: border-box;
				z-index: 1;
			}
			&__right {
				justify-content: flex-end;
			}

			&__title {
				flex: 1;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				text-align: center;
				font-size: 34rpx; // 17px
				font-weight: 600;
				line-height: 44px;
				color: inherit;
			}

			&__back {
				display: flex;
				align-items: center;
				height: 44px;
				padding: 0 8rpx;

				&--hover {
					opacity: 0.6;
				}
			}

			// 返回箭头用纯 CSS 绘制，避免依赖未知 iconfont 码
			&__arrow {
				width: 18rpx;
				height: 18rpx;
				border-left: 4rpx solid currentColor;
				border-bottom: 4rpx solid currentColor;
				transform: rotate(45deg);
				margin-left: 6rpx;
			}
		}
	}
</style>
