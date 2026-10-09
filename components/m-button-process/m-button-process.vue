<template>
	<view class="m-button-process">
		<m-button type="delete" ghost block @click="bindBatchHandle(false)">不同意</m-button>
		<m-space width="20rpx"></m-space>
		<m-button block @click="bindBatchHandle(true)">同意</m-button>
	</view>
</template>

<script>
	export default {
		name: 'm-button-process',
		props: {
			ddid: { type: [String, Number], default: '' },
			trids: { type: [String, Number], default: '' },
			// 「不同意」时跳转的页面；为空则不跳转，仅派发事件
			rejectUrl: { type: String, default: '' },
		},
		methods: {
			bindBatchHandle(status) {
				this.$emit('change', status);
				if (status) {
					this.doBatch();
				} else if (this.rejectUrl) {
					this.util.jump(this.rejectUrl + '?trids=' + this.trids, true);
				}
			},
			doBatch() {
				// 依赖业务侧接口，未配置时仅派发事件，不发请求
				const url = this.api && this.api.Process && this.api.Process.ProcessTran;
				if (!url) {
					this.$emit('done', true);
					return;
				}
				uni.showLoading({ title: '加载中...' });
				this.util.GET({
					url,
					data: {
						ddid: this.ddid,
						trids: this.trids,
						state: 1,
						commit: '同意',
					},
					success: () => {
						this.$emit('done', true);
						uni.showToast({ icon: 'success', title: '成功' });
					},
					complete: () => uni.hideLoading(),
				});
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-button-process {
		padding: 0 32rpx;
		width: 100%;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		justify-content: space-between;
	}
</style>
