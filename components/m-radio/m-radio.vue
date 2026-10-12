<template>
	<view class="z-radio" :class="'is-' + direction" @click="check">
		<text :class="{
			'z-radio-icon': true,
			'iconfont': true,
			'is-checked': isChecked,
			'disabled': disabled,
		}">{{isChecked ? '&#xe686;' : '&#xe63b;'}}</text>
		<text class="z-radio-text">
			<slot />
		</text>
	</view>
</template>

<script>
	export default {
		name: 'z-radio',
		props: {
			value: { type: [String, Number], default: '' },
			disabled: {
				type: Boolean,
				default: () => false,
			},
			// 图标位置：left（默认，表单横排）/ right（选择页「文字左 + radio 右」，对齐 m-checkbox）
			direction: { type: String, default: 'left' },
		},
		inject: {
			radioContext: {
				default: undefined
			}
		},
		computed: {
			isChecked() {
				return this.radioContext !== undefined && this.radioContext.value === this.value;
			},
		},
		data() {
			return {

			};
		},
		methods: {
			check() {
				if (this.disabled) return;
				if (this.radioContext) {
					this.radioContext.change(this.value);
				}
			}
		},
	};
</script>

<style lang="scss" scoped>
	.z-radio {
		display: inline-flex;
		align-items: center;
		vertical-align: middle;

		/* direction="right"：图标移到文字右侧（§6.9 选择页） */
		&.is-right {
			.z-radio-text {
				margin-left: 0;
				margin-right: 8rpx;
			}
		}

		.z-radio-icon {
			display: inline-block;
			flex-shrink: 0;
			color: $gray-300;
			font-size: 48rpx;
			line-height: 48rpx;
			&.is-checked {
				color: $color-brand;
			}
			&.disabled {
				color: $text-color-disabled;
			}
		}
		.z-radio-text {
			display: inline-block;
			margin-left: 8rpx;
			font-size: 28rpx;
			line-height: 28rpx;
			color: $text-color-primary;
		}
	}
</style>