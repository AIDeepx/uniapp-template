<template>
	<view class="textarea">
		<view class="title">
			<text class="required" v-if="mRequired()">*</text>
			<text>{{ title }}</text>
			<text class="desc">{{ desc }}</text>
		</view>
		<textarea 
			class="content"
			:value="value" 
			placeholder-style="font-size:28rpx;color:#AEB8C0;"
			:placeholder="placeholder"
			:disabled="mDisabled()" 
			:maxlength="maxlength" 
			@input="onInput" 
			auto-height  />
			
		<view class="readonly-overlay" v-if="mReadonly()"></view>
	</view>
</template>

<script>
	export default {
		name: 'm-textarea',
		zhName: '文本域',
		props: {
			title: {
				type: String,
				default: () => "",
			},
			desc: {
				type: String,
				default: () => "",
			},
			value: {
				type: String,
				default: () => "",
			},
			placeholder: {
				type: String,
				default: () => "请输入",
			},
			disabled: {
				type: Boolean,
				default: () => undefined,
			},
			required: {
				type: Boolean,
				default: () => undefined,
			},
			readonly: {
				type: Boolean,
				default: () => undefined,
			},
			maxlength: {
				type: Number,
				default: () => -1,
			},
		},
		data() {
			return {};
		},
		inject: {
			formItemContext: {
				default: undefined
			}
		},
		methods: {
			onInput(e) {
				this.$emit("update:value", e.detail.value);
				this.$emit('input', e.detail.value);
				this.$emit('change', e.detail.value);
			},
			mDisabled() {
				if (this.disabled !== undefined) {
					return this.disabled;
				}
				if (this.formItemContext && this.formItemContext.disabled !== undefined) {
					return this.formItemContext.disabled;
				}
				return false;
			},
			mRequired() {
				if (this.required !== undefined) {
					return this.required;
				}
				if (this.formItemContext && this.formItemContext.required !== undefined) {
					return this.formItemContext.required;
				}
				return false;
			},
			mReadonly() {
				if (this.readonly !== undefined) {
					return this.readonly;
				}
				if (this.formItemContext && this.formItemContext.readonly !== undefined) {
					return this.formItemContext.readonly;
				}
				return false;
			},
		}
	};
</script>

<style lang="scss" scoped>
	.textarea {
		width: 100%;
		position: relative;
		box-sizing: border-box;
		background-color: $white;
		overflow: hidden;

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

			.desc {
				color: #aeb8c0;
			}
		}

		.content {
			width: 100%;
			box-sizing: border-box;
			overflow: hidden;
		}
	}
	.readonly-overlay {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		z-index: 2;
	}
</style>