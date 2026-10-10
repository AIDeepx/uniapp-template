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
	padding: 6rpx 16rpx;
	display: inline-block;
	font-size: 24rpx;
	line-height: 1.4;
	box-sizing: border-box;
	border: 1px solid $blue-200;
	border-radius: 8rpx;
	background-color: $blue-50;
	color: $color-brand;
}
</style>