<template>
	<view
		:class="[
			'm-button',
			type ? 'm-button--' + type : '',
			ghost ? 'is-ghost' : '',
			link ? 'is-link' : '',
			block ? 'is-block' : '',
			(disabled || loading) ? 'is-disabled' : '',
			boxshadow ? 'has-shadow' : ''
		]"
		:style="styleObj"
		@click="onClick">
		<slot />
	</view>
</template>

<script>
	export default {
		name: 'm-button',
		zhName: '按钮',
		props: {
			type: { type: String, default: '' }, // '' 主按钮 | 'delete' 拒绝/警示按钮（橙，区别于紧急/失败红）
			ghost: { type: Boolean, default: false }, // 幽灵按钮（描边）
			link: { type: Boolean, default: false }, // 文字按钮
			block: { type: Boolean, default: false }, // 块级宽度
			boxshadow: { type: Boolean, default: false }, // 阴影
			disabled: { type: Boolean, default: false },
			loading: { type: Boolean, default: false },
			rateLimit: { type: Boolean, default: false }, // 点击节流（1.5s）
			color: { type: String, default: '' }, // 自定义主色
			borderColor: { type: String, default: '' },
		},
		inject: {
			formItemContext: { default: null }
		},
		data() {
			return { locked: false }
		},
		mounted() { this.syncForm() },
		watch: { type() { this.syncForm() } },
		computed: {
			styleObj() {
				const active = !this.disabled && !this.loading
				const s = {}
				if (this.color) {
					if (!this.ghost && !this.link && active) s.backgroundColor = this.color
					if ((this.ghost || this.link) && active) s.color = this.color
					if (this.ghost && active) s.borderColor = this.borderColor || this.color
				}
				return s
			}
		},
		methods: {
			syncForm() {
				if (this.formItemContext) this.formItemContext.hasButtonType = Boolean(this.type)
			},
			onClick(e) {
				if (this.disabled || this.loading) return
				if (this.rateLimit) {
					if (this.locked) return
					this.locked = true
					setTimeout(() => { this.locked = false }, 1500)
				}
				this.$emit('click', e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.m-button {
		height: 88rpx;
		// 必须有横向内边距：此前无 padding，按钮宽度 == 文字宽度，
		// 叠加 border-radius: 44rpx（= 高度一半）后会退化成正圆，
		// 首尾文字被圆弧切掉，视觉上像"文字溢出按钮"的BUG
		padding: 0 32rpx;
		line-height: 88rpx;
		font-size: 32rpx;
		border-radius: 44rpx;
		background-color: $blue;
		color: $white;
		text-align: center;
		white-space: nowrap;
		box-sizing: border-box;
		transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;

		&.is-block { width: 100%; }

		// 按压态：实心按钮改用「按压蓝/按压橙」而非整体压暗（与规范一致）
		&:active:not(.is-disabled):not(.is-link) {
			background-color: $color-brand-active;
		}

		&--delete { background-color: $orange; }
		&--delete:active:not(.is-disabled):not(.is-link) {
			background-color: $color-warning-active;
		}

		// 禁用 / 加载：浅灰底 + 浅灰字，明确表达"不可用"
		&.is-disabled {
			color: $text-color-disabled;
			background-color: $bg-color-base;
			border-color: $border-color-base;
		}

		&.is-ghost {
			background: none;
			border: $border-width-medium solid $blue;
			color: $blue;
			&:active:not(.is-disabled) {
				border-color: $color-brand-active;
				color: $color-brand-active;
			}
			&.m-button--delete {
				border-color: $orange;
				color: $orange;
				&:active:not(.is-disabled) {
					border-color: $color-warning-active;
					color: $color-warning-active;
				}
			}
			&.is-disabled { color: $text-color-disabled; border-color: $border-color-base; }
		}

		&.is-link {
			background: none;
			padding: 0 8rpx;
			color: $blue;
			&:active:not(.is-disabled) { color: $color-brand-active; }
			&.m-button--delete {
				color: $orange;
				&:active:not(.is-disabled) { color: $color-warning-active; }
			}
			&.is-disabled { color: $text-color-disabled; }
		}

		&.has-shadow { box-shadow: 0 6rpx 16rpx 0 rgba($color-brand, 0.35); }
	}
</style>
