<template>
	<view :class="['tag', type && type !== 'default' ? 'tag--' + type : '']">
		<slot />
	</view>
</template>

<script>
	export default {
		name: 'm-tag',
		props: {
			/**
			 * 状态语义档（与企业状态语义映射一致）：
			 *  default / primary —— 进行中 / 待审批（蓝）
			 *  success             —— 已审核（绿）
			 *  warning             —— 拒绝（橙）
			 *  error               —— 加急 / 失败（红）
			 */
			type: { type: String, default: 'default' },
		},
	}
</script>

<style lang="scss" scoped>
.tag {
	height: 40rpx;
	line-height: 40rpx;
	padding: 0 16rpx;
	display: inline-block;
	font-size: 24rpx;
	box-sizing: border-box;
	border: 1px solid $blue-200;
	border-radius: $radius-md;
	background-color: $blue-50;
	color: $color-brand;

	&--success {
		border-color: $green-200;
		background-color: $green-50;
		color: $color-success;
	}
	&--warning {
		border-color: $orange-200;
		background-color: $orange-50;
		color: $color-warning;
	}
	&--error {
		border-color: $red-200;
		background-color: $red-50;
		color: $color-error;
	}
}
</style>
