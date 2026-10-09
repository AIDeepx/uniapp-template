<template>
	<view class="m-page-list">
		<m-search v-if="hasCondition" :value="search.value" :data="search.data" @change="change($event, 'search')"></m-search>
		<slot></slot>
		<view class="m-page-list__add iconfont" v-if="addUrl" @click="jump(addUrl)">&#xe62e;</view>
	</view>
</template>

<script>
	export default {
		name: 'm-page-list',
		props: {
			search: {
				type: Object,
				default: () => ({ visible: false, value: {}, data: [] }),
			},
			addUrl: { type: String, default: '' },
		},
		computed: {
			hasCondition() { return this.search && this.search.visible },
		},
		methods: {
			change(event, eventName) {
				// 修正旧版 this.$event 误用，正确冒泡事件
				this.$emit(eventName, event)
			},
			jump(url) { this.util.jump(url) },
		},
	}
</script>

<style lang="scss" scoped>
	.m-page-list {
		width: 100%;
		min-height: 100%;
		box-sizing: border-box;

		&__add {
			position: fixed;
			bottom: calc(200rpx + env(safe-area-inset-bottom));
			right: 50rpx;
			width: 88rpx;
			height: 88rpx;
			line-height: 88rpx;
			border-radius: 50%;
			background-color: $blue;
			text-align: center;
			font-size: 50rpx;
			color: $white;
			box-shadow: 0 0 16rpx 0 rgba(82, 146, 255, 0.55);
		}
	}
</style>
