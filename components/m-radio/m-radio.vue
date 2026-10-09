<template>
	<view class="z-radio" @click="check">
		<text :class="{
			'z-radio-icon': true,
			'iconfont': true,
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
		vertical-align: middle;
		.z-radio-icon {
			display: inline-block;
			color: $blue;
			font-size: 30rpx;
			line-height: 30rpx;
			&.disabled {
				color: $black9;
			}
		}
		.z-radio-text {
			display: inline-block;
			margin-left: 6rpx;
			font-size: 28rpx;
			line-height: 28rpx;
		}
	}
</style>