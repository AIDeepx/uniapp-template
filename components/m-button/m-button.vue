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
			type: { type: String, default: '' }, // '' 主按钮 | 'delete' 危险按钮
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
		line-height: 88rpx;
		font-size: 28rpx;
		border-radius: 44rpx;
		background-color: $blue;
		color: $white;
		text-align: center;
		white-space: nowrap;
		box-sizing: border-box;
		transition: opacity 0.2s ease;

		&.is-block { width: 100%; }
		&:active { opacity: 0.85; }

		&--delete { background-color: $red; }

		&.is-disabled {
			color: $white;
			background-color: $black9;
			&:active { opacity: 1; }
		}

		&.is-ghost {
			background: none;
			border: 1px solid $blue;
			color: $blue;
			&.m-button--delete { border-color: $red; color: $red; }
			&.is-disabled { color: $black9; border-color: $black9; }
		}

		&.is-link {
			background: none;
			color: $blue;
			&.m-button--delete { color: $red; }
			&.is-disabled { color: $black9; }
		}

		&.has-shadow { box-shadow: 0 6rpx 16rpx 0 rgba(82, 146, 255, 0.35); }
	}
</style>
