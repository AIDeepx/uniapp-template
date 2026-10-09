<template>
	<view class="m-page">
		<slot />
		<view class="m-page__safe"></view>
	</view>
</template>

<script>
	export default {
		name: 'm-page',
		zhName: '页面容器',
	}
</script>

<style lang="scss" scoped>
	/* 页面根容器：自动铺满并预留底部安全区，避免旧版的强制居中与空白 hack */
	.m-page {
		width: 100%;
		min-height: 100%;
		box-sizing: border-box;
		background-color: $pageBg;

		.m-page__safe {
			width: 100%;
			height: env(safe-area-inset-bottom);
		}
	}
</style>
