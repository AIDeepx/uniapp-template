<template>
	<view class="m-popup">
		<view class="m-popup__trigger" @click="open">
			<slot />
		</view>
		<!-- 遮罩、动画、安全区均由官方 uni-popup 提供，此处只负责内容面板 -->
		<uni-popup ref="popup" :type="type" :is-mask-click="true" @change="onChange">
			<view class="m-popup__panel" :class="panelClass">
				<view v-if="title || $slots.head" class="m-popup__head">
					<slot name="head">
						<view class="m-popup__title">{{ title }}</view>
						<view class="m-popup__close iconfont" @click="close">&#xe632;</view>
					</slot>
				</view>
				<view class="m-popup__body">
					<slot name="content" />
				</view>
				<!-- 底部操作区（§6.10）：取消（白底灰字胶囊）+ 确认（蓝底白字胶囊），等宽并排间距 12px -->
				<view v-if="showFooter" class="m-popup__footer">
					<slot name="footer">
						<m-button ghost round class="m-popup__btn" @click="onCancel">{{ cancelText }}</m-button>
						<m-button round class="m-popup__btn" @click="onConfirm">{{ confirmText }}</m-button>
					</slot>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	/**
	 * 弹层（基于官方 uni-popup 封装）
	 * - 官方 uni-popup 没有 show / v-model，只能通过 ref 调 open() / close()，
	 *   因此开关状态以它的 change 事件为唯一事实来源，再回灌给外部 v-model
	 * - 对外仍保持 modelValue + title + head/content 插槽的既有契约，业务侧零改动
	 */
	export default {
		name: 'm-popup',
		zhName: '弹层',
		props: {
			modelValue: { type: Boolean, default: false }, // v-model
			title: { type: String, default: '' },
			disabled: { type: Boolean, default: false },
			border: { type: Boolean, default: true },
			// 弹出方式：center（默认）| bottom | top | left | right
			type: { type: String, default: 'center' },
			// 底部操作区：传 confirmText 才渲染（也可用 footer 插槽完全自定义）
			cancelText: { type: String, default: '取消' },
			confirmText: { type: String, default: '' },
			// 确认按钮 loading（如提交中）
			confirmLoading: { type: Boolean, default: false },
			// 确认按钮禁用
			confirmDisabled: { type: Boolean, default: false },
		},
		data() {
			return { visible: false }
		},
		computed: {
			showFooter() {
				return Boolean(this.confirmText || this.$slots.footer)
			},
			panelClass() {
				return {
					'm-popup__panel--border': this.border,
					'm-popup__panel--bottom': this.type === 'bottom',
				}
			},
		},
		watch: {
			modelValue: {
				immediate: true,
				handler(val) { this.sync(val) },
			},
		},
		mounted() {
			// initial 为 true 时 immediate watch 阶段 $refs 还不存在，这里补一次
			if (this.visible) this.doOpen()
		},
		methods: {
			// 外部 v-model 变化 → 同步到 uni-popup（不受 disabled 影响，与旧行为一致）
			sync(val) {
				const show = !!val
				if (show === this.visible) return
				show ? this.doOpen() : this.doClose()
			},
			// 用户点击触发区（受 disabled 约束）
			open() {
				if (this.disabled) return
				this.doOpen()
			},
			close() { this.doClose() },
			onCancel() { this.$emit('cancel'); this.close() },
			onConfirm() { this.$emit('confirm') },
			doOpen() {
				const p = this.$refs.popup
				if (!p) {
					this.visible = true
					return
				}
				// 撤销尚未执行完的关闭动画，避免"关→开"快速切换时 open 被忽略
				if (p.timer) {
					clearTimeout(p.timer)
					p.timer = null
				}
				p.open()
			},
			doClose() {
				const p = this.$refs.popup
				if (!p) {
					this.visible = false
					return
				}
				p.close()
			},
			// uni-popup 的 change 是开关的唯一事实来源（含点击遮罩关闭）
			onChange(e) {
				const show = !!(e && e.show)
				if (show === this.visible) return
				this.setVisible(show)
			},
			setVisible(v) {
				this.visible = v
				this.$emit('update:modelValue', v)
				this.$emit('input', v)
				this.$emit('update:value', v)
				this.$emit('change', v)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-popup {
		display: block;
		width: 100%;

		&__trigger {
			width: 100%;
		}

		/* uni-popup 的 .uni-popup__wrapper 是 flex 收缩项，宽度不确定，
		   这里不能用 calc(100% - 64rpx)（百分比会塌陷成窄条）；
		   容器恒为全屏 fixed，rpx 即视口单位。§6.10 居中弹窗宽 ≈ 屏宽 − 48px → 654rpx */
		&__panel {
			width: 654rpx;
			max-height: 80vh;
			box-sizing: border-box;
			background: $form-card-bg;
			border-radius: $radius-xl;
			overflow: hidden;
			display: flex;
			flex-direction: column;

			&--bottom {
				width: 750rpx;
				max-height: 76vh;
				border-radius: $radius-xl $radius-xl 0 0;
			}
			&--border .m-popup__head {
				border-bottom: 1px solid $form-divider;
			}
		}

		/* §6.10 标题：14px #999999 左上（非居中深色） */
		&__head {
			position: relative;
			min-height: 88rpx;
			padding: 24rpx 32rpx 8rpx;
			box-sizing: border-box;
			flex-shrink: 0;

			.m-popup__title {
				padding-right: 72rpx;
				font-size: 28rpx; // 14px
				line-height: 40rpx;
				color: $black9;
			}
			.m-popup__close {
				position: absolute;
				right: 24rpx;
				top: 24rpx;
				line-height: 40rpx;
				font-size: 32rpx;
				color: $gray-300;
			}
		}

		&__body {
			flex: 1;
			min-height: 0;
			padding: 24rpx 32rpx;
			box-sizing: border-box;
			overflow-y: auto;
		}

		/* 底部操作区：等宽并排，间距 12px */
		&__footer {
			display: flex;
			flex-shrink: 0;
			gap: 24rpx;
			padding: 16rpx 32rpx 32rpx;
			box-sizing: border-box;

			.m-popup__btn {
				flex: 1;
				margin: 0;
			}
		}
	}
</style>