<template>
	<view class="dateimte-picker">
		<!-- #ifdef MP-ALIPAY-->
		<view class="datetime-picker-wrapper" :style="{textAlign}" @click="showDatePicker">
			<view class="value" v-if="mValue.length>1">{{mValue}}</view>
			<view class="placeholder" v-if="mValue.length<1">{{placeholder}}</view>
		</view>
		<!--#endif-->

		<!--#ifndef MP-ALIPAY-->
		<uni-datetime-picker v-model="mValue" :type="type"  @change="setDate" :disabled="disabled">
			<view class="datepicker-wrapper" :style="{textAlign}">
				<view class="value" v-if="mValue.length>1">{{mValue}}</view>
				<view class="placeholder" v-if="mValue.length<1">{{placeholder}}</view>
			</view>
		</uni-datetime-picker>
		<!--#endif-->
	</view>
</template>

<script>
	import dayjs from '@/lib/day.min.js';
	export default {
		name: "m-datetime-picker",
		zhName: '日期选择器',
		props: {
			value: {
				type: String,
				default: () => "",
			},
			placeholder: {
				type: String,
				default: () => "请选择",
			},
			disabled: {
				type: Boolean,
				default: () => false,
			},
			textAlign: {
				type: String,
				default: () => 'right'
			},
			format: {
				type: String,
				default: () => "yyyy-MM-dd", // YYYY-MM-DD（默认） YYYY-MM-DD HH:mm:ss
			},
		},
		data() {
			return {
				type: 'date',
				mValue: '',
			};
		},
		mounted() {
			this.setType();
			this.mValue = this.value;
		},
		watch: {
			value(val) {
				this.mValue = val;
			},
		},
		methods: {
			setType() {
				if (this.format.includes('ss')) {
					this.type = "datetime";
					return;
				}
				if (this.format.includes('HH:mm')) {
					this.type = "datetime";
				}
			},
			setDate(e) {
				this.mValue = e;
				this.$emit('update:value', e);
				this.$emit('change', e);
			},
			showDatePicker() {
				// #ifdef MP-ALIPAY
				if (this.disabled) return;
				dd.datePicker({
					format: this.format,
					currentDate: this.mValue,
					success: (res) => {
						this.mValue = res.date;
						this.$emit('update:value', res.date);
						this.$emit('change', res.date);
					},
					fail: () => {
						this.mValue = "";
						this.$emit('update:value', "");
						this.$emit('change', "");
					}
				});
				// #endif
			},
		}
	}
</script>

<style lang="scss" scoped>
	.dateimte-picker {
		width: 100%;

		.datetime-picker-wrapper {
			width: inherit;
			height: 88rpx;
			line-height: 88rpx;
			box-sizing: border-box;
			text-align: right;
			font-size: 28rpx;

			.placeholder {
				color: #CDD5DC;
			}
		}
	}
</style>