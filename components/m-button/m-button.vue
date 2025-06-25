<template>
	<view
		:class="['button', ghost?'ghost':'', link?'link':'', boxshadow?'boxshadow':'', disabled?'disabled':'', type? 'type-' + type : '', block ? 'block' : '']"
		:style="{
			color: ((ghost || link) && color && !disabled) ? color : '',
			backgroundColor: (!ghost && !link && color && !disabled) ? color : '',
			borderColor: borderColor ? borderColor : (color && ghost && !disabled) ? color : '',
		}" @click="onClick">
		<slot />
	</view>
</template>

<script>
	export default {
		props: ['ghost', 'link', 'boxshadow', 'color', 'disabled', 'rateLimit', 'borderColor', "type", "block"],
		name: "m-button",
		data() {
			return {
				clickRateLimit: false,
			};
		},
		inject: {
			formItemContext: {
				default: undefined
			}
		},
		mounted() {
			this.hasType();
		},
		watch: {
			type(val) {
				this.hasType();
			}
		},
		methods: {
			hasType() {
				if (this.formItemContext) {
					this.formItemContext.hasButtonType = Boolean(this.type);
				}
			},
			onClick(e) {
				if (this.rateLimit) {
					if (this.clickRateLimit) {
						return;
					}
					this.clickRateLimit = setTimeout(() => {
						clearTimeout(this.clickRateLimit);
						this.clickRateLimit = false;
					}, 3000);
				}
				this.$emit('click', e);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.button {
		height: 88rpx;
		line-height: 88rpx;
		font-size: 28rpx;
		border-radius: 44rpx;
		background-color: $blue;
		color: $white;
		text-align: center;
		white-space: nowrap;
		transition: opacity 0.3s ease;
		
		&.block {
			width: 100%;
		}

		&:active {
			opacity: 0.8;
		}

		&.type-delete {
			background-color: $red;
		}

		&.disabled {
			color: $white;
			background-color: $black9;

			&:active {
				opacity: 1;
			}
		}

		&.ghost {
			background: none;
			border: 1px solid $blue;
			color: $blue;
			
			.type-delete {
				border-color: $red;
				color: $red;
			}

			&.disabled {
				color: $black9;
				border-color: $black9;
			}
		}

		&.link {
			background: none;
			color: $blue;
			
			.type-delete {
				color: $red;
			}

			&.disabled {
				color: $black9;
			}
		}

		&.boxshadow {
			box-shadow: 0px 6rpx 16rpx 0px rgba(15, 93, 225, 0.35);
		}
	}
</style>