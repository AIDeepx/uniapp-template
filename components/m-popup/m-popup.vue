<template>
	<view class="m-popup">
		<view class="m-popup__trigger" @click="open">
			<slot />
		</view>
		<view v-if="visible" class="m-popup__mask" @click="close">
			<view class="m-popup__panel" :class="{ 'm-popup__panel--border': border }" @click.stop>
				<view v-if="title || $slots.head" class="m-popup__head">
					<slot name="head">
						<view class="m-popup__title">{{ title }}</view>
						<view class="m-popup__close iconfont" @click.stop="close">&#xe632;</view>
					</slot>
				</view>
				<view class="m-popup__body">
					<slot name="content" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'm-popup',
		zhName: '弹层',
		props: {
			modelValue: { type: Boolean, default: false }, // v-model
			title: { type: String, default: '' },
			disabled: { type: Boolean, default: false },
			border: { type: Boolean, default: true },
		},
		data() {
			return { visible: false }
		},
		watch: { modelValue(val) { this.visible = val } },
		mounted() { this.visible = this.modelValue },
		methods: {
			open() {
				if (this.disabled) return
				this.setVisible(true)
			},
			close() { this.setVisible(false) },
			setVisible(v) {
				this.visible = v
				this.$emit('update:modelValue', v)
				this.$emit('input', v)
				this.$emit('update:value', v)
				this.$emit('change', v)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-popup {
		display: block;
		width: 100%;

		&__trigger {
			width: 100%;
		}

		/* 遮罩使用四边定位而非 100vh，兼容 H5 / 小程序 */
		&__mask {
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			background: $bg-mask;
			z-index: $z-popup;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&__panel {
			width: calc(100% - 64rpx);
			max-height: 80%;
			background: $white;
			border-radius: $radius-md;
			overflow: hidden;
			display: flex;
			flex-direction: column;

			&--border .m-popup__head {
				border-bottom: 1px solid #eef2f6;
			}
		}

		&__head {
			position: relative;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;

			.m-popup__title {
				font-size: 30rpx;
				color: $black;
			}
			.m-popup__close {
				position: absolute;
				right: 32rpx;
				top: 0;
				line-height: 88rpx;
				font-size: 32rpx;
				color: $black9;
			}
		}

		&__body {
			padding: 24rpx 32rpx;
			box-sizing: border-box;
			overflow-y: auto;
		}
	}
</style>
