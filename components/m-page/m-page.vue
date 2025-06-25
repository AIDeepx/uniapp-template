<template>
	<scroll-view class="z-page" scroll-y>
		<slot />
		<view class="_blank"></view>
	</scroll-view>
</template>

<script>
export default {
	name: 'm-page',
	zhName: '容器'
};
</script>

<style lang="scss" scoped>
.z-page {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
	box-sizing: border-box;
	overflow: hidden;
	._blank {
		width: 100%;
		height: 220rpx;
	}
}
</style>
