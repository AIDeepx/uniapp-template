<template>
	<view class="z-button-process" height="auto">
		<z-button color="#f55746" @click="bindBatchHandle(false)" boxshadow>不同意</z-button>
		<z-space width="20rpx"></z-space>
		<z-button @click="bindBatchHandle(true)" boxshadow>同意</z-button>
	</view>
</template>

<script>
	export default {
		name:"m-button-process",
		props: ["ddid", "trids"],
		data() {
			return {
				
			};
		},
		methods: {
			bindBatchHandle(status) {
				if (status) {
					this.doBatch();
				} else {
					this.util.jump('/pages/reject/reject?trids=' + this.trid, true);
				}
			},
			doBatch() {
				return new Promise(r => {
					uni.showLoading({
						title: '加载中...'
					});
					this.util.GET({
						url: this.api.Process.ProcessTran,
						data: {
							ddid: this.ddid,
							trids: this.trids,
							state: 1,
							commit: '同意',
						},
						success: res => {
							uni.showToast({
								icon: 'success',
								title: '成功',
								success() {
									uni.navigateBack();
								}
							});
						},
						complete: () => {
							uni.hideLoading();
						}
					});
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.z-button-process {
	padding: 0 32rpx;
	width: 100%;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	justify-content: space-between;
	overflow: hidden;
}
</style>