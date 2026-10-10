<template>
	<view class="m-datetime" :class="{ 'is-disabled': disabled }">
		<uni-datetime-picker
			v-model="innerValue"
			:type="pickerType"
			return-type="string"
			:placeholder="placeholder"
			:disabled="disabled"
			:border="false"
			:hide-second="hideSecond"
			:start="start"
			:end="end"
			:clear-icon="false"
			@change="onChange">
			<!-- 用默认插槽替换官方编辑器外壳，保留其点击唤起能力，
			     使行内展示与模板的表单行（无边框、右对齐）保持一致 -->
			<view class="m-datetime__field" :style="{ textAlign }">
				<view class="m-datetime__value" v-if="innerValue">{{ innerValue }}</view>
				<view class="m-datetime__placeholder" v-else>{{ placeholder }}</view>
			</view>
		</uni-datetime-picker>
	</view>
</template>

<script>
	/**
	 * 日期时间选择器（基于官方 uni-datetime-picker 封装）
	 * - 选单/日历/时间面板全部交给官方组件，自身只负责：格式→类型映射、表单行样式、form-item 回写
	 * - 对外仍保持 modelValue + format 的既有契约，业务侧零改动
	 */
	export default {
		name: 'm-datetime-picker',
		zhName: '日期时间选择器',
		props: {
			modelValue: { type: String, default: '' },
			placeholder: { type: String, default: '请选择' },
			disabled: { type: Boolean, default: false },
			textAlign: { type: String, default: 'right' },
			// 格式：yyyy-MM-dd（默认） | 含 HH:mm 或 ss 视为日期+时间
			format: { type: String, default: 'yyyy-MM-dd' },
			start: { type: [String, Number], default: '' },
			end: { type: [String, Number], default: '' },
		},
		inject: { formItemContext: { default: null } },
		data() {
			return { innerValue: '' }
		},
		computed: {
			// 含 HH / ss 即视为日期+时间（与旧实现判定一致）
			isDateTime() { return /HH|ss/i.test(this.format) },
			pickerType() { return this.isDateTime ? 'datetime' : 'date' },
			// 格式里没有 ss 就不输出秒，保持 "yyyy-MM-dd HH:mm" 的既有值格式
			hideSecond() { return !/ss/i.test(this.format) },
		},
		watch: {
			modelValue: {
				immediate: true,
				handler(val) { this.innerValue = val || '' },
			},
		},
		methods: {
			onChange(val) {
				const v = val === undefined || val === null ? '' : val
				this.$emit('update:modelValue', v)
				this.$emit('input', v)
				this.$emit('change', v)
				this.$emit('update:value', v)
				if (this.formItemContext) this.formItemContext.setValue(v)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-datetime {
		width: 100%;

		&__field {
			width: 100%;
			box-sizing: border-box;
			min-height: $form-row-min-height;
			line-height: $form-row-min-height;
			font-size: $form-value-size;
			color: $black;
		}
		&__value { color: $black; }
		&__placeholder { color: $placeholder; }

		&.is-disabled {
			.m-datetime__value,
			.m-datetime__field { color: $black9; }
		}
	}
</style>