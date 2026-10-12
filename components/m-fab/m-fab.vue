<template>
	<view class="m-fab" :class="{ 'is-disabled': disabled, 'is-text': isText }" @click="onClick">
		<text v-if="!text" class="iconfont">{{ icon }}</text>
		<text v-else class="m-fab__text">{{ text }}</text>
	</view>
</template>

<script>
	export default {
		name: 'm-fab',
		props: {
			// 图标字形（iconfont 码），默认加号；传了 text 则走文字模式
			icon: { type: String, default: '&#xe732;' },
			// 文字模式（§6.8 设计稿 FAB 显示「新增 / 添加」二字）
			text: { type: String, default: '' },
			disabled: { type: Boolean, default: false },
		},
		computed: {
			isText() { return !!this.text },
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
		/* 文字模式：缩小为横向胶囊，容纳「新增」二字 */
		&.is-text {
			width: auto;
			min-width: 96rpx;
			height: 72rpx;
			line-height: 72rpx;
			padding: 0 28rpx;
			border-radius: 36rpx;
		}
		&__text {
			font-size: 26rpx; // 13px
			font-weight: 500;
		}
	}
</style>
