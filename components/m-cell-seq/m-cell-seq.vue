<template>
	<view class="m-cell-seq" :class="[{ 'is-disabled': disabled }, 'is-' + direction]">
		<!-- 格子行 -->
		<view class="m-cell-seq__row">
			<view
				v-for="i in count"
				:key="'c' + i"
				class="m-cell-seq__cell"
				:class="{ 'is-active': isActive(i - 1), 'is-off': isOff(i - 1) }"
				hover-class="m-cell-seq__cell--hover"
				@click="onCellClick(i - 1)" />
		</view>

		<!-- 刻度标签：true 用序号，数组用自定义文案，不传则不显示 -->
		<view v-if="labels" class="m-cell-seq__labels">
			<text
				v-for="i in count"
				:key="'l' + i"
				class="m-cell-seq__label"
				:class="{ 'is-active': isActive(i - 1), 'is-off': isOff(i - 1) }">{{ labelAt(i - 1) }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'm-cell-seq',
		zhName: '格子序列',
		props: {
			// 格子总数
			count: { type: Number, default: 0 },
			// 激活态索引（0-based）。注意是相对 count 的下标，不是刻度文字：
			//   座位 7~23 的车 → count=17, start=7, active=[0,1,2] 表示 7/8/9 号被占
			//   若后端直接给座位号数组，请自行减 start 换算，或用 labels 数组对齐刻度
			activeList: { type: Array, default: () => [] },
			// 失效态索引（如已售/不可用），优先级高于激活态
			offList: { type: Array, default: () => [] },
			// 刻度标签：true 用序号（1..count），数组用自定义文案，false/不传不显示
			labels: { type: [Boolean, Array], default: false },
			// 标签起始值（labels=true 时生效）
			start: { type: Number, default: 1 },
			// 整体禁用（如维修中车辆：全灰且不可点）
			disabled: { type: Boolean, default: false },
			// 排列方向
			direction: { type: String, default: 'horizontal' },
		},
		methods: {
			isActive(i) {
				return this.activeList.indexOf(i) > -1
			},
			isOff(i) {
				return this.offList.indexOf(i) > -1
			},
			labelAt(i) {
				if (Array.isArray(this.labels)) return this.labels[i] === undefined ? '' : this.labels[i]
				return this.start + i
			},
			onCellClick(i) {
				if (this.disabled) return
				this.$emit('item-click', i, this.isActive(i))
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-cell-seq {
		/* 等宽铺满：格子 flex:1，序列宽度自适应容器 */
		&__row {
			display: flex;
			box-sizing: border-box;
		}

		&__cell {
			@include cell-bar;

			flex: 1;
			min-width: 0;
			margin: 0 2rpx;

			&:first-child {
				margin-left: 0;
			}
			&:last-child {
				margin-right: 0;
			}

			&.is-active {
				@include cell-bar(36rpx, 2rpx, $color-brand);
			}
			/* 失效态：更浅的灰，与激活态拉开层次 */
			&.is-off {
				@include cell-bar(36rpx, 2rpx, $gray-150);
				opacity: 0.5;
			}

			&--hover {
				opacity: 0.7;
			}
		}

		/* 刻度标签与格子一一等宽对齐 */
		&__labels {
			display: flex;
			margin-top: 12rpx;
		}

		&__label {
			flex: 1;
			min-width: 0;
			margin: 0 2rpx;
			overflow: hidden;
			white-space: nowrap;
			text-align: center;
			font-size: 20rpx;
			line-height: 1;
			color: $text-color-tertiary;

			&:first-child {
				margin-left: 0;
			}
			&:last-child {
				margin-right: 0;
			}

			&.is-active {
				color: $color-brand;
			}
			&.is-off {
				color: $text-color-placeholder;
			}
		}

		/* 整体禁用：全部回落为空闲灰 */
		&.is-disabled {
			.m-cell-seq__cell.is-active {
				@include cell-bar(36rpx, 2rpx, $gray-150);
			}
			.m-cell-seq__label.is-active {
				color: $text-color-tertiary;
			}
		}

		/* 纵向排列：格子横向排布改为纵向堆叠 */
		&.is-vertical {
			.m-cell-seq__row {
				flex-direction: column;
			}
			.m-cell-seq__cell {
				width: 100%;
				margin: 0 0 8rpx;
			}
			.m-cell-seq__labels {
				flex-direction: column;
				margin-top: 0;
				margin-left: 16rpx;
			}
			.m-cell-seq__label {
				margin: 0 0 8rpx;
				text-align: left;
			}
		}
	}
</style>