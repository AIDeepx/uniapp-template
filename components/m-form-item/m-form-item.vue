<template>
	<view :class="{'form-item': true, 'btn-submit': hasButtonType}" @click="onclick">
		<view class="required" v-if="required"></view>
		<view class="label">{{ label }}</view>
		<view class="content">
			<slot></slot>
		</view>
		<view class="arrow iconfont" v-if="arrow">&#xe642;</view>
	</view>
</template>

<script>
	export default {
		name: 'm-form-item',
		zhName: '表单控件',
		props: {
			name: {
				type: String,
				default: () => ''
			},
			label: {
				type: String,
				default: () => ''
			},
			labelWidth: {
				type: Number,
				default: () => 70
			},
			textAlign: {
				type: String,
				default: () => 'left'
			},
			arrow: {
				type: Boolean,
				default: () => false
			},
		},
		inject: {
			formContext: {
				default: undefined
			}
		},
		provide() {
			return {
				formItemContext: this,
			};
		},
		data() {
			return {
				hasButtonType: false,
			}
		},
		methods: {
			onclick(e) {
				this.$emit('click',e);
			},
			toJSON() {}
		}
	};
</script>

<style lang="scss" scoped>
	.form-item {
		position: relative;
		width: 100%;
		margin-top: 1px;
		padding: 0 32rpx;
		display: flex;
		align-items: center;
		background-color: $white;
		box-sizing: border-box;

		.required {
			position: relative;
			width: 24rpx;
			height: 24rpx;
			&::after {
				position: absolute;
				top: 0;
				left: 0;
				content: "*";
				color: $red;
				font-size: 36rpx;
			}
		}

		.arrow {
			margin-left: 10rpx;
			color: #cdd5dc;
			font-size: 26rpx;
			transform: rotate(90deg);
		}

		.label {
			font-size: 28rpx;
			box-sizing: border-box;
		}

		.content {
			flex: 1;
			margin-left: 20rpx;
		}

		&.btn-submit {
			background: none;
			.content {
				padding: 110rpx 0;
				box-sizing: border-box;
			}
		}

		&.error {
			&::after {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				content: '';
				border: 1px solid $red;
				pointer-events: none;
			}

			.label {
				color: $red;
			}
		}
	}
</style>