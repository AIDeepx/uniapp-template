<template>
	<view class="m-result">
		<view :class="['m-result__icon', 'is-' + type]">
			<text class="m-result__symbol">{{ symbolMap[type] || symbolMap.success }}</text>
		</view>
		<view v-if="title" class="m-result__title">{{ title }}</view>
		<view v-if="desc || $slots.default" class="m-result__desc"><slot>{{ desc }}</slot></view>
		<view v-if="$slots.extra" class="m-result__extra"><slot name="extra" /></view>
	</view>
</template>

<script>
	// 状态符号用 Unicode 文本（字体无关，绝不会出现"豆腐块"）
	const SYMBOLS = {
		success: '✓',
		error: '✕',
		warning: '!',
		info: 'i',
	}
	export default {
		name: 'm-result',
		props: {
			// 结果类型：success 成功(绿) / error 失败(红) / warning 警告(橙) / info 提示(蓝)
			type: { type: String, default: 'success' },
			title: { type: String, default: '' },
			desc: { type: String, default: '' },
		},
		data() {
			return { symbolMap: SYMBOLS }
		},
	}
</script>

<style lang="scss" scoped>
	.m-result {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 80rpx 40rpx;

		&__icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 144rpx; // §6.15 72px
			height: 144rpx;
			border-radius: 50%;

			&.is-success {
				background: rgba($color-success, 0.12);
			}
			&.is-error {
				background: rgba($color-error, 0.12);
			}
			&.is-warning {
				background: rgba($color-warning, 0.12);
			}
			&.is-info {
				background: rgba($color-brand, 0.12);
			}
		}
		&__symbol {
			font-size: 72rpx; // 随 144rpx 圆放大
			font-weight: bold;
			line-height: 1;

			.is-success & {
				color: $color-success;
			}
			.is-error & {
				color: $color-error;
			}
			.is-warning & {
				color: $color-warning;
			}
			.is-info & {
				color: $color-brand;
			}
		}
		&__title {
			margin-top: 32rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: $text-color-primary;
		}
		&__desc {
			margin-top: 16rpx;
			font-size: 26rpx;
			color: $text-color-tertiary;
			text-align: center;
		}
		&__extra {
			margin-top: 40rpx;
		}
	}
</style>
