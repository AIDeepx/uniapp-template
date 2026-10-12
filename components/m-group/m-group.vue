<template>
	<view class="m-group">
		<view class="m-group__head" v-if="hasHead">
			<view class="m-group__heading">
				<text class="m-group__title" :class="'is-' + level">{{ title }}</text>
				<text class="m-group__desc" v-if="desc">{{ desc }}</text>
			</view>
			<!-- 右侧操作：actionText 快捷方式，或用 action 插槽完全自定义 -->
			<slot name="action">
				<m-text-action
					v-if="actionText"
					:type="actionType"
					:icon="actionIcon"
					@click="$emit('action')">{{ actionText }}</m-text-action>
			</slot>
		</view>
		<view class="m-group__body">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'm-group',
		zhName: '分组容器',
		props: {
			// 分组标题
			title: { type: String, default: '' },
			// 标题右侧补充说明
			desc: { type: String, default: '' },
			// 标题层级：section 16px Semibold（分组）/ sub 15px Semibold（子分组，如「明细 1」）
			level: { type: String, default: 'section' },
			// 快捷操作文案（配 actionIcon / actionType 使用；复杂操作用 action 插槽）
			actionText: { type: String, default: '' },
			actionIcon: { type: String, default: '' },
			actionType: { type: String, default: 'primary' },
		},
		computed: {
			hasHead() {
				return Boolean(this.title || this.desc || this.actionText || this.$slots.action)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-group {
		&__head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			/* 分组标题 ↔ 内容固定 8px，勿贴死 */
			margin-bottom: 16rpx;
		}

		&__heading {
			display: flex;
			align-items: baseline;
			flex: 1;
			min-width: 0;
		}

		&__title {
			@include textoverflow;
			font-weight: 600; // Semibold
			color: $text-color-primary;

			&.is-section {
				font-size: 32rpx; // 16px
			}
			&.is-sub {
				font-size: 30rpx; // 15px
			}
		}

		&__desc {
			@include textoverflow;
			margin-left: 12rpx;
			font-size: 24rpx;
			color: $text-color-tertiary;
		}

		&__body {
			min-width: 0;
		}
	}
</style>