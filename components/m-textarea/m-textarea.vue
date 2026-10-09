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
			placeholder-style="font-size:28rpx;color:#AEB8C0;"
			@input="onInput"
			auto-height />
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

		&::before,
		&::after {
			position: absolute;
			top: 0; left: 0;
			width: 100%; height: 1px;
			content: '';
			background-color: $pageBg;
		}
		&::after { top: auto; bottom: 0; }

		&__title {
			height: 100rpx;
			line-height: 100rpx;
			font-size: 28rpx;
			padding: 0 32rpx;
			box-sizing: border-box;
		}
		&__required {
			margin-right: 10rpx;
			color: $orange;
			font-size: 36rpx;
		}
		&__desc { color: #aeb8c0; margin-left: 12rpx; }

		&__control {
			width: 100%;
			box-sizing: border-box;
			padding: 0 32rpx 30rpx;
			font-size: 28rpx;
			line-height: 40rpx;
			color: $black;
		}

		&__readonly {
			position: absolute;
			left: 0; top: 0; right: 0; bottom: 0;
			z-index: 2;
		}
	}
</style>
