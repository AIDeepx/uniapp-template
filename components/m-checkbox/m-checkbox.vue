<template>
	<view :class="{
		checkbox: true,
		'first-child': isFirstChild
	}" @click.stop="doCheck">
		<view class="iconfont" v-if="direction=='left'">{{ mChecked?'&#xe66d;':'&#xe64d;' }}</view>
		<view class="text">
			<slot />
		</view>
		<view class="iconfont right" v-if="direction=='right'">{{ mChecked?'&#xe66d;':'&#xe64d;' }}</view>
	</view>
</template>

<script>
	export default {
		name: 'm-checkbox',
		zhName: '多选框',
		editorVisible: false,
		props: {
			checked: { type: Boolean, default: false },
			value: { type: [String, Number], default: '' },
			direction: { type: String, default: 'left' },
		},
		data() {
			return {
				mChecked: false,
				isFirstChild: false,
			}
		},
		watch: {
			checked(val) {
				this.mChecked = val;
			}
		},
		inject: {
			checkboxGroupContext: {
				default: undefined
			},
		},
		mounted() {
			this.mChecked = this.checked;
			if (this.checkboxGroupContext) {
				this.checkboxGroupContext.setCtx(this);
			}
		},
		beforeUnmount() {
			if (this.checkboxGroupContext) {
				this.checkboxGroupContext.delCtx(this);
			}
		},
		methods: {
			doCheck() {
				this.mChecked = !this.mChecked;
				if (this.checkboxGroupContext) {
					this.checkboxGroupContext.change(this);
					this.$emit('change', this.mChecked);
					this.$emit('update:checked', this.mChecked);
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.checkbox {
		height: 36rpx;
		margin-left: 20rpx;
		display: flex;
		align-items: center;

		&.first-child {
			margin-left: 0;
		}

		.iconfont {
			font-size: 36rpx;
			color: $blue;
			margin-right: 10rpx;

			&.right {
				margin-right: auto;
				margin-left: 10rpx;
			}
		}

		.text {
			color: $black5;
			font-size: 26rpx;
		}
	}
</style>