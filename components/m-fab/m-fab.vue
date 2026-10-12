<template>
	<view class="m-fab" :class="{ 'is-disabled': disabled }" @click="onClick">
		<text class="iconfont">{{ icon }}</text>
	</view>
</template>

<script>
	export default {
		name: 'm-fab',
		props: {
			// 图标字形（iconfont 码），默认加号
			icon: { type: String, default: '&#xe732;' },
			disabled: { type: Boolean, default: false },
		},
		methods: {
			onClick() {
				if (this.disabled) return
				this.$emit('click')
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-fab {
		position: fixed;
		right: 40rpx;
		bottom: 60rpx;
		width: 96rpx;
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
		border-radius: 50%;
		background-color: $color-brand;
		color: $white;
		font-size: 48rpx;
		box-shadow: 0 8rpx 24rpx rgba($color-brand, 0.35);
		z-index: 90;

		&:active {
			background-color: $color-brand-active;
		}
		&.is-disabled {
			background-color: $gray-300;
			box-shadow: none;
		}
	}
</style>
