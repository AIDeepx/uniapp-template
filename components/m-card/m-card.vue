<template>
	<view class="z-card" :style="cstyle" @click="onClick" @longtap="onLongtap">
		<view class="head">
			<view class="title">{{value[fieldMap.title]}}</view>
			<view class="status" :style="{color: colorMap[value[fieldMap.status]]}" v-if="value[fieldMap.status]">{{value[fieldMap.status]}}</view>
		</view>
		<view class="content">
			<view class="row" v-for="(item, i) in value.desc" :key="i" v-if="value.desc && item[fieldMap.desc.text]">
				<view class="label" :style="{width: (fieldMap.desc.width?fieldMap.desc.width:70) + 'px'}">{{item[fieldMap.desc.label]}}</view>
				<view class="text">{{item[fieldMap.desc.text]}}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'm-card',
	zhName: '卡片',
	props: {
		value: {
			type: Object,
			default: () => {},
		},
		colorMap: {
			type: Object,
			default: () => {}
		},
		fieldMap: {
			type: Object,
			default: () => {
				return {
					title: 'title',
					status: 'status',
					desc: {},
				}
			}
		},
		cstyle: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {};
	},
	methods: {
		onClick(e) {
			this.$emit('click', e)
		},
		onLongtap(e) {
			this.$emit('longtap', e);
		}
	}
};
</script>

<style lang="scss" scoped>
.z-card{
	margin-top: 24rpx;
	padding: 30rpx 32rpx;
	border-radius: 6rpx;
	background-color: $white;
	overflow: hidden;
	box-sizing: border-box;
	.head{
		display: flex;
		justify-content: space-between;
		.title{
			padding-bottom: 30rpx;
			flex: 1;
			font-size: 30rpx;
			font-weight: bold;
			border-bottom: 1px solid #f5f9fc;
		}
		.status{
			width: 100rpx;
			font-size: 26rpx;
			text-align: right;
		}
	}
	.content{
		.row{
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;
			font-size: 26rpx;
			.label{
				color: #AEB8C0;
			}
			.text {
				flex: 1;
			}
		}
	}
}
</style>
