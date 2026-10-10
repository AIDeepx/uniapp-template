<template>
	<view class="m-textarea">
		<view class="m-textarea__title" v-if="title">
			<text class="m-textarea__required" v-if="mRequired">*</text>
			<text>{{ title }}</text>
			<text class="m-textarea__desc">{{ desc }}</text>
		</view>
		<textarea
			class="m-textarea__control"
			:value="mValue"
			:placeholder="placeholder"
			:disabled="mDisabled"
			:maxlength="maxlength"
			placeholder-class="m-textarea__placeholder"
			@input="onInput"
			auto-height />
		<view class="m-textarea__counter" v-if="maxlength > 0">{{ (mValue ? mValue.length : 0) }}/{{ maxlength }}</view>
		<view class="m-textarea__readonly" v-if="mReadonly"></view>
	</view>
</template>

<script>
	export default {
		name: 'm-textarea',
		zhName: '文本域',
		props: {
			title: { type: String, default: '' },
			desc: { type: String, default: '' },
			modelValue: { type: String, default: '' },
			placeholder: { type: String, default: '请输入' },
			disabled: { type: Boolean, default: undefined },
			required: { type: Boolean, default: undefined },
			readonly: { type: Boolean, default: undefined },
			maxlength: { type: Number, default: -1 },
		},
		inject: { formItemContext: { default: null } },
		data() { return { mValue: '' } },
		watch: { modelValue(val) { this.mValue = val } },
		mounted() { this.mValue = this.modelValue },
		methods: {
			onInput(e) {
				this.mValue = e.detail.value
				this.$emit('update:modelValue', this.mValue)
				this.$emit('input', this.mValue)
				this.$emit('change', this.mValue)
				this.$emit('update:value', this.mValue)
				if (this.formItemContext) this.formItemContext.setValue(this.mValue)
			},
			_resolve(prop, fallback) {
				if (this[prop] !== undefined) return this[prop]
				if (this.formItemContext && this.formItemContext[prop] !== undefined) return this.formItemContext[prop]
				return fallback
			},
			get mDisabled() { return this._resolve('disabled', false) },
			get mRequired() { return this._resolve('required', false) },
			get mReadonly() { return this._resolve('readonly', false) },
		},
	}
</script>

<style lang="scss" scoped>
	.m-textarea {
		width: 100%;
		position: relative;
		box-sizing: border-box;
		background-color: $white;
		overflow: hidden;

		&__title {
			display: flex;
			align-items: center;
			min-height: 100rpx;
			padding: 0 32rpx;
			box-sizing: border-box;
			font-size: $form-label-size;
			color: $text-color-secondary;
		}
		&__required {
			margin-right: 8rpx;
			color: $color-error;
			font-size: 28rpx;
			line-height: 1;
		}
		&__desc { color: $text-color-tertiary; margin-left: 12rpx; font-size: 24rpx; }

		&__control {
			width: 100%;
			box-sizing: border-box;
			padding: 8rpx 32rpx 16rpx;
			min-height: 120rpx;
			font-size: 28rpx;
			line-height: 44rpx;
			color: $text-color-primary;
		}

		&__counter {
			padding: 0 32rpx 24rpx;
			text-align: right;
			font-size: 24rpx;
			color: $text-color-tertiary;
		}

		&__readonly {
			position: absolute;
			left: 0; top: 0; right: 0; bottom: 0;
			z-index: 2;
		}
	}
</style>

<style lang="scss">
/* placeholder-class 必须是全局类名：scoped 属性会漏掉 H5 端的动态占位节点 */
.m-textarea__placeholder {
	font-size: 28rpx;
	color: $text-color-placeholder;
}
</style>
