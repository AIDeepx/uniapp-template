<template>
	<view class="m-text-action" :class="['is-' + type, { 'is-disabled': disabled }]" @click="onClick">
		<view v-if="icon === 'plus'" class="m-text-action__icon is-plus"></view>
		<view v-else-if="icon === 'trash'" class="m-text-action__icon is-trash"></view>
		<view v-else-if="icon" class="m-text-action__icon"><slot name="icon"></slot></view>
		<text class="m-text-action__text"><slot></slot></text>
	</view>
</template>

<script>
	export default {
		name: 'm-text-action',
		zhName: '文字操作按钮',
		props: {
			// 语义色：primary 主色（新增/查看）/ danger 警示色（删除）/ default 中性
			type: { type: String, default: 'primary' },
			// 内置图标：plus / trash；其他值走 icon 插槽自定义
			icon: { type: String, default: '' },
			disabled: { type: Boolean, default: false },
		},
		methods: {
			onClick(e) {
				if (this.disabled) return
				this.$emit('click', e)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-text-action {
		display: inline-flex;
		align-items: center;
		font-size: 28rpx; // 14px
		line-height: 1;
		color: $color-brand;

		&.is-danger {
			color: $color-warning;
		}
		&.is-default {
			color: $text-color-secondary;
		}
		&.is-disabled {
			opacity: 0.5;
		}

		&__icon {
			flex-shrink: 0;
			margin-right: 8rpx;

			&.is-plus {
				@include icon-plus(24rpx, 3rpx, $color-brand);
			}
			&.is-trash {
				@include icon-trash(22rpx, 24rpx, $color-warning);
			}
		}
		&.is-danger &__icon.is-plus {
			@include icon-plus(24rpx, 3rpx, $color-warning);
		}

		&__text {
			@include textoverflow;
		}
	}
</style>