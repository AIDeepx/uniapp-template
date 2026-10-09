<template>
	<view class="m-cascade-picker">
		<m-popup v-model="visible" title="请选择" @change="popupChange" :border="false" :disabled="disabled">
			<slot />
			<template v-slot:content>
				<view class="wrapper">
					<m-tabs v-model:value="tabIdx" :data="tabData" size="small" justify-content="flex-start" border
						@change="tabChange"></m-tabs>
					<scroll-view class="m-list" scroll-y>
						<view class="m-item" v-for="(item, i) in mList" :key="i" @click="select(item, i)">
							<view class="m-item-text">{{item[dataText]}}</view>
							<view class="m-item-icon iconfont" v-if="mValue[tabIdx] === item[dataValue]">&#xe643;</view>
						</view>
					</scroll-view>
				</view>
			</template>
		</m-popup>
	</view>
</template>

<script>
	export default {
		name: "m-cascade-picker",
		props: {
			url: {
				type: String,
				default: () => ""
			},
			value: {
				type: Array,
				default: () => []
			},
			valueShow: {
				type: Array,
				default: () => []
			},
			dataValue: {
				type: String,
				default: () => "id"
			},
			dataText: {
				type: String,
				default: () => "text"
			},
			data: {
				type: Object,
				default: () => undefined,
			},
			disabled: {
				type: Boolean,
				default: () => false,
			},
		},
		mounted() {
			this.formatData(this.data);
			this.mValueShow = this.valueShow;
		},
		watch: {
			value(v) {
				this.mValue = v;
			},
			valueShow(v) {
				this.mValueShow = v;
			},
			data(v) {
				this.formatData(v);
			}
		},
		data() {
			return {
				visible: false,
				tabIdx: 0,
				tabData: [],
				mValue: [],
				mValueIdx: [],
				mValueShow: [],
				mList: [],
				mData: new Map(),
			};
		},
		methods: {
			reset() {
				this.tabIdx = 0;
				this.tabData = [];
				this.mValue = [];
				this.mValueShow = [];
				this.mList = [];
				this.mData = new Map();
			},
			formatData(v) {
				const data = new Map();
				const fn = ((_data) => {
					if (!_data) return;
					data.set(_data[this.dataValue], _data);
				});
				v && fn(v);
				this.mData = data;
			},
			popupChange(e) {
				this.reset();
				if (e) {
					if (this.url) {
						this.getTabData();
					}
					this.$emit('open', true);
				} else {
					this.$emit('close', true);
				}
			},
			getTabData(row) {
				const id = row ? row[this.dataValue] : 0;
				this.http.get(this.url, { id }).then(res => {
					if (res.status == 200) {
						this.mData.set(id, res.list);
						this.mList = res.list;
					}
				});
			},
			select(row, i) {
				this.clearValue();
				this.$nextTick(() => {
					this.mValueShow[this.tabIdx] = row[this.dataText];
					this.mValue[this.tabIdx] = row[this.dataValue];
					this.mValueIdx[this.tabIdx] = i;
					this.tabData[this.tabIdx] = row[this.dataText];
					if (!this.tabData[this.tabIdx + 1]) {
						this.tabData[this.tabIdx + 1] = "";
					}
					if (!row.leaf) {
						this.$nextTick(() => {
							this.tabIdx = this.tabIdx + 1;
							this.getTabData(row);
						})
						return;
					}
					this.visible = false;
					this.$emit('update:value', this.mValue);
					this.$emit('update:valueShow', this.mValueShow);
					this.$emit('change', this.mValue);
					this.$emit('close', true);
				})
			},
			tabChange(_i) {
				let id = this.mValue[_i - 1] || 0;
				this.mList = this.mData.get(id);
			},
			clearValue() {
				const len = this.mValue.length;
				for (let i=0; i<len; i++) {
					if (i > this.tabIdx) {
						this.mValue[i] = "";
						this.mValueIdx[i] = "";
						this.tabData[i] = "";
						this.mValueShow[i] = "";
					}
				}
			}
		},
	}
</script>

<style lang="scss">
	.m-cascade-picker {
		.wrapper {
			display: flex;
			height: 100%;
			overflow: hidden;
			flex-direction: column;

			.m-list {
				flex: 1;
				min-height: 0;
				overflow: hidden;

				.m-item {
					display: flex;
					padding: 0 32rpx;
					height: 60rpx;
					line-height: 60rpx;
					font-size: 24rpx;
					box-sizing: border-box;

					.m-item-text {
						flex: 1;
					}

					.m-item-icon {
						color: $blue;
					}
				}
			}
		}
	}
</style>