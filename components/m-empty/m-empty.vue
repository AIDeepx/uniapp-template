<template>
	<view class="m-empty">
		<view class="m-empty__icon">
			<text v-if="icon" class="iconfont">{{ icon }}</text>
			<view v-else class="m-empty__placeholder"></view>
		</view>
		<view v-if="text || $slots.default" class="m-empty__text"><slot>{{ text }}</slot></view>
		<view v-if="$slots.extra" class="m-empty__extra"><slot name="extra" /></view>
	</view>
</template>

<script>
	export default {
		name: 'm-empty',
		props: {
			// 可传 iconfont 字形码；不传则用 CSS 绘制的占位圆
			icon: { type: String, default: '' },
			text: { type: String, default: '暂无数据' },
		},
	}
</script>

<style lang="scss" scoped>
	.m-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 80rpx 40rpx;

		&__icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 120rpx;
			height: 120rpx;
		}
		&__placeholder {
			width: 96rpx;
			height: 96rpx;
			border-radius: 50%;
			border: 4rpx solid $gray-200;
		}
		&__text {
			margin-top: 24rpx;
			font-size: 26rpx;
			color: $text-color-tertiary;
		}
		&__extra {
			margin-top: 32rpx;
		}
	}
</style>
