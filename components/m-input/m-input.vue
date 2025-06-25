<template>
	<view class="z-input">
		<text v-if="disabled" :class="{placeholder: !mValue}" :style="{textAlign}">{{mValue || placeholder }}</text>
		<input v-if="!disabled" class="input" :style="{textAlign}" :type="type" v-model="mValue" @input="setValue" :placeholder="placeholder" />
	</view>
</template>

<script>
	export default {
		name: "m-input",
		zhName: '输入框',
		props: {
			value: {
				type: String | Number,
				default: () => "",
			},
			type: {
				type: String,
				default: () => "text",
			},
			placeholder: {
				type: String,
				default: () => "请输入",
			},
			disabled: {
				type: Boolean,
				default: () => false,
			},
			textAlign: {
				type: String,
				default: () => "right",
			},
		},
		model: {
			prop: 'value',
			event: 'change'
		},
		data() {
			return {
				mValue: '',
			};
		},
		mounted() {
			this.mValue = this.value;
		},
		watch: {
			value(val) {
				this.mValue = val;
			},
		},
		methods: {
			setValue(e) {
				this.mValue = e.detail.value;
				this.$emit('update:value', e.detail.value);
				this.$emit('change', e.detail.value);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.z-input {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		box-sizing: border-box;
		text-align: right;
		font-size: 30rpx;
		background-color: $white;

		.input {
			width: inherit;
			height: 88rpx;
			line-height: 88rpx;
			box-sizing: border-box;
			text-align: right;
			font-size: 30rpx;
		}

		.placeholder {
			color: #CDD5DC;
		}
	}
</style>