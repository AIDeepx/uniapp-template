<template>
	<view class="m-input" :style="{ textAlign }">
		<text v-if="disabled" :class="{ 'm-input__placeholder': !mValue }">{{ mValue || placeholder }}</text>
		<input
			v-else
			class="m-input__control"
			:type="type"
			:value="mValue"
			:placeholder="placeholder"
			:disabled="disabled"
			@input="onInput" />
	</view>
</template>

<script>
	export default {
		name: 'm-input',
		zhName: '输入框',
		props: {
			modelValue: { type: [String, Number], default: '' },
			type: { type: String, default: 'text' },
			placeholder: { type: String, default: '请输入' },
			disabled: { type: Boolean, default: false },
			textAlign: { type: String, default: 'right' },
		},
		inject: { formItemContext: { default: null } },
		data() {
			return { mValue: '' }
		},
		watch: { modelValue(val) { this.mValue = val } },
		mounted() { this.mValue = this.modelValue },
		methods: {
			onInput(e) {
				this.mValue = e.detail.value
				this._emit(this.mValue)
			},
			_emit(v) {
				this.$emit('update:modelValue', v)
				this.$emit('input', v)
				this.$emit('change', v)
				this.$emit('update:value', v)
				if (this.formItemContext) this.formItemContext.setValue(v)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-input {
		width: 100%;
		box-sizing: border-box;
		text-align: right;
		font-size: 30rpx;
		color: $black;
		background-color: $white;

		&__control {
			width: 100%;
			height: 88rpx;
			line-height: 88rpx;
			box-sizing: border-box;
			text-align: inherit;
			font-size: 30rpx;
			color: $black;
		}

		&__placeholder {
			color: $placeholder;
		}
	}
</style>
