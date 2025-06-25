<template>
	<view class="z-space" :style="{ width: width, height: height }"></view>
</template>

<script>
export default {
	name: 'z-space',
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
.z-space {
}
</style>
