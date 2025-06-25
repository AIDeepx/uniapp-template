<template>
	<view class="container">
		<view class="mSearch">
			<input class="mSearch-ctrl" type="text" v-model="mSearch" placeholder="输入姓名" @input="bindmSearch" />
			<view class="mSearch-icon iconfont">&#xe621;</view>
			<view class="mSearch-del-icon iconfont" v-show="mSearch.length > 0" @click="clearmSearch">&#xe68a;</view>
		</view>
	
		<scroll-view class="list" scroll-y>
			<view class="cell" v-for="item in list" :key="item.id"  @click="bindCheck(item)">
				<view class="cell-content">
					<view class="head">
						<view class="title">{{item.text}}</view>
						<view class="code">{{item.CustomerCode}}</view>
					</view>
					<view class="tags">
						<view class="tag">{{item.job}}</view>
						<view :class="{'tag': true, 'tag-red': item.RiskName == '高风险'}">{{item.RiskName}}</view>
						<view class="tag">{{item.SpeakerLevelName}}</view>
						<view class="tag">{{item.TitleLevelName}}</view>
					</view>
					<view class="desc" v-if="item.title">{{item.title}}</view>
					<view class="desc">{{item.deptName}}-{{item.orgName}}</view>
				</view>
				<view class="cell-title">
					<view class="cell-title-checkbox iconfont">{{ checked.id === item.id ? '&#xe686;' : '&#xe63b;' }}</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	name: 'external-lecturer',
	props: {
		search: {
			type: String,
			default: () => 0,
		},
		value: {
			type: Number | String,
			default: () => 0
		},
		text: {
			type: String,
			default: () => ''
		}
	},
	async mounted(options) {
		this.options = options;
		this.init();
		this.getList();
	},
	data() {
		return {
			options: {},
			userinfo: {},
			list: [],
			checked: {},
			mSearch: '',
			mSearchRate: '',
		};
	},
	watch: {
		value(val) {
			this.checked.id = val;
		},
		text(val) {
			this.checked.cname = val;
		},
		search(val) {
			this.mSearch = val;
		},
	},
	methods: {
		init() {
			if (!this.value) return;
			this.mSearch = this.search;
			this.checked = {
				id: this.value,
				cname: this.text,
			}
		},
		getList() {
			uni.showLoading({
				title: '加载中...'
			})
			this.http
				.get(this.api.apply.SpeakerPersonsList, {
					params: {
						q: this.mSearch
					}
				})
				.then(res => {
					if (res.status == 200) {
						this.list = res.list;
					}
				})
				.finally(() => {
					uni.hideLoading();
				});
		},
		bindmSearch(e) {
			clearTimeout(this.mSearchRate);
			this.mSearchRate = setTimeout(() => {
				this.pageIdx = 0;
				this.$emit('update:search', e.detail.value);
				this.mSearchRate = '';
				this.getList();
			}, 500);
		},
		clearmSearch() {
			this.pageIdx = 0;
			this.mSearch = '';
			this.$emit('update:search', '');
			this.getList();
		},
		bindCheck(row) {
			// 外包讲师高风险不能选择
			if (row.RiskName == '高风险') {
				uni.showToast({
					title: '高风险讲师暂时不能选',
					icon: 'none'
				});
				return;
			}
			this.checked = row;
			this.$emit('update:value', row.id);
			this.$emit('update:text', row.text);
			this.$emit('change', row);
		},
		save() {
			
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	overflow: hidden;

	.mSearch {
		position: relative;
		padding: 20rpx 32rpx;
		box-sizing: border-box;
		background-color: $white;

		.mSearch-ctrl {
			display: block;
			width: 100%;
			height: 66rpx;
			line-height: 66rpx;
			padding: 0 32rpx 0 60rpx;
			border: 1px solid #c0c0c0;
			box-sizing: border-box;
			border-radius: 16rpx;
			font-size: 28rpx;
		}

		.mSearch-icon {
			position: absolute;
			top: 20rpx;
			left: 52rpx;
			height: 66rpx;
			line-height: 66rpx;
			color: $black9;
		}

		.mSearch-del-icon {
			position: absolute;
			top: 20rpx;
			right: 52rpx;
			height: 66rpx;
			line-height: 66rpx;
			color: $black9;
		}
	}

	.select-head {
		margin-top: 1px;
		padding: 0 32rpx;
		height: 66rpx;
		line-height: 66rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		background-color: #fff;
		.left-text, .right-text {
			font-size: 26rpx;
			color: $blue;
		}
	}

	.list {
		margin-top: 1px;
		flex: 1;
		padding-bottom: 200rpx;
		box-sizing: border-box;
	}

	.checked-box {
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 100vh;
		left: 0;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		background-color: $white;
		visibility: hidden;
		transition: all 0.3s ease;
		opacity: 0.8;

		&.show {
			top: 0;
			visibility: visible;
			opacity: 1;
		}

		.checked-box-head {
			position: relative;
			display: flex;
			height: 88rpx;
			line-height: 88rpx;
			border-bottom: 1px solid $pageBg;

			.title {
				width: 100%;
				text-align: center;
			}

			.close {
				position: absolute;
				right: 32rpx;
				top: 0;
				line-height: 88rpx;
				color: $black9;
			}
		}
	}

	.checked-person {
		flex: 1;
		padding-bottom: 200rpx;
		box-sizing: border-box;
	}

	.cell {
		position: relative;
		display: flex;
		align-items: start;
		justify-content: space-between;
		background-color: $white;

		&::after {
			position: absolute;
			bottom: 0;
			left: 32rpx;
			width: calc(100% - 64rpx);
			height: 1px;
			background-color: $pageBg;
			content: '';
		}

		.cell-title,
		.cell-content {
			padding: 30rpx 32rpx;
			box-sizing: border-box;
		}

		.cell-title {
			padding-left: 0;
			display: flex;
			align-items: center;
			font-size: 32rpx;
			color: $black5;

			.cell-title-checkbox {
				color: $blue;
			}
		}

		.cell-content {
			padding-right: 0;
			font-size: 28rpx;
			.head {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				.title {
					font-size: 32rpx;
					line-height: 32rpx;
					font-weight: 700;
				}
				.code {
					margin-left: 20rpx;
					font-size: 28rpx;
					line-height: 28rpx;
				}
			}
			.tags {
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				gap: 10px;
				.tag {
					padding: 4rpx 8rpx;
					display: inline-block;
					line-height: 24rpx;
					border: 1px solid $blue;
					font-size: 24rpx;
					border-radius: 6rpx;
					color: $blue;
					box-sizing: border-box;
					&.tag-red {
						color: $red;
						border-color: $red;
					}
				}
			}
			.desc {
				margin-top: 20rpx;
				line-height: 28rpx;
				font-size: 24rpx;
				color: $black9;
			}
				
			.items {
				margin-top: 24rpx;
			}
		}

		&.active {
			color: $blue;

			.cell-title {
				color: $blue;
			}
		}
	}

	.select-content {
		height: 80vh;
		overflow: hidden;
		box-sizing: border-box;
	}
}
</style>
