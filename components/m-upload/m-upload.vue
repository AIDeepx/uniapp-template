<template>
	<view class="m-upload">
		<view class="m-upload__title">
			<text class="m-upload__required" v-if="required">*</text>
			<text>{{ title }}</text>
		</view>
		<view class="m-upload__tip" :style="{ color: descColor }" v-if="desc">{{ desc }}</view>
		<view class="m-upload__images">
			<view class="m-upload__item" v-for="(img, i) in mValue" :key="i">
				<view class="m-upload__close iconfont" v-if="!disabled" @click="delImg(i)">&#xe715;</view>
				<view class="m-upload__image" @click="preview(i)">
					<image style="width: 100%; height: 100%;" :src="img" mode="aspectFill"></image>
				</view>
			</view>
			<view class="m-upload__btn iconfont" v-if="!disabled" @click="choose">&#xe732;</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'm-upload',
		zhName: '图片上传',
		props: {
			// 上传接口（相对地址，拼接 config.API_BASE）
			url: { type: String, default: '/common/upload' },
			title: { type: String, default: '' },
			desc: { type: String, default: '' },
			modelValue: { type: Array, default: () => [] },
			required: { type: Boolean, default: false },
			disabled: { type: Boolean, default: false },
			descColor: { type: String, default: '#919aa1' },
		},
		data() { return { mValue: [] } },
		watch: { modelValue(val) { this.mValue = Array.isArray(val) ? val : [] } },
		mounted() { this.mValue = Array.isArray(this.modelValue) ? this.modelValue : [] },
		methods: {
			async choose() {
				if (this.disabled) return
				const res = await uni.chooseImage({ count: 99 })
				if (!res || !res.tempFilePaths) return
				uni.showLoading({ title: '上传中...' })
				const list = this.mValue.slice()
				for (const file of res.tempFilePaths) {
					try {
						const data = await this.http.upload(this.url, file)
						const url = (data && (data.url || (data.back && data.back.url))) || data
						if (url) list.push(url)
					} catch (e) {
						uni.showToast({ title: '上传失败', icon: 'none' })
					}
				}
				uni.hideLoading()
				this.mValue = list
				this._emit(list)
			},
			delImg(i) {
				if (this.disabled) return
				this.mValue.splice(i, 1)
				this._emit(this.mValue)
			},
			preview(i) {
				uni.previewImage({ current: i, urls: this.mValue })
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
	.m-upload {
		width: 100%;
		position: relative;
		padding: 0 32rpx 32rpx;
		box-sizing: border-box;
		background-color: $white;

		&::before,
		&::after {
			position: absolute;
			top: 0; left: 0;
			width: 100%; height: 1px;
			content: '';
			background-color: $pageBg;
		}
		&::after { top: auto; bottom: 0; }

		&__title {
			height: 100rpx;
			line-height: 100rpx;
			font-size: 28rpx;
		}
		&__required {
			margin-right: 10rpx;
			color: $orange;
			font-size: 36rpx;
		}
		&__tip { font-size: 24rpx; margin-top: -10rpx; }

		&__images {
			margin-top: 30rpx;
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-gap: 20rpx;
		}
		&__item { position: relative; }
		&__image {
			display: block;
			width: 100%;
			height: 140rpx;
			border-radius: 8rpx;
			overflow: hidden;
		}
		&__close {
			position: absolute;
			top: -14rpx;
			right: -14rpx;
			width: 36rpx;
			height: 36rpx;
			line-height: 36rpx;
			color: $white;
			border-radius: 50%;
			font-size: 24rpx;
			text-align: center;
			background-color: #cdd5dc;
			z-index: 2;
		}
		&__btn {
			line-height: 140rpx;
			text-align: center;
			font-size: 40rpx;
			color: #6a7e9a;
			border: 1px dashed #6a7e9a;
			border-radius: 16rpx;
		}
	}
</style>
