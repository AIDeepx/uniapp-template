<template>
	<view class="m-banner">
			<view class="m-banner__text">
				<view class="m-banner__title"><slot name="title">{{ title }}</slot></view>
				<view v-if="desc || $slots.desc" class="m-banner__desc"><slot name="desc">{{ desc }}</slot></view>
			</view>
			<!-- §6.13 统计数字行 -->
			<view v-if="stats.length || $slots.stats" class="m-banner__stats">
				<slot name="stats">
					<view v-for="(s, i) in stats" :key="i" class="m-banner__stat">
						<text class="m-banner__stat-num">{{ s.value }}</text>
						<text class="m-banner__stat-label">{{ s.label }}</text>
					</view>
				</slot>
			</view>
			<view v-if="$slots.default" class="m-banner__extra"><slot /></view>
		</view>
</template>

<script>
	export default {
		name: 'm-banner',
		props: {
			title: { type: String, default: '' },
			desc: { type: String, default: '' },
			// 统计数字行：[{ value, label }]
			stats: { type: Array, default: () => [] },
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
		/* §6.13 竖向渐变：设计稿为品牌色深→浅两档，本项目取 melon-ui blue-500 → blue-300 */
		background-image: linear-gradient(180deg, $blue-500, $blue-300);
		color: $white;

		&__text {
			min-width: 0;
			flex: 1;
		}
		&__title {
			font-size: 36rpx; // 18px
			font-weight: 600; // Semibold
		}
		&__desc {
			margin-top: 12rpx;
			font-size: 24rpx;
			opacity: 0.85;
		}
		&__stats {
			display: flex;
			flex-shrink: 0;
			margin-left: 24rpx;
		}
		&__stat {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-left: 32rpx;
		}
		&__stat-num {
			font-size: 36rpx;
			font-weight: 600;
			line-height: 1.2;
		}
		&__stat-label {
			margin-top: 4rpx;
			font-size: 22rpx;
			opacity: 0.85;
		}
		&__extra {
			flex-shrink: 0;
			margin-left: 24rpx;
		}
	}
</style>
