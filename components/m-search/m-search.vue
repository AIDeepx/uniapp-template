<template>
	<view class="zfui-search">
		<!-- 条件筛选栏目 -->
		<view class="condition">
			<view class="search">
				<i class="iconfont">&#xe621;</i>
				<input type="search" @input="oninput" @confirm="onsearch" placeholder-class="search-tip" :placeholder="placeholder" />
			</view>
			<view v-if="data.length > 0" :class="['other', filterVisible ? 'active' : '']" @click="setCondition()">
				<text>筛选</text>
				<text class="iconfont">&#xe6bc;</text>
			</view>
		</view>
		<!-- 条件筛选详情 -->
		<view :class="['condition-detail', filterVisible ? 'show' : '']">
			<scroll-view class="content">
				<view class="item" v-for="(item, i) in data" :key="i">
					<view class="title">{{ item.title }}</view>
					<view class="tags">
						<view :class="['tag', mValue[item.field] === oitem.id ? 'active' : '', oitem.colspan ? 'colspan-' + oitem.colspan : '']" v-for="oitem in item.tags" :key="oitem.id"   @click="active(item, oitem)">
							<template v-if="!oitem.slot">{{ oitem.text }}</template>
							<slot v-if="oitem.slot" :name="oitem.slot"/>
						</view>
					</view>
				</view>
				<view class="footer">
					<view class="btn reset" @click="reset">重置</view>
					<view class="btn confirm" @click="confirm">确定</view>
				</view>
			</scroll-view>
			<view class="overly"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"m-search",
		props: {
			value: {
				type: Object,
				default: () => ({}),
			},
			data: {
				type: Array,
				default: () => ([]),
			},
			placeholder: {
				type: String,
				default: () => (''),
			},
		},
		watch: {
			value(v) {
				this.mValue = v;
			},
		},
		mounted() {
			this.mValue = this.value;
		},
		data() {
			return {
				filterVisible: false,
				mValue: {},
			};
		},
		methods: {
			reset() {
				this.mValue = {};
				this.$emit('update:value', {});
			},
			confirm() {
				this.$emit('update:value', this.mValue);
				this.$emit('search', this.mValue);
				this.filterVisible = false;
			},
			setCondition() {
				this.filterVisible = !this.filterVisible;
			},
			active(row, oitem) {
				if (oitem.slot) return;
				if (this.mValue[row.field] === oitem.id) {
					this.mValue[row.field] = '';
				} else {
					this.mValue[row.field] = oitem.id;
				}
				this.$emit('update:value', this.mValue);
				this.$emit('change', this.mValue);
			},
			oninput(e) {
				this.mValue.title = e.detail.value;
				this.$emit('update:value', this.mValue);
				this.$emit('change', this.mValue);
				this.$emit('input', this.mValue);
			},
			onsearch() {
				this.$emit('change', this.mValue);
			},
		},
	}
</script>

<style lang="scss" scoped>
.zfui-search{
	position: relative;
	width: 100%;
	.condition {
		@include flex-bt;
		margin-top: 1px;
		padding: 20rpx 32rpx;
		box-sizing: border-box;
		overflow: hidden;
		background-color: $white;
		.search {
			position: relative;
			flex: 1;
			border-radius: 70rpx;
			overflow: hidden;
			.iconfont {
				position: absolute;
				top: 0;
				left: 20rpx;
				line-height: 70rpx;
				font-size: 40rpx;
				color: $black9;
				z-index: 10;
			}
			input {
				width: 100%;
				height: 70rpx;
				line-height: 70rpx;
				font-size: 24rpx;
				padding-left: 70rpx;
				color: $black9;
				box-sizing: border-box;
				background-color: #f5f9fc;
			}
		}
		.other {
			position: relative;
			padding: 0 64rpx 0 32rpx;
			margin-left: 14rpx;
			height: 70rpx;
			line-height: 70rpx;
			color: $blue;
			text-align: center;
			border-radius: 70rpx;
			font-size: 26rpx;
			background-color: #f5f9fc;
			border: 1px solid $blue;
			overflow: hidden;
			&.active {
				color: $white;
				background-color: $blue;
				.iconfont{
					margin-top: -4rpx;
					transform: rotate(180deg);
				}
			}
			.iconfont {
				transition: all 0.3s ease;
				position: absolute;
				top: 2rpx;
				right: 30rpx;
				transform: rotate(0);
			}
		}
	}
	.condition-detail {
		visibility: hidden;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		transition: all 0.3s ease;
		background-color: rgba($color: #000000, $alpha: 0);
		z-index: 999;
		&.show {
			visibility: visible;
			background-color: rgba($color: #000000, $alpha: 0.8);
			.content {
				transform: translateY(0);
			}
		}
		.content {
			transition: all 0.5s ease;
			transform: translateY(-100%);
			background-color: $white;
			box-sizing: border-box;
			overflow: hidden;
			.item {
				padding: 30rpx 0;
				border-top: 1px solid $pageBg;
				.title {
					padding: 0 32rpx;
					font-size: 30rpx;
					font-weight: bold;
					box-sizing: border-box;
					overflow: hidden;
				}
				.tags {
					padding-left: 20rpx;
					margin-top: 20rpx;
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(calc(50% - 24rpx), 1fr));
					grid-gap: 20rpx;
					box-sizing: border-box;
					.tag {
						width: 100%;
						min-width: 0;
						height: 88rpx;
						line-height: 88rpx;
						transition: all 0.3s ease;
						font-size: 26rpx;
						box-sizing: border-box;
						border-radius: 10rpx;
						color: $black5;
						text-align: center;
						overflow: hidden;
						border: 1px solid #f5f9fc;
						background-color: #f5f9fc;
						&.colspan-2 {
							width: calc(100% - 20rpx);
						}
						&.active {
							color: $white;
							border: 1px solid $blue;
							background-color: $blue;
						}
					}
				}
			}
			.footer{
				@include flex-bt;
				margin-top: 50rpx;
				padding: 30rpx 32rpx;
				box-sizing: border-box;
				border-top: 1px solid $pageBg;
				overflow: hidden;
				.btn{
					flex: 1;
					height: 90rpx;
					line-height: 90rpx;
					text-align: center;
					font-size: 28rpx;
					border-radius: 90rpx;
					border: 1px solid #ACBCD2;
					&:last-child{
						margin-left: 14rpx;
					}
					&.confirm{
						color: $white;
						border: 1px solid $blue;
						background-color: $blue;
					}
				}
			}
		}
	}
}
</style>
