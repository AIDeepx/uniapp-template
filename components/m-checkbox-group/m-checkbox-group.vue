<template>
	<view class="checkbox-group">
		<slot />
		<m-checkbox v-for="item in options" :key="item.value" :value="item.value">{{item.text}}</m-checkbox>
	</view>
</template>

<script>
	export default {
		name: 'm-checkbox',
		zhName: '多选框组',
		props: {
			value: {
				type: Array,
				default: () => [],
			},
			options: {
				type: Array,
				default: () => [],
			},
			direction: {
				type: 'left' | 'right',
				default: 'left',
			}

		},
		data() {
			return {
				mValue: [],
				ctxs: {},
			}
		},
		watch: {
			value(val) {
				this.setMValue(val);
			}
		},
		provide() {
			return {
				checkboxGroupContext: this,
			}
		},
		mounted() {
			this.setMValue(this.value);
		},
		methods: {
			setCtx(ctx) {
				this.$nextTick(() => {
					this.ctxs[ctx.value] = ctx;
					const ctxKeys = Object.keys(this.ctxs);
					for (let i = 0; i < ctxKeys.length; i++) {
						const key = ctxKeys[i];
						this.ctxs[key].isFirstChild = i === 0;
					}
				});
			},
			delCtx(ctx) {
				this.$nextTick(() => {
					delete this.ctxs[ctx.value];
					const ctxKeys = Object.keys(this.ctxs);
					for (let i = 0; i < ctxKeys.length; i++) {
						const key = ctxKeys[i];
						this.ctxs[key].isFirstChild = i === 0;
					}
				});
			},
			setMValue(val) {
				this.$nextTick(() => {
					this.mValue = val;
					for (const ctxKey in this.ctxs) {
						const ctx = this.ctxs[ctxKey];
						ctx.mChecked = val.includes(ctx.value);
					}
				});
			},
			change(ctx) {
				const mValue = [];
				const ctxKeys = Object.keys(this.ctxs);
				for (let i = 0; i < ctxKeys.length; i++) {
					const key = ctxKeys[i];
					if (this.ctxs[key].mChecked) {
						mValue.push(this.ctxs[key].value);
					}
				}
				this.mValue = mValue;
				this.$emit('update:value',mValue);
				this.$emit('change', mValue);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.checkbox-group {
		display: flex;
		align-items: center;
	}
</style>