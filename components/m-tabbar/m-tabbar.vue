<template>
	<view class="m-tabbar" :class="{ 'is-fixed': fixed }">
		<view
			v-for="(item, i) in items"
			:key="i"
			class="m-tabbar__item"
			:class="{ 'is-active': isActive(i) }"
			hover-class="m-tabbar__item--hover"
			@click="onItemClick(i, item)">
			<text class="m-tabbar__icon iconfont">{{ currentIcon(i, item) }}</text>
			<text class="m-tabbar__text">{{ item.text }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'm-tabbar',
		props: {
			// [{ icon, activeIcon?, text, pagePath? }]
			// icon / activeIcon 传 iconfont 字形字符（如 '\ue621'）
			items: { type: Array, default: () => [] },
			// 当前选中项索引，支持 v-model
			value: { type: [Number, String], default: 0 },
			// 是否固定到底部（默认固定；页面内嵌预览时传 false）
			fixed: { type: Boolean, default: true },
			// 点击已配置 pagePath 的项时是否自动跳转：none / switchTab / reLaunch
			switchMode: { type: String, default: 'none' },
		},
		methods: {
			isActive(i) {
				return i === this.value || String(i) === String(this.value)
			},
			currentIcon(i, item) {
				return this.isActive(i) && item.activeIcon ? item.activeIcon : item.icon
			},
			onItemClick(i, item) {
				this.$emit('input', i)
				this.$emit('update:value', i)
				this.$emit('change', i, item)
				if (this.switchMode !== 'none' && item.pagePath) {
					const opt = { url: item.pagePath }
					if (this.switchMode === 'switchTab') uni.switchTab(opt)
					else uni.reLaunch(opt)
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-tabbar {
		display: flex;
		width: 100%;
		background-color: $bg-color-container;
		border-top: 1px solid $divider-color;

		&.is-fixed {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1000;
			padding-bottom: env(safe-area-inset-bottom);
		}

		&__item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 12rpx 0;
			box-sizing: border-box;
			color: $text-color-tertiary;

			&--hover {
				opacity: 0.7;
			}

			&.is-active {
				color: $color-brand;
			}
		}

		&__icon {
			font-size: 48rpx; // 24px
			line-height: 1;
		}

		&__text {
			margin-top: 6rpx;
			font-size: 22rpx; // 11px
			line-height: 1;
		}
	}
</style>
