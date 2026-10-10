<template>
	<view class="z-linkpicker" @click="jump">
		<div class="placeholder" v-if="!value">{{ placeholder }}</div>
		<div class="content" v-if="value">{{valueShow}}</div>
	</view>
</template>

<script>
	export default {
		name: 'm-linkpicker',
		props: {
			value: {
				type: String,
				default: () => "",
			},
			valueShow: {
				type: String,
				default: () => "",
			},
			eventname: {
				type: String,
				default: () => "",
			},
			url: {
				type: String,
				default: () => "",
			},
			params: {
				type: Object,
				default: () => new Object(),
			},
			placeholder: {
				type: String,
				default: () => "请选择",
			},
			disabled: {
				type: Boolean,
				default: () => false,
			},
		},
		mounted() {
			this.mValueShow
		},
		watch: {
			valueShow(val) {
				this.mValueShow = val;
			}
		},
		data() {
			return {
				mValue: [],
				mValueShow: ""
			};
		},
		methods: {
			jump() {
				if (this.disabled) return;
				uni.$once(this.eventname, res => {
					this.mValueShow = res.valueShow;
					this.mValue = res.value;
					this.$emit('update:valueShow', res.valueShow);
					this.$emit('update:value', res.value);
					this.$emit('change', res.value);
				})
				this.util.jump(this.url, false, this.params);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.z-linkpicker {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		box-sizing: border-box;
		text-align: right;
		font-size: 30rpx;
		text-overflow: ellipsis;
		overflow: hidden;

		.placeholder {
			color: $text-color-placeholder;
		}
	}
</style>