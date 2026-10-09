<template>
	<view class="m-card" :style="cstyle" @click="onClick" @longtap="onLongtap">
		<view class="m-card__head">
			<view class="m-card__title">{{ title !== undefined ? title : (value && value[fieldMap.title]) }}</view>
			<view
				class="m-card__status"
				:style="{ color: colorMap && status !== undefined ? colorMap[status] : '' }"
				v-if="status !== undefined && status !== ''">{{ status }}</view>
		</view>
		<view class="m-card__content" v-if="descList.length">
			<view class="m-card__row" v-for="(item, i) in descList" :key="i">
				<view class="m-card__label" :style="{ width: (item.width || 180) + 'rpx' }">{{ item.label }}</view>
				<view class="m-card__text">{{ item.text }}</view>
			</view>
		</view>
		<slot />
	</view>
</template>

<script>
	export default {
		name: 'm-card',
		zhName: '卡片',
		props: {
			value: { type: Object, default: () => ({}) },
			// 直接传标题/状态/描述，使用更直观；缺省时回退到 value + fieldMap
			title: { type: String, default: undefined },
			status: { type: [String, Number], default: undefined },
			desc: { type: Array, default: undefined }, // [{label, text, width}]
			colorMap: { type: Object, default: () => ({}) },
			fieldMap: {
				type: Object,
				default: () => ({ title: 'title', status: 'status', desc: { label: 'label', text: 'text' } }),
			},
			cstyle: { type: Object, default: () => ({}) },
		},
		computed: {
			descList() {
				if (Array.isArray(this.desc)) return this.desc
				const fdesc = this.fieldMap.desc || {}
				const rows = (this.value && this.value.desc) || []
				return rows.map((it) => ({
					label: it[fdesc.label],
					text: it[fdesc.text],
					width: fdesc.width,
				}))
			},
		},
		methods: {
			onClick(e) { this.$emit('click', e) },
			onLongtap(e) { this.$emit('longtap', e) },
		},
	}
</script>

<style lang="scss" scoped>
	.m-card {
		margin-top: 24rpx;
		padding: 30rpx 32rpx;
		border-radius: $radius-md;
		background-color: $white;
		overflow: hidden;
		box-sizing: border-box;

		&__head {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		&__title {
			padding-bottom: 30rpx;
			flex: 1;
			font-size: 30rpx;
			font-weight: bold;
			color: $black;
			border-bottom: 1px solid $pageBg;
		}
		&__status {
			width: 140rpx;
			font-size: 26rpx;
			text-align: right;
		}
		&__row {
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;
			font-size: 26rpx;
		}
		&__label { color: #aeb8c0; flex-shrink: 0; }
		&__text { flex: 1; text-align: right; color: $black; }
	}
</style>
