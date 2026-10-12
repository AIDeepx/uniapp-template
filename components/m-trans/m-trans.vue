<template>
	<view class="zfui-trans" v-if="trans.length > 0">
		<view class="trans-title">{{ title }}</view>
		<view :class="['trans-tree', i == trans.length - 1 ? 'active' : '']" v-for="(item, i) in trans" :key="i">
			<view class="trans-datetime">
				<view :class="['trans-time', i == trans.length - 1 ? 'trans-now' : '']">{{ item.D_TransactionBegin.split(' ')[0] }}</view>
				<view :class="['trans-time', i == trans.length - 1 ? 'trans-now' : '']">{{ item.D_TransactionBegin.split(' ')[1] }}</view>
			</view>
			<view class="trans-progress"></view>
			<view class="trans-info">
				<view class="trans-info-head">
					<view :class="['trans-position', i == trans.length - 1 ? '' : 'old']">{{ item.C_QueueName }}</view>
					<!-- §6.19 当前节点旁挂「办理中」标签：浅橙底 + 橙字 -->
					<text v-if="i == trans.length - 1" class="trans-doing">办理中</text>
				</view>
				<view class="trans-info-content">
					<view class="trans-info-content--name">{{ item.blr || '' }}</view>
					<view v-if="i != 0" :class="['trans-info-content--status', item.action == '同意' ? 'info' : 'error']">{{ item.action }}</view>
				</view>
				<view class="trans-info-reason" v-show="item.C_TransactionComment">理由：{{ item.C_TransactionComment }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'z-trans',
	zhName: '审批流轴',
	props: {
		// 业务单据 id；为空时不发起请求（组件仅渲染已有数据）
		bid: { type: [String, Number], default: '' },
		// 可选：外部直接灌入审批流数据，便于在无后端环境展示
		data: { type: Array, default: () => [] },
		// 卡片标题（§6.19 审批进度 / 审批进程）
		title: { type: String, default: '审批进程' },
	},
	mounted() {
		if (this.data && this.data.length) this.trans = this.data;
		else this.getTrans(this.bid);
	},
	watch: {
		bid(val) {
			this.getTrans(val);
		},
		data(v) {
			this.trans = v || [];
		},
	},
	data() {
		return {
			trans: [],
		};
	},
	methods: {
		getTrans(bid) {
			if (!bid) return;
			// 依赖业务侧接口，未配置时静默跳过，避免 demo/模板环境报错
			const url = this.api && this.api.Process && this.api.Process.GetTransBybId;
			if (!url) return;
			this.util.GET({
				url,
				data: {
					bid: bid
				},
				success: async info => {
					this.trans = (info && info.trans) || [];
				}
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.zfui-trans {
	/* §6.19 白卡 8px 圆角包裹 */
		margin-top: 24rpx;
	padding: 28rpx 32rpx;
	box-sizing: border-box;
	border-radius: $radius-lg;
	background-color: $white;
	.trans-title {
		font-size: 30rpx;
		color: $text-color-primary;
		font-weight: 600; // Semibold
	}
	.trans-tree {
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
		.trans-datetime {
			/* §6.19 时间戳列宽 66px → 132rpx，右对齐 */
			width: 132rpx;
			flex-shrink: 0;
			font-size: 22rpx;
			color: $black9;
			text-align: right;
			.trans-time {
				margin-top: 20rpx;
			}
			.trans-now {
				font-size: 22rpx;
				color: $color-brand;
			}
		}
		.trans-progress {
			width: 48rpx;
			flex-shrink: 0;
			position: relative;
			&::before {
				position: absolute;
				top: 6rpx;
				left: 50%;
				/* §6.19 节点圆点 12px → 24rpx */
				width: 24rpx;
				height: 24rpx;
				margin-left: -12rpx;
				border-radius: 50%;
				content: '';
				background-color: $border-color-base;
			}
			&::after {
				position: absolute;
				top: 32rpx;
				left: 50%;
				width: 1px;
				height: calc(100% + 20rpx);
				content: '';
				background-color: $border-color-base;
			}
		}
		&:last-child {
			.trans-progress {
				&::after {
					height: 0;
				}
			}
		}
		&.active {
			.trans-progress {
				&::before {
					background-color: $color-brand;
				}
			}
		}
		&.compelete {
			.trans-progress {
				&::before {
					width: 26rpx;
					height: 26rpx;
					background-color: $color-success;
					margin-left: -13rpx;
				}
			}
		}
		.trans-info {
			flex: 1;
			min-width: 0;
			.trans-info-head {
				display: flex;
				align-items: center;
				margin-bottom: 10rpx;
			}
			.trans-position {
				font-size: 24rpx;
				color: $color-brand;
				&.old {
					color: $black5;
				}
			}
			/* §6.19「办理中」标签：浅橙底 + 橙字，4px 圆角，高 20px */
			.trans-doing {
				margin-left: 12rpx;
				padding: 0 12rpx;
				height: 40rpx;
				line-height: 40rpx;
				border-radius: $radius-md;
				font-size: 22rpx;
				color: $color-warning;
				background-color: $orange-50;
			}
			.trans-info-content {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				.trans-info-content--name {
					font-size: 28rpx;
					color: $text-color-primary;
				}
				.trans-info-content--status {
					margin-left: 20rpx;
					padding: 4rpx 10rpx;
					border-radius: 8rpx;
					font-size: 24rpx;
					&.info {
						color: $color-brand;
						background-color: $color-brand-light;
					}
					&.error {
						color: $color-warning;
						background-color: $orange-50;
					}
				}
			}
			.trans-info-status {
				margin-top: 16rpx;
				font-size: 24rpx;
				color: $text-color-secondary;
			}
			.trans-info-reason {
				margin-top: 24rpx;
				font-size: 20rpx;
				color: $text-color-tertiary;
			}
			.trans-complete {
				font-size: 24rpx;
				color: $color-success;
			}
		}
	}
}
</style>
