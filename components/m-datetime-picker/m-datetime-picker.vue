<template>
	<view class="m-datetime">
		<view class="m-datetime__field" :class="{ 'is-disabled': disabled }" :style="{ textAlign }" @click="open">
			<view class="m-datetime__value" v-if="mValue">{{ mValue }}</view>
			<view class="m-datetime__placeholder" v-else>{{ placeholder }}</view>
		</view>

		<view v-if="visible" class="m-datetime__mask" @click="close">
			<view class="m-datetime__panel" @click.stop>
				<picker v-if="showDate" mode="date" :value="datePart" @change="onDate" class="m-datetime__picker">
					<view class="m-datetime__native">{{ datePart || '请选择日期' }}</view>
				</picker>
				<picker v-if="showTime" mode="time" :value="timePart" @change="onTime" class="m-datetime__picker">
					<view class="m-datetime__native">{{ timePart || '请选择时间' }}</view>
				</picker>
				<view class="m-datetime__actions">
					<view class="m-datetime__btn cancel" @click="close">取消</view>
					<view class="m-datetime__btn confirm" @click="confirm">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
		},
		inject: { formItemContext: { default: null } },
		data() {
			return {
				visible: false,
				mValue: '',
				datePart: '',
				timePart: '',
			}
		},
		watch: {
			modelValue(val) {
				this.mValue = val
				this.parseValue()
			},
		},
		mounted() {
			this.mValue = this.modelValue
			this.parseValue()
		},
		computed: {
			isDateTime() { return /HH|ss/i.test(this.format) },
			showDate() { return true },
			showTime() { return this.isDateTime },
		},
		methods: {
			open() {
				if (this.disabled) return
				this.parseValue()
				this.visible = true
			},
			close() { this.visible = false },
			parseValue() {
				const [d, t] = (this.mValue || '').split(' ')
				this.datePart = d || ''
				this.timePart = t || '00:00'
			},
			onDate(e) { this.datePart = e.detail.value },
			onTime(e) { this.timePart = e.detail.value },
			confirm() {
				let v = this.datePart
				if (this.isDateTime) v = `${this.datePart} ${this.timePart}`
				this.mValue = v
				this.$emit('update:modelValue', v)
				this.$emit('input', v)
				this.$emit('change', v)
				this.$emit('update:value', v)
				if (this.formItemContext) this.formItemContext.setValue(v)
				this.visible = false
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
			font-size: 30rpx;
			color: $black;
			&.is-disabled { color: $black9; }
		}
		&__placeholder { color: $placeholder; }

		&__mask {
			position: fixed;
			left: 0; top: 0; right: 0; bottom: 0;
			background: $bg-mask;
			z-index: $z-popup;
			display: flex;
			align-items: flex-end;
			justify-content: center;
		}
		&__panel {
			width: 100%;
			background: $white;
			border-radius: $radius-lg $radius-lg 0 0;
			padding: 24rpx 32rpx calc(24rpx + env(safe-area-inset-bottom));
			box-sizing: border-box;
		}
		&__picker {
			width: 100%;
			&__native { padding: 20rpx 0; font-size: 30rpx; color: $black; }
		}
		&__native {
			padding: 20rpx 0;
			font-size: 30rpx;
			color: $black;
			border-bottom: 1px solid $pageBg;
		}
		&__actions {
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;
		}
		&__btn {
			flex: 1;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			border-radius: 44rpx;
			font-size: 28rpx;
			&.cancel { color: $black5; border: 1px solid #acbcd2; }
			&.confirm { color: $white; background: $blue; }
			&:last-child { margin-left: 20rpx; }
		}
	}
</style>
