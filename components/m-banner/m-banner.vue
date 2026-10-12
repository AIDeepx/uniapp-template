<template>
	<view class="m-banner">
		<view class="m-banner__text">
			<view class="m-banner__title"><slot name="title">{{ title }}</slot></view>
			<view v-if="desc || $slots.desc" class="m-banner__desc"><slot name="desc">{{ desc }}</slot></view>
		</view>
		<view class="m-banner__extra"><slot /></view>
	</view>
</template>

<script>
	export default {
		name: 'm-banner',
		props: {
			title: { type: String, default: '' },
			desc: { type: String, default: '' },
		},
	}
</script>

<style lang="scss" scoped>
	.m-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40rpx 32rpx;
		border-radius: $radius-lg;
		background: linear-gradient(135deg, $blue-500, $blue-300);
		color: $white;

		&__title {
			font-size: 32rpx;
			font-weight: 500;
		}
		&__desc {
			margin-top: 12rpx;
			font-size: 24rpx;
			opacity: 0.85;
		}
		&__extra {
			flex-shrink: 0;
			margin-left: 24rpx;
		}
	}
</style>
