<template>
	<view :class="['tabs', size, border ? 'border' : '']" :style="{justifyContent}">
		<view :class="{
			tab: true,
			equally: isTabEqually,
			active: mValue===item.value,
		}" v-for="(item, i) in mData" :key="i" @click="bindChange(item.value)">
			{{item.text}}
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: [String, Number],
				default: () => ''
			},
			data: {
				type: Array,
				default: () => []
			},
			size: {
				type: String,
				default: () => 'middle',
			},
			border: {
				type: Boolean,
				default: () => false,
			},
			justifyContent: {
				type: String,
				default: () => 'space-between'
			},
		},
		mounted() {
			this.mValue = this.value;
			this.mData = this.formatData(this.data);
			if (this.mValue === '' && this.mData.length > 0) {
				this.mValue = this.mData[0].value;
			}
		},
		data() {
			return {
				mValue: '',
				mData: [],
			};
		},
		watch: {
			value(v) {
				this.mValue = v;
				if (this.value === v) return;
				this.$emit('update:value', v);
				this.$emit('change', v);
			},
			data(v) {
				this.mData = this.formatData(v);
			}
		},
		computed: {
			isTabEqually() {
				return this.justifyContent === 'space-between';
			},
		},
		methods: {
			bindChange(e) {
				this.mValue = e;
				this.$emit('update:value', e);
				this.$emit('change', e);
			},
			formatData(v) {
				if (v.length < 1) return [];
				if (typeof v[0] !== 'object') {
					const a = v.map((text, i) => {
						return {
							value: i,
							text: text
						}
					});
					return a;
				}
				return v;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.tabs {
		position: relative;
		width: 100%;
		display: flex;
		font-size: 28rpx;
		background-color: $white;
		
		&.border::after {
			position: absolute;
			bottom: -1px;
			left: 0;
			content: "";
			width: 100%;
			height: 1px;
			background-color: $pageBg;
		}

		.tab {
			padding: 0 24rpx;
			position: relative;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			color: $black5;
			box-sizing: border-box;

			&.active {
				color: $black;
				font-weight: bold;
			}

			&.active::before {
				position: absolute;
				bottom: 0;
				left: 50%;
				width: 60rpx;
				height: 4rpx;
				content: '';
				transform: translate(-50%, 50%);
				background-color: $blue;
			}
			
			&.equally {
				padding: 0;
				flex: 1;
			}
		}

		&.small {
			font-size: 24rpx;

			.tab {
				height: 60rpx;
				line-height: 60rpx;
			}
		}
	}
</style>