<template>
	<view :class="{'popup': true, 'border': border}" @click="open">
		<slot />
		<view class="popup-overlay" @click.stop v-if="mValue">
			<view class="popup-content">
				<view class="popup-head">
					<view class="popup-title">{{title}}</view>
					<view class="popup-close iconfont" @click="close">&#xe632;</view>
				</view>
				<slot name="content" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "m-popup",
		props: {
			value: {
				type: Boolean,
				default: () => false,
			},
			title: {
				type: String,
				default: () => "",
			},
			disabled: {
				type: Boolean,
				default: () => false,
			},
			border: {
				type: Boolean,
				default: () => true,
			}
		},
		data() {
			return {
				mValue: false,
			};
		},
		watch: {
			value(val) {
				this.mValue = val;
			},
		},
		mounted() {
			this.mValue = this.value;
		},
		methods: {
			open() {
				if (this.disabled) return;
				this.mValue = true;
				this.$emit('update:value', true);
				this.$emit('change', true);
			},
			close() {
				this.mValue = false;
				this.$emit('update:value', false);
				this.$emit('change', false);
			},
		},
	}
</script>

<style lang="scss" scoped>
	.popup {
		.popup-overlay {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh;
			overflow: hidden;
			z-index: 998;
			background-color: rgba(0, 0, 0, 0.8);

			.popup-head {
				position: relative;
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;

				.popup-close {
					position: absolute;
					right: 32rpx;
					top: 0;
					line-height: 88rpx;
					font-size: 28rpx;
					color: $black9;
				}
			}

			.popup-content {
				position: absolute;
				top: 50%;
				left: 50%;
				width: calc(100% - 64rpx);
				max-height: calc(100% - 88rpx);
				min-height: 0;
				border-radius: 12rpx;
				background-color: #fff;
				overflow: hidden;
				z-index: 999;
				transform: translate(-50%, -50%);
			}
		}
	
		&.border {
			.popup-overlay {
				.popup-head {
					&::after {
						position: absolute;
						bottom: 0;
						left: 0;
						content: "";
						width: 100%;
						height: 1px;
						background-color: #BFC9D7;
					}
				}
			}
		}
	}
</style>