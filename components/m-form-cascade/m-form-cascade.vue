<template>
	<m-cascade-picker 
		:url="url" 
		:value.sync="mValue" 
		:value-show.sync="mValueShow" 
		:data="data" 
		:data-key="dataKey"
		:data-value="dataValue"
		:disabled="disabled"
		@open="listeners('open', $event)" 
		@close="listeners('close', $event)"
		@change="listeners('change', $event)">
		<view class="m-form-cascade">
			<text class="placeholder" v-if="!Array.isArray(mValue) || mValue.length < 1">请选择</text>
			<text class="text" v-if="Array.isArray(mValue) && mValue.length > 0">{{mValueShow.join(delimiter)}}</text>
		</view>
	</m-cascade-picker>
</template>

<script>
	export default {
		name: "m-form-cascade",
		props: {
			url: {
				type: String,
				default: () => undefined
			},
			value: {
				type: Array,
				default: () => undefined
			},
			valueShow: {
				type: Array,
				default: () => undefined
			},
			delimiter: {
				type: String,
				default: () => "/"
			},
			dataValue: {
				type: String,
				default: () => undefined
			},
			dataKey: {
				type: String,
				default: () => undefined
			},
			data: {
				type: Array,
				default: () => undefined
			},
			disabled: {
				type: Boolean,
				default: () => false,
			},
		},
		data() {
			return {
				mValue: [],
				mValueShow: [],
			}
		},
		watch: {
			value(v) {
				this.mValue = v;
			},
			valueShow(v) {
				this.mValueShow = v;
			},
			mValue(v) {
				this.$emit("update:value", v);
			},
			mValueShow(v) {
				this.$emit("update:valueShow", v);
			} 
		},
		mounted() {
			this.mValue = this.value;
			this.mValueShow = this.valueShow;
		},
		methods: {
			listeners(name, value) {
				this.$emit(name, value);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.m-form-cascade {
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