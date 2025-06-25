<template>
	<view class="z-picker">
		<picker :value="mValue" :range="range" :range-key="rangeText" @change="change" :disabled="disabled">
			<view class="content">
				<view class="text" v-if="text">{{text}}</view>
				<view class="placeholder" v-if="!text">{{placeholder}}</view>
			</view>
		</picker>
	</view>
</template>

<script>
	export default {
		name: 'm-picker',
		props: {
			value: {
				type: Number | String,
				default: () => 0,
			},
			range: {
				type: Array,
				default: () => [],
			},
			rangeValue: {
				type: String,
				default: () => "id",
			},
			rangeText: {
				type: String,
				default: () => "text",
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
			this.setValue(this.value);
		},
		data() {
			return {
				mValue: 0,
				text: '',
			};
		},
		watch: {
			value(val) {
				if (val === this.mValue) return;
				this.setValue(val);
			},
		},
		methods: {
			setValue(val) {
				if (val !== '') {
					if (typeof val === 'string' && /\d+/.test(val)) {
						val = parseInt(val);
					}
					for (let i = 0; i < this.range.length; i++) {
						if (this.range[i][this.rangeValue] === val) {
							this.mValue = i;
							this.text = this.range[i][this.rangeText]
							break;
						}
					}
				}
			},
			change(e) {
				this.mValue = e.detail.value;
				if (this.range[e.detail.value] && this.range[e.detail.value][this.rangeValue] !== undefined) {
					this.text = this.range[e.detail.value][this.rangeText];
					this.$emit('update:value', this.range[e.detail.value][this.rangeValue]);
					this.$emit('change', this.range[e.detail.value][this.rangeValue]);
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.z-picker {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		box-sizing: border-box;

		.content {
			text-align: right;
			font-size: 30rpx;

			.placeholder {
				color: $placeholder;
			}
		}
	}
</style>