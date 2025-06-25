<template>
	<view class="radio-group">
		<slot v-if="options.length < 1" />
		<view class="radio-item" v-for="(item, i) in options" :key="i">
			<m-radio :value="item.value" :disabled="disabled">{{item.text}}</m-radio>
		</view>
	</view>
</template>

<script>
	export default {
		name: "m-radio-group",
		props: {
			value: "",
			options: {
				type: Array,
				default: () => [],
			},
			disabled: {
				type: Boolean,
				default: () => false,
			},
		},
		provide() {
			return {
				radioContext: this,
			};
		},
		data() {
			return {

			};
		},
		methods: {
			change(e) {
				this.$emit('update:value', e);
				this.$emit('change', e);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.radio-group {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 100rpx;
		line-height: 100rpx;

		.radio-item {
			margin-left: 32rpx;
			&:first-child {
				margin-left: 0;
			}
		}
	}
</style>