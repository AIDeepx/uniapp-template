<template>
	<view class="m-page-list">
		<m-search v-if="hasCondition" :value="search.value" :data="search.data" @change="change($event, 'search')"></m-search>
		<slot></slot>
		<view class="add-plus iconfont" v-if="addUrl" @click="jump(addUrl)">&#xe62e;</view>
	</view>
</template>

<script>
	export default {
		name: "m-page-list",
		props: {
			search: {
				type: Object,
				default: () => {
					return {
						visible: false,
						value: {},
						data: [],
					}
				}
			},
			addUrl: {
				type: String,
				default: () => "",
			}
		},
		computed: {
			hasCondition() {
				return this.search.visible;
			},
		},
		data() {
			return {

			};
		},
		methods: {
			change(event, eventName) {
				this.$event(eventName, event);
			}
		},
	}
</script>

<style lang="scss" scoped>
	.m-page-list {
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		flex-direction: column;
		box-sizing: border-box;
		overflow: hidden;
		
		.add-plus {
			position: fixed;
			bottom: 200rpx;
			right: 50rpx;
			width: 88rpx;
			height: 88rpx;
			line-height: 88rpx;
			border-radius: 50%;
			background-color: $blue;
			text-align: center;
			font-size: 50rpx;
			color: $white;
			box-shadow: 0rpx 0rpx 16rpx 0rpx rgba(82,146,255,0.55);
		}
	}
</style>