<template>
	<view class="m-form-view">
		<text class="placeholder" v-if="mValue === ''">{{placeholder}}</text>
		<text class="text" v-if="mValue !== ''">{{valueShow}}</text>
	</view>
</template>

<script>
	export default {
		name:"m-form-view",
		props: {
			value: "",
			valueShow: "",
			placeholder: {
				type: String,
				default: () => '请选择'
			},
		},
		data() {
			return {
				mValue: [],
			}
		},
		watch: {
			value(v) {
				if (v === undefined) {
					this.mValue = "";
					return;
				}
				this.mValue = v;
			},
			valueShow(v) {
				this.mValueShow = v;
			}
		},
		mounted() {
			if (this.value === undefined) {
				this.mValue = "";
			} else {
				this.mValue = this.value;
			}
			this.mValueShow = this.valueShow;
		}
	}
</script>

<style lang="scss" scoped>
.m-form-view {
	height: 88rpx;
	line-height: 88rpx;
	font-size: 30rpx;
	text-align: right;
	
	.placeholder {
		color: $placeholder;
	}
	
	.text {
		color: $black;
	}
}
</style>