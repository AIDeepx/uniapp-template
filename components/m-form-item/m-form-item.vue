<template>
	<view :class="['m-form-item', { 'is-submit': hasButtonType, 'is-error': isError }]">
		<view class="m-form-item__row" @click="onClick">
			<view class="m-form-item__required" v-if="required"></view>
			<view class="m-form-item__label" :style="{ width: labelWidth + 'rpx' }">{{ label }}</view>
			<view class="m-form-item__content" :style="{ textAlign }">
				<slot />
			</view>
			<view class="m-form-item__arrow iconfont" v-if="arrow">&#xe642;</view>
		</view>
		<view class="m-form-item__error" v-if="isError && errorMsg">{{ errorMsg }}</view>
	</view>
</template>

<script>
	export default {
		name: 'm-form-item',
		zhName: '表单项',
		props: {
			name: { type: String, default: '' },
			label: { type: String, default: '' },
			labelWidth: { type: Number, default: 180 },
			required: { type: Boolean, default: false },
			// 校验规则：[{ required, message, pattern, validator }]
			rules: { type: Array, default: () => [] },
			disabled: { type: Boolean, default: false },
			readonly: { type: Boolean, default: false },
			arrow: { type: Boolean, default: false },
			textAlign: { type: String, default: 'right' },
		},
		inject: {
			formContext: { default: null }
		},
		provide() {
			return { formItemContext: this }
		},
		data() {
			return {
				hasButtonType: false,
				mValue: '',
				isError: false,
				errorMsg: '',
			}
		},
		mounted() {
			if (this.formContext) this.formContext.register(this)
		},
		beforeUnmount() {
			if (this.formContext) this.formContext.unregister(this.name)
		},
		methods: {
			// 子组件（m-input / m-picker 等）通过 formItemContext.setValue 回写值
			setValue(v) {
				this.mValue = v
				this.isError = false
				this.errorMsg = ''
			},
			getValue() { return this.mValue },
			reset() { this.mValue = ''; this.isError = false; this.errorMsg = '' },
			validate() {
				let valid = true
				let msg = ''
				const empty = this._isEmpty(this.mValue)
				if (this.required && empty) {
					valid = false
					msg = (this.label || this.name) + '不能为空'
				} else if (!empty) {
					for (const rule of this.rules) {
						if (rule.required && this._isEmpty(this.mValue)) { valid = false; msg = rule.message || '必填'; break }
						if (rule.pattern && !rule.pattern.test(this.mValue)) { valid = false; msg = rule.message || '格式不正确'; break }
						if (rule.validator && !rule.validator(this.mValue)) { valid = false; msg = rule.message || '校验失败'; break }
					}
				}
				this.isError = !valid
				this.errorMsg = msg
				return { valid, msg }
			},
			_isEmpty(v) {
				if (v === '' || v === null || v === undefined) return true
				if (Array.isArray(v) && v.length === 0) return true
				if (typeof v === 'object') return JSON.stringify(v) === '{}'
				return false
			},
			onClick(e) { this.$emit('click', e) },
		},
	}
</script>

<style lang="scss" scoped>
	.m-form-item {
		position: relative;
		width: 100%;
		background-color: $form-card-bg;
		box-sizing: border-box;

		&__row {
			display: flex;
			align-items: center;
			min-height: $form-row-min-height;
			padding: 24rpx 32rpx;
			box-sizing: border-box;
			border-bottom: 1px solid $form-divider;
		}
		&:last-child &__row,
		&.is-submit &__row {
			border-bottom: none;
		}

		&__required {
			flex-shrink: 0;
			width: 14rpx;
			color: $color-error;
			font-size: 28rpx;
			line-height: 1;
			&::after {
				content: "*";
			}
		}

		&__arrow {
			margin-left: 12rpx;
			color: $gray-200;
			font-size: 24rpx;
			transform: rotate(90deg);
		}

		&__label {
			flex-shrink: 0;
			font-size: $form-label-size;
			color: $text-color-secondary;
			line-height: 1.4;
		}

		&__content {
			flex: 1;
			min-width: 0;
			margin-left: 24rpx;
			color: $text-color-primary;
			font-size: $form-value-size;
		}

		&.is-submit {
			background: none;
			.m-form-item__content {
				padding: 20rpx 0;
				box-sizing: border-box;
			}
		}

		&.is-error {
			.m-form-item__label { color: $color-error; }
			.m-form-item__row {
				border-bottom-color: $color-error;
			}
			.m-form-item__error {
				padding: 0 32rpx 20rpx;
				font-size: 24rpx;
				line-height: 1.4;
				color: $color-error;
				text-align: left;
			}
		}
	}
</style>
