<template>
	<view :class="['tag', type && type !== 'default' ? 'tag--' + type : '', border ? 'has-border' : '']">
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
			 *  info                —— 未发起 / 未开始（灰）
			 */
			type: { type: String, default: 'default' },
			// 是否描边（设计稿 §6.4 为浅底 + 主色字、无边框；默认无描边）
			border: { type: Boolean, default: false },
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
	border-radius: $radius-md;
	background-color: $blue-50;
	color: $color-brand;

	&.has-border {
		border: 1px solid $blue-200;
	}

	&--success {
		background-color: $green-50;
		color: $color-success;
		&.has-border {
			border-color: $green-200;
		}
	}
	&--warning {
		background-color: $orange-50;
		color: $color-warning;
		&.has-border {
			border-color: $orange-200;
		}
	}
	&--error {
		background-color: $red-50;
		color: $color-error;
		&.has-border {
			border-color: $red-200;
		}
	}
	/* 未发起 / 未开始 / 默认：灰档 */
	&--info {
		background-color: $gray-150;
		color: $text-color-tertiary;
		&.has-border {
			border-color: $border-color-base;
		}
	}
}
</style>
