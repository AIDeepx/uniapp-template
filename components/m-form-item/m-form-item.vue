<template>
	<view :class="['m-form-item', { 'is-submit': hasButtonType, 'is-error': isError }]" @click="onClick">
		<view class="m-form-item__required" v-if="required"></view>
		<view class="m-form-item__label" :style="{ width: labelWidth + 'rpx' }">{{ label }}</view>
		<view class="m-form-item__content" :style="{ textAlign }">
			<slot />
		</view>
		<view class="m-form-item__arrow iconfont" v-if="arrow">&#xe642;</view>
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
			},
			getValue() { return this.mValue },
			reset() { this.mValue = ''; this.isError = false },
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
		margin-top: 1px;
		padding: 0 32rpx;
		display: flex;
		align-items: center;
		background-color: $white;
		box-sizing: border-box;

		&__required {
			position: relative;
			width: 24rpx;
			height: 24rpx;
			&::after {
				position: absolute;
				top: 0;
				left: 0;
				content: "*";
				color: $red;
				font-size: 36rpx;
			}
		}

		&__arrow {
			margin-left: 10rpx;
			color: #cdd5dc;
			font-size: 26rpx;
			transform: rotate(90deg);
		}

		&__label {
			font-size: 28rpx;
			color: $black;
			box-sizing: border-box;
			flex-shrink: 0;
		}

		&__content {
			flex: 1;
			margin-left: 20rpx;
			min-width: 0;
		}

		&.is-submit {
			background: none;
			.m-form-item__content {
				padding: 110rpx 0;
				box-sizing: border-box;
			}
		}

		&.is-error {
			&::after {
				position: absolute;
				top: 0; left: 0; right: 0; bottom: 0;
				content: '';
				border: 1px solid $red;
				pointer-events: none;
			}
			.m-form-item__label { color: $red; }
		}
	}
</style>
