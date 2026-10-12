<template>
	<view class="step">
		<view class="step-wrapper">
			<view
				v-for="(item, i) in steps"
				:key="i"
				class="step-item"
				:class="statusOf(i)">
				<view class="step-node">
					<text v-if="statusOf(i) === 'done'" class="iconfont step-check">&#xe643;</text>
					<text v-else class="step-num">{{ i + 1 }}</text>
				</view>
				<view class="step-desc">{{ item }}</view>
			</view>
		</view>
		<view class="step-content">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			steps: { type: Array, default: () => [] },
			// 当前所处步骤（1-based）。i < current-1 为已完成，i === current-1 为当前，其余为未开始
			current: { type: Number, default: 1 },
		},
		name: 'm-step',
		methods: {
			statusOf(i) {
				if (i < this.current - 1) return 'done'
				if (i === this.current - 1) return 'active'
				return 'todo'
			},
		},
	}
</script>

<style lang="scss" scoped>
	.step {
		.step-wrapper {
			position: relative;
			padding: 46rpx 0 44rpx;
			display: flex;
			box-sizing: border-box;
			overflow: hidden;
			justify-content: space-between;
		}

		.step-item {
			position: relative;
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;

			// 连接线：i 步到 i+1 步；已完成段为品牌色，其余为灰
			&::after {
				content: '';
				position: absolute;
				left: calc(50% + 40rpx);
				top: 24rpx; // 圆点中心
				width: calc(100% - 80rpx);
				height: 2px;
				z-index: 0;
				background-color: $gray-200;
			}

			.step-node {
				position: relative;
				z-index: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 48rpx;
				height: 48rpx;
				border-radius: 50%;
				overflow: hidden;
				text-align: center;
				color: $white;
				background-color: $gray-300;
				font-size: 26rpx;

				.step-check {
					font-size: 28rpx;
					line-height: 48rpx;
				}
			}

			.step-desc {
				margin-top: 20rpx;
				text-align: center;
				font-size: 24rpx;
				color: $text-color-tertiary;
			}

			&.done,
			&.active {
				.step-node {
					background-color: $color-brand;
				}
				.step-desc {
					color: $color-brand;
				}
			}

			&.done::after {
				background-color: $color-brand;
			}

			&:last-child::after {
				width: 0;
			}
		}

		.step-content {
			// 业务自定义内容区
		}
	}
</style>
