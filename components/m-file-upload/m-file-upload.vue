<template>
	<view class="m-file-upload">
		<view class="m-file-upload__title" v-if="title">{{ title }}</view>

		<view class="m-file-upload__list">
			<!-- 已上传文件方块（§6.18 已上传态） -->
			<view
				v-for="(file, i) in mValue"
				:key="i"
				class="m-file-upload__cell is-file"
				@click="onPreview(file, i)">
				<view class="m-file-upload__doc"></view>
				<view class="m-file-upload__name">{{ fileName(file) }}</view>
				<view v-if="!readonly" class="m-file-upload__del" @click.stop="remove(i)"></view>
			</view>

			<!-- 继续上传/新增方块（§6.17 / §6.18 添加态） -->
			<view
				v-if="!readonly && !isMax"
				class="m-file-upload__cell is-add"
				hover-class="m-file-upload__cell--hover"
				@click="choose">
				<view class="m-file-upload__arrow"></view>
				<view class="m-file-upload__name">{{ addText }}</view>
			</view>
		</view>

		<view v-if="tip" class="m-file-upload__tip">{{ tip }}</view>
	</view>
</template>

<script>
	export default {
		name: 'm-file-upload',
		zhName: '附件上传',
		props: {
			// 文件列表：[{ name, url, path }] 或 ['name.pdf', ...]
			modelValue: { type: Array, default: () => [] },
			// 分组标题（空字符串则不显示）
			title: { type: String, default: '上传附件' },
			// 添加方块文字
			addText: { type: String, default: '添加' },
			// 底部提示文案
			tip: { type: String, default: '' },
			// 上传接口（相对地址，拼接 config.API_BASE）
			url: { type: String, default: '/common/upload' },
			// 最大数量，0 表示不限
			max: { type: Number, default: 9 },
			// 只读态（详情/审批页）：不渲染添加与删除入口
			readonly: { type: Boolean, default: false },
			// 选择类型：all / image
			accept: { type: String, default: 'all' },
		},
		data() {
			return { mValue: [] }
		},
		watch: {
			modelValue(val) {
				this.mValue = Array.isArray(val) ? val : []
			},
		},
		computed: {
			isMax() {
				return this.max > 0 && this.mValue.length >= this.max
			},
			remaining() {
				return this.max > 0 ? Math.max(this.max - this.mValue.length, 0) : 99
			},
		},
		mounted() {
			this.mValue = Array.isArray(this.modelValue) ? this.modelValue : []
		},
		methods: {
			fileName(file) {
				if (!file) return ''
				if (typeof file === 'string') return file.split('/').pop()
				return file.name || file.fileName || ''
			},
			fileUrl(file) {
				if (!file) return ''
				return typeof file === 'string' ? file : file.url || file.path || ''
			},
			isImage(file) {
				const name = this.fileName(file)
				return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(name)
			},
			async choose() {
				if (this.readonly || this.isMax) return
				let picked = []
				try {
					if (this.accept === 'image') {
						const res = await uni.chooseImage({ count: this.remaining })
						picked = (res.tempFilePaths || []).map((p) => ({ path: p, name: p.split('/').pop() }))
					} else if (typeof uni.chooseMessageFile === 'function') {
						// 微信小程序：从会话中选择文件
						const res = await uni.chooseMessageFile({ count: this.remaining, type: 'file' })
						picked = (res.tempFiles || []).map((f) => ({ path: f.path, name: f.name }))
					} else if (typeof uni.chooseFile === 'function') {
						// H5：本机选择文件
						const res = await uni.chooseFile({ count: this.remaining })
						picked = (res.tempFiles || []).map((f) => ({ path: f.path, name: f.name }))
					} else {
						uni.showToast({ title: '当前端不支持选择文件', icon: 'none' })
						return
					}
				} catch (e) {
					return
				}
				if (!picked.length) return

				uni.showLoading({ title: '上传中...' })
				const list = this.mValue.slice()
				for (const f of picked) {
					try {
						const data = await this.http.upload(this.url, f.path)
						const url = (data && (data.url || (data.back && data.back.url))) || data
						list.push({ name: f.name, url: typeof url === 'string' ? url : f.path })
					} catch (e) {
						uni.showToast({ title: '上传失败', icon: 'none' })
					}
				}
				uni.hideLoading()
				this.mValue = list
				this._emit(list)
			},
			remove(i) {
				if (this.readonly) return
				this.mValue.splice(i, 1)
				this._emit(this.mValue)
			},
			onPreview(file, i) {
				this.$emit('preview', file, i)
				if (this.isImage(file)) {
					const urls = this.mValue.filter((f) => this.isImage(f)).map((f) => this.fileUrl(f))
					const current = urls.indexOf(this.fileUrl(file))
					if (urls.length) uni.previewImage({ current: current > -1 ? current : 0, urls })
				}
			},
			_emit(list) {
				this.$emit('update:modelValue', list)
				this.$emit('input', list)
				this.$emit('change', list)
				this.$emit('update:value', list)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-file-upload {
		position: relative;
		padding: 0 32rpx 32rpx;
		box-sizing: border-box;
		background-color: $bg-color-container;

		&__title {
			display: flex;
			align-items: center;
			min-height: 100rpx;
			font-size: 28rpx;
			font-weight: 500; // Medium
			color: $text-color-primary;
			border-bottom: 1px solid $divider-color;
		}

		&__list {
			display: flex;
			flex-wrap: wrap;
			margin-top: 24rpx;
		}

		// 64×64 方块：浅蓝灰底、8px 圆角、无边框
		&__cell {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 128rpx;
			height: 128rpx;
			margin: 0 16rpx 16rpx 0;
			box-sizing: border-box;
			border-radius: $radius-lg;
			background-color: $blue-50;

			&--hover {
				opacity: 0.8;
			}

			// 继续上传：白底 + 1px 虚线描边
			&.is-add {
				background-color: $bg-color-container;
				border: 1px dashed $border-color-base;
			}
		}

		// 文档图标（纯 CSS 绘制，见 styles/mixins/icon.scss）
		&__doc {
			@include icon-doc(40rpx, 48rpx, $color-brand);
		}

		// 向上箭头图标（纯 CSS 绘制）
		&__arrow {
			@include icon-upload(48rpx, $color-brand);
		}

		&__name {
			max-width: 112rpx;
			margin-top: 8rpx;
			font-size: 22rpx; // 11px
			line-height: 1;
			color: $text-color-secondary;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			text-align: center;
		}

		// 删除角标：20×20 灰圆 + 白 ×，置于方块右上角内侧
		&__del {
			position: absolute;
			top: 4rpx;
			right: 4rpx;
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			background-color: $gray-200;

			@include icon-close-mark(20rpx, 3rpx, $white);
		}

		&__tip {
			margin-top: 8rpx;
			font-size: 22rpx;
			color: $text-color-tertiary;
		}
	}
</style>
