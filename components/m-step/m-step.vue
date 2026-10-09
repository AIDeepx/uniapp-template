<template>
	<view class="step">
		<view class="step-wrapper">
			<view :class="['step-item', (current-1)==i?'active':'']" v-for="(item, i) in steps" :key="i">
				<view class="title">
					<view class="title">
						<view class="iconfont">{{ i==(steps.length-1)?'&#xe643;':(i+1) }}</view>
					</view>
				</view>
				<view class="desc">{{ item }}</view>
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
			current: { type: Number, default: 1 },
		},
		name: 'm-step',
		data() {
			return {};
		}
	};
</script>

<style lang="scss" scoped>
	$defaultColor: #acbcd2;

	.step {
		.step-wrapper {
			padding: 46rpx 0 44rpx;
			display: flex;
			box-sizing: border-box;
			overflow: hidden;
			justify-content: space-between;

			.step-item {
				flex: 1;

				.title {
					position: relative;
					z-index: 0;

					&::after {
						position: absolute;
						left: calc(50% + 40rpx);
						top: 50%;
						content: '';
						width: calc(100% - 80rpx);
						height: 2px;
						z-index: -1;
						background-color: #ccd7e9;
					}

					.iconfont {
						margin: 0 auto;
						width: 48rpx;
						height: 48rpx;
						line-height: 48rpx;
						border-radius: 50%;
						overflow: hidden;
						text-align: center;
						color: $white;
						background-color: $defaultColor;
					}
				}

				.desc {
					margin-top: 20rpx;
					text-align: center;
					font-size: 24rpx;
					color: $defaultColor;
				}

				&.active {
					.title {
						.iconfont {
							background-color: $blue;
						}
					}

					.desc {
						color: $blue;
					}
				}

				&:last-child {
					.title {
						&::after {
							width: 0;
						}
					}
				}
			}
		}

		.step-content {
			
		}
	}
</style>