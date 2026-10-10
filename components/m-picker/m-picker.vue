<template>
	<view class="m-picker">
		<picker
			:value="mIndex"
			:range="range"
			:range-key="rangeText"
			:disabled="disabled"
			@change="onChange">
			<view class="m-picker__content">
				<view class="m-picker__text" v-if="mText">{{ mText }}</view>
				<view class="m-picker__placeholder" v-else>{{ placeholder }}</view>
			</view>
		</picker>
	</view>
</template>

<script>
	export default {
		name: 'm-picker',
		zhName: '下拉选择器',
		props: {
			modelValue: { type: [Number, String], default: '' },
			range: { type: Array, default: () => [] },
			rangeValue: { type: String, default: 'id' },
			rangeText: { type: String, default: 'text' },
			placeholder: { type: String, default: '请选择' },
			disabled: { type: Boolean, default: false },
		},
		inject: { formItemContext: { default: null } },
		data() {
			return { mIndex: 0, mText: '' }
		},
		watch: { modelValue(val) { this.setValue(val) } },
		mounted() { this.setValue(this.modelValue) },
		methods: {
			setValue(val) {
				this.mText = ''
				this.mIndex = 0
				if (val === '' || val === null || val === undefined) return
				const idx = this.range.findIndex((it) => it && it[this.rangeValue] === val)
				if (idx > -1) {
					this.mIndex = idx
					this.mText = this.range[idx][this.rangeText]
				}
			},
			onChange(e) {
				const idx = e.detail.value
				this.mIndex = idx
				const item = this.range[idx]
				this.mText = item ? item[this.rangeText] : ''
				const v = item ? item[this.rangeValue] : ''
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
	.m-picker {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		box-sizing: border-box;
		font-size: $form-value-size;
		color: $text-color-primary;

		&__content {
			text-align: right;
		}
		&__placeholder { color: $text-color-placeholder; }
	}
</style>
