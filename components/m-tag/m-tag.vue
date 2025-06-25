<template>
	<view class="tag">
		<slot />
	</view>
</template>

<script>
	export default {
		name:"m-tag",
	}
</script>

<style lang="scss" scoped>
.tag {
	padding: 6rpx 12rpx;
	display: inline-block;
	font-size: 24rpx;
	line-height: 24rpx;
	box-sizing: border-box;
	border: 1px solid $blue;
	border-radius: 8rpx;
	color: $blue;
}
</style>