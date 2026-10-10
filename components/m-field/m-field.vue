<template>
	<view class="m-field">
		<text class="m-field__required" v-if="required">*</text>
		<view class="m-field__label">{{ title }}</view>
		<view class="m-field__content">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "m-field",
		props: {
			required: { type: Boolean, default: false },
			title: { type: String, default: '' },
		},
	}
</script>

<style lang="scss" scoped>
	.m-field {
		display: flex;
		align-items: center;
		min-height: 88rpx;
		padding: 20rpx 0;
		box-sizing: border-box;
		font-size: $form-value-size;

		&__required {
			flex-shrink: 0;
			margin-right: 8rpx;
			color: $color-error;
			font-size: 28rpx;
			line-height: 1;
		}
		&__label {
			flex-shrink: 0;
			font-size: $form-label-size;
			color: $text-color-secondary;
		}
		&__content {
			flex: 1;
			min-width: 0;
			margin-left: 24rpx;
			text-align: right;
			color: $text-color-primary;
		}
	}
</style>
