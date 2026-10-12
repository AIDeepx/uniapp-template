<template>
	<view class="m-button-process">
		<!-- §6.8 审批对按钮：拒绝（橙底白字实心）+ 同意（蓝底白字），各半、间距 12px -->
		<m-button type="delete" block @click="bindBatchHandle(false)">{{ rejectText }}</m-button>
		<m-space width="24rpx"></m-space>
		<m-button block @click="bindBatchHandle(true)">{{ agreeText }}</m-button>
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
			// 按钮文案（设计稿 §6.8 用「拒绝 / 同意」）
			rejectText: { type: String, default: '拒绝' },
			agreeText: { type: String, default: '同意' },
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
