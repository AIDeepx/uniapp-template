<template>
	<view
		class="m-file-item"
		:class="{ 'is-clickable': clickable, 'is-active': radio && checked }"
		:hover-class="clickable ? 'm-file-item--hover' : ''"
		@click="onClick">
		<!-- 文件类型图标（纯 CSS 绘制，按类型着色） -->
		<view class="m-file-item__icon" :class="'is-' + iconType"></view>

		<view class="m-file-item__main">
			<view class="m-file-item__name">{{ name }}</view>
			<view v-if="time" class="m-file-item__time">{{ time }}</view>
		</view>

		<!-- 多选模式：右侧圆形 radio -->
		<view v-if="radio" class="m-file-item__radio" :class="{ 'is-checked': checked }"></view>
		<!-- 否则可选右侧箭头 -->
		<view v-else-if="arrow" class="m-file-item__arrow"></view>
	</view>
</template>

<script>
	const TYPE_ALIAS = {
		doc: 'word',
		docx: 'word',
		xls: 'excel',
		xlsx: 'excel',
		csv: 'excel',
		png: 'image',
		jpg: 'image',
		jpeg: 'image',
		gif: 'image',
		dir: 'folder',
	}

	export default {
		name: 'm-file-item',
		zhName: '文件列表项',
		props: {
			// 文件名
			name: { type: String, default: '' },
			// 时间 / 辅助信息
			time: { type: String, default: '' },
			// 类型：word / excel / pdf / folder / image / file（也可直接传扩展名，自动归一）
			type: { type: String, default: 'file' },
			// 是否显示右侧圆形 radio（多选模式）
			radio: { type: Boolean, default: false },
			// radio 选中态
			checked: { type: Boolean, default: false },
			// 是否显示右侧箭头
			arrow: { type: Boolean, default: false },
			// 是否可点击（影响 hover 态）
			clickable: { type: Boolean, default: true },
		},
		computed: {
			iconType() {
				const t = String(this.type || '').toLowerCase().replace(/^\./, '')
				if (TYPE_ALIAS[t]) return TYPE_ALIAS[t]
				const known = ['word', 'excel', 'pdf', 'folder', 'image', 'file']
				return known.includes(t) ? t : 'file'
			},
		},
		methods: {
			onClick(e) {
				this.$emit('click', e)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-file-item {
		display: flex;
		align-items: center;
		padding: 24rpx 32rpx;
		box-sizing: border-box;
		background-color: $bg-color-container;

		&--hover {
			background-color: $bg-color-base;
		}

		// 文件类型图标：按类型着色（形状见 styles/mixins/icon.scss）
		&__icon {
			@include file-icon($text-color-tertiary);

			&.is-word {
				@include file-icon($color-brand);
			}
			&.is-excel {
				@include file-icon($color-success);
			}
			&.is-pdf {
				@include file-icon($color-error);
			}
			&.is-image {
				@include file-icon($purple-500);
			}
			&.is-folder {
				@include file-icon-folder($color-warning);
			}
		}

		&__main {
			flex: 1;
			min-width: 0;
			margin-left: 24rpx;
		}

		&__name {
			font-size: 28rpx; // 14px
			line-height: 40rpx;
			color: $text-color-primary;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		&__time {
			margin-top: 4rpx;
			font-size: 24rpx; // 12px
			line-height: 34rpx;
			color: $text-color-tertiary;
		}

		// 圆形 radio：复用原子 mixin（styles/mixins/indicator.scss）
		&__radio {
			@include indicator(40rpx);

			margin-left: 24rpx;

			&.is-checked {
				@include indicator-on(40rpx);
			}
		}

		&__arrow {
			@include icon-arrow(16rpx, 3rpx, $border-color-base);

			margin-left: 24rpx;
		}
	}
</style>
