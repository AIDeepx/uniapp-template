<template>
	<view class="m-option-list" :class="variant === 'plain' ? 'is-plain' : ''">
		<view
			v-for="(row, i) in data"
			:key="keyOf(row, i)"
			class="m-option-list__item"
			:class="{ 'has-divider': divider && variant !== 'card' && i > 0, 'is-active': isSelected(row, i) }"
			hover-class="m-option-list__item--hover"
			@click="onSelect(row, i)">
			<!-- 行内容：默认「主文案 + 副文案 + 角标」，可用 item 插槽完全自定义 -->
			<slot name="item" :row="row" :index="i" :selected="isSelected(row, i)">
				<view class="m-option-list__main">
					<text class="m-option-list__text">{{ textOf(row) }}</text>
					<text class="m-option-list__sub" v-if="subOf(row)">{{ subOf(row) }}</text>
				</view>
				<text class="m-option-list__badge" v-if="badgeOf(row)">{{ badgeOf(row) }}</text>
			</slot>

			<!-- 右侧指示器：radio / checkbox / arrow / none，可用 indicator 插槽自定义 -->
			<slot name="indicator" :row="row" :selected="isSelected(row, i)">
				<view
					v-if="indicator === 'radio' || indicator === 'checkbox'"
					class="m-option-list__mark"
					:class="[{ 'is-checked': isSelected(row, i) }, indicator === 'checkbox' ? 'is-square' : '']"></view>
				<view v-else-if="indicator === 'arrow'" class="m-option-list__arrow"></view>
			</slot>
		</view>

		<view v-if="!data.length" class="m-option-list__empty">{{ emptyText }}</view>
	</view>
</template>

<script>
	export default {
		name: 'm-option-list',
		zhName: '选项列表',
		props: {
			// 行数据：[{ id, text, sub, badge }]
			data: { type: Array, default: () => [] },
			// 单选传值（mode=single）/ 多选传数组（mode=multiple），支持 v-model:value
			value: { type: [String, Number, Array], default: '' },
			mode: { type: String, default: 'single' },
			// 取值字段；为空则用行索引
			valueKey: { type: String, default: 'id' },
			// 主 / 副 / 角标 文案字段
			textKey: { type: String, default: 'text' },
			subKey: { type: String, default: 'sub' },
			badgeKey: { type: String, default: 'badge' },
			// 右侧指示器：radio / checkbox / arrow / none
			indicator: { type: String, default: 'radio' },
			// 容器形态：card 单张白卡内分隔线（默认）/ plain 各自独立 / card 每行独立白卡
			variant: { type: String, default: 'card' },
			divider: { type: Boolean, default: true },
			readonly: { type: Boolean, default: false },
			emptyText: { type: String, default: '暂无选项' },
		},
		methods: {
			keyOf(row, i) {
				return this.valueKey ? row[this.valueKey] : i
			},
			textOf(row) {
				return this.textKey ? row[this.textKey] : ''
			},
			subOf(row) {
				return this.subKey ? row[this.subKey] : ''
			},
			badgeOf(row) {
				return this.badgeKey ? row[this.badgeKey] : ''
			},
			isSelected(row, i) {
				const key = this.keyOf(row, i)
				if (this.mode === 'multiple') {
					return Array.isArray(this.value) && this.value.some((v) => String(v) === String(key))
				}
				return String(key) === String(this.value)
			},
			onSelect(row, i) {
				if (this.readonly) return
				const key = this.keyOf(row, i)
				let next = key
				if (this.mode === 'multiple') {
					const cur = Array.isArray(this.value) ? this.value.slice() : []
					const idx = cur.findIndex((v) => String(v) === String(key))
					if (idx > -1) cur.splice(idx, 1)
					else cur.push(key)
					next = cur
				}
				this.$emit('input', next)
				this.$emit('update:value', next)
				this.$emit('change', next, row, i)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-option-list {
		overflow: hidden;
		border-radius: $radius-lg;
		background-color: $bg-color-container;

		/* plain：行各自独立白卡，间距 12px */
		&.is-plain {
			overflow: visible;
			background-color: transparent;

			.m-option-list__item {
				border-radius: $radius-lg;
				background-color: $bg-color-container;
			}
			.m-option-list__item + .m-option-list__item {
				margin-top: 24rpx;
			}
		}

		&__item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			min-height: 96rpx;
			padding: 16rpx 32rpx;
			box-sizing: border-box;

			&.has-divider {
				border-top: 1px solid $divider-color;
			}

			&--hover {
				background-color: $bg-color-base;
			}

			/* 卡片式选中态：品牌描边（plain 形态才描边，行内形态靠指示器表达） */
			&.is-active {
				.is-plain & {
					border: 2rpx solid $color-brand;
				}
			}
		}

		&__main {
			display: flex;
			align-items: baseline;
			flex: 1;
			min-width: 0;
		}

		&__text {
			@include textoverflow;
			font-size: 30rpx; // 15px
			color: $text-color-primary;
		}

		&__sub {
			@include textoverflow;
			margin-left: 16rpx;
			font-size: 24rpx;
			color: $text-color-tertiary;
		}

		// 浅底角标（如「当前」）
		&__badge {
			flex-shrink: 0;
			height: 40rpx;
			line-height: 40rpx;
			margin-left: 16rpx;
			padding: 0 12rpx;
			box-sizing: border-box;
			font-size: 22rpx;
			border-radius: $radius-sm;
			background-color: $color-brand-light;
			color: $color-brand;
		}

		// 选中指示器（radio / checkbox 共用原子 mixin）
		&__mark {
			@include indicator(48rpx);

			flex-shrink: 0;
			margin-left: 24rpx;

			&.is-square {
				border-radius: $radius-xs;
			}
			&.is-checked {
				@include indicator-on(48rpx);
			}
		}

		&__arrow {
			@include icon-arrow(16rpx, 3rpx, $gray-300);

			margin-left: 24rpx;
		}

		&__empty {
			padding: 80rpx 0;
			text-align: center;
			font-size: 26rpx;
			color: $text-color-tertiary;
		}
	}
</style>