<template>
	<view class="m-space" :style="{ width: width, height: height }"></view>
</template>

<script>
export default {
	name: 'm-space',
	props: {
		width: {
			type: String,
			default: () => "100%",
		},
		height: {
			type: String,
			default: () => "24rpx",
		},
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>
.m-space {
}
</style>
