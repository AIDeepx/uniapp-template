<template>
	<view class="m-desc-list">
		<template v-for="(row, i) in data">
			<slot name="row" :row="row" :index="i">
				<view
					class="m-desc-list__row"
					:class="{ 'has-divider': divider && i > 0 }"
					:style="{ minHeight: rowHeight + 'rpx' }"
					@click="$emit('row-click', row, i)">
					<text class="m-desc-list__label" :style="labelWidth ? { width: labelWidth + 'rpx' } : null">{{ row.label }}</text>
					<text class="m-desc-list__value">{{ row.text }}</text>
				</view>
			</slot>
		</template>
		<view v-if="!data.length" class="m-desc-list__empty">{{ emptyText }}</view>
	</view>
</template>

<script>
	export default {
		name: 'm-desc-list',
		zhName: '描述列表',
		props: {
			// 行数据：[{ label, text }]
			data: { type: Array, default: () => [] },
			// 标签列固定宽度（rpx），0 表示自适应
			labelWidth: { type: Number, default: 0 },
			// 行高（rpx）
			rowHeight: { type: Number, default: 88 },
			// 行间 1px 分隔线
			divider: { type: Boolean, default: true },
			emptyText: { type: String, default: '暂无信息' },
		},
	}
</script>

<style lang="scss" scoped>
	.m-desc-list {
		/* 上下内边距对称：避免末行贴底 / 底部异常留白 */
		padding: 12rpx 0;
		box-sizing: border-box;
		border-radius: $radius-lg;
		background-color: $bg-color-container;

		&__row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 32rpx;
			box-sizing: border-box;

			&.has-divider {
				border-top: 1px solid $divider-color;
			}
		}

		&__label {
			flex-shrink: 0;
			margin-right: 24rpx;
			font-size: 28rpx; // 14px
			line-height: 1.4;
			color: $text-color-secondary;
		}

		&__value {
			flex: 1;
			min-width: 0;
			font-size: 28rpx;
			font-weight: 500; // Medium
			line-height: 1.4;
			color: $text-color-primary;
			text-align: right;
		}

		&__empty {
			padding: 40rpx 0;
			text-align: center;
			font-size: 26rpx;
			color: $text-color-tertiary;
		}
	}
</style>