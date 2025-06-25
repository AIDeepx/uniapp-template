<template>
	<view class="upload">
		<view class="title">
			<text class="required" v-if="required">*</text>
			<text>{{ title }}</text>
		</view>
		<view class="tip" :style="{ color: descColor }">{{ desc }}</view>
		<view class="images">
			<view class="image-box" :style="{
					gridTemplateRows: `repeat(${(mValue.length + 1) % 4}, 140rpx)`
				}" v-for="(img, i) in mValue" :key="i">
				<view class="close iconfont" @click="delImgList(i)" v-if="!disabled">&#xe715;</view>
				<view class="image" @click="previewImag(i)">
					<image style="width: 100%; height: 100%;" :src="img"></image>
				</view>
			</view>
			<view class="btn iconfont" @click="chooseImage" v-if="!disabled">&#xe732;</view>
		</view>
	</view>
</template>

<script>
	import zUpload from '@/props/z-upload.js';
	export default {
		name: 'z-upload',
		zhName: '图片上传',
		props: {
			url: {
				type: String,
				default: () =>
					"http://app.zhifeishengwu.com:1122/RpcCommon/?api=WebMobileApp.oa.HandlerOfficeExpensePay,WebMobileApp&act=FileUpLoad"
			},
			title: {
				type: String,
				default: () => ""
			},
			desc: {
				type: String,
				default: () => ""
			},
			type: {
				type: String,
				default: () => "image", // image 或 file
			},
			value: "",
			required: {
				type: Boolean,
				default: () => false,
			},
			disabled: {
				type: Boolean,
				default: () => false,
			},
			descColor: {
				type: String,
				default: () => '#919aa1',
			}
		},
		model: {
			props: 'value',
			event: 'change'
		},
		mounted() {
			this.setValue(this.value);
		},
		watch: {
			value(val) {
				this.setValue(val);
			}
		},
		data() {
			return {
				mValue: []
			};
		},
		methods: {
			setValue(val) {
				if (Array.isArray(val)) {
					this.mValue = val;
				} else {
					this.mValue = [];
				}
			},
			chooseImage() {
				if (this.disabled) return;
				let imgList = JSON.parse(JSON.stringify(this.value));
				uni.chooseImage({
					count: 99,
					success: async res => {
						// uni.showLoading({
						// 	content: '上传中...'
						// });
						for (const tempFile of res.tempFilePaths) {
							let cPath = await this.uploadFile(tempFile);
							imgList.push(cPath);
						}
						this.mValue = imgList;
						this.$emit('update:value', imgList);
						this.$emit('change', imgList);
						uni.hideLoading();
					}
				});
			},
			async uploadFile(file) {
				return new Promise((rs, rj) => {
					uni.uploadFile({
						url: this.url,
						fileType: 'image',
						name: 'file',
						filePath: file,
						success: up => {
							if (up.statusCode == 200) {
								up = typeof up.data == 'object' ? up.data : JSON.parse(up.data);
								if (up.status == 200) {
									rs(up.back.url);
								} else {
									console.error(up);
								}
							}
						},
						fail: err => {
							uni.hideLoading();
						}
					});
				});
			},
			previewImag(i) {
				uni.previewImage({
					current: i,
					urls: this.mValue
				});
			},
			delImgList(i) {
				if (this.disabled) return;
				let imgList = [];
				for (let imgIdx = 0; imgIdx < this.mValue.length; imgIdx++) {
					if (imgIdx !== i) {
						imgList.push(this.mValue[imgIdx]);
					}
				}
				this.mValue = imgList;
				this.$emit('onChange', imgList);
				this.$emit('update:imgList', imgList);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.upload {
		width: 100%;
		position: relative;
		padding: 0 32rpx 32rpx 32rpx;
		box-sizing: border-box;
		background-color: $white;

		&::before,
		&::after {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 1px;
			content: '';
			background-color: $pageBg;
		}

		&::after {
			top: auto;
			bottom: 0;
		}

		.title {
			height: 100rpx;
			line-height: 100rpx;
			font-size: 28rpx;

			.required {
				margin-right: 10rpx;
				color: #ef5e17;
				font-size: 36rpx;
			}
		}

		.tip {
			font-size: 24rpx;
		}

		.images {
			margin-top: 30rpx;
			display: grid;
			grid-row-gap: 20rpx;
			grid-column-gap: 20rpx;
			grid-template-columns: repeat(4, 1fr);

			.image-box {
				position: relative;

				.image {
					display: block;
					width: 100%;
					height: 140rpx;
					overflow: hidden;
				}

				.close {
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
				}
			}

			.btn {
				line-height: 140rpx;
				text-align: center;
				font-size: 40rpx;
				color: #6a7e9a;
				border: 1px dashed #6a7e9a;
				border-radius: 16rpx;
			}
		}
	}
</style>