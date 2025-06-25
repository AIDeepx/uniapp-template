<template>
	<view class="m-list">
		<!-- 筛选头部 -->
		<view class="audit-head" v-if="checkboxVisible">
			<view class="cancel" @click="cancel">取消</view>
			<view class="checkall" @click="setSelectAll" v-if="checkbox">{{ mSelectAll ? '取消全选' : '全选' }}</view>
			<view class="checkall" v-if="!checkbox">已选择{{mValue.length}}项</view>
		</view>
		<!-- 列表页 -->
		<scroll-view class="scroll-view" :scroll-y="scroll.y" :scroll-x="scroll.x" :style="cstyle">
			<view class="list-item" v-for="(item, i) in data" :key="i" @click="onClick(item, i)" @longtap="onLongtap(item, i)">
				<div class="content">
					<slot :data-row="item" />
					
					<m-card 
						v-if="!hasSlot()"
						:value="item" 
						:title="keyMap.title" 
						:status="keyMap.status"
						:desc="keyMap.desc" 
						:color-map="colorMap"
						:field-map="fieldMap"
					 />
				</div>
				<div class="iconfont checked" v-if="checkboxVisible">
					{{ mValue.includes(valueKey ? item[valueKey] : i) ? '&#xe686;' : '&#xe63b;' }}
				</div>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'm-list',
		zhName: '列表容器',
		props: {
			data: {
				type: Array,
				default: () => []
			},
			value: {
				type: Array,
				default: () => []
			},
			valueKey: {
				type: String,
				default: () => "id"
			},
			scroll: {
				type: Object,
				default: () => {
					return {
						x: false,
						y: true
					}
				}
			},
			checkbox: {
				type: Boolean,
				default: () => true
			},
			checkboxVisible: {
				type: Boolean,
				default: () => false
			},
			fieldMap: {
				type: Object,
				default: () => undefined
			},
			colorMap: {
				type: Object,
				default: () => {}
			},
			cstyle: {
				type: Object,
				default: () => {
					return {
						marginTop: '20rpx'
					}
				}
			}
		},
		mounted() {
			this.mValue = this.value;
			this.hasSlot();
		},
		watch: {
			value(v) {
				this.mValue = v;
			}
		},
		data() {
			return {
				mValue: [],
				mSelectAll: false,
			}
		},
		methods: {
			hasSlot() {
				return Boolean(this.$slots.$default && this.$slots.$default.length > 0);
			},
			onClick(row, i) {
				if (!this.checkboxVisible) {
					this.$emit('click', {row, i});
					return;
				}
				if (this.checkbox) {
					// 多选
					const valueIdx = this.mValue.indexOf(row[this.valueKey]);
					if (valueIdx !== -1) {
						this.mValue.splice(valueIdx, 1);
					} else {
						this.mValue.push(row[this.valueKey]);
					}
				} else {
					// 单选
					this.mValue = [row[this.valueKey]];
				}
				this.$emit('update:value', this.mValue);
				this.$emit('change', this.mValue);
			},
			onLongtap(row, i) {
				if (!this.checkboxVisible) {
					this.$emit('longtap', {row, i});
					return;
				}
			},
			cancel() {
				this.$emit('update:checkboxVisible', false);
			},
			setSelectAll() {
				this.mSelectAll = !this.mSelectAll;
				const mValue = [];
				if (this.mSelectAll) {
					for (const item of this.data) {
						mValue.push(item[this.valueKey]);
					}
				}
				this.mValue = mValue;
				this.$emit('update:value', mValue);
				this.$emit('change', mValue);
			},
		}
	};
</script>

<style lang="scss" scoped>
	.m-list {
		flex: 1;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow: hidden;

		.scroll-view {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			overflow: hidden;

			.list-item {
				display: flex;
				align-items: center;
				justify-content: space-between;

				&:last-child {
					margin-bottom: 200rpx;
				}

				.checked {
					margin-left: 20rpx;
					color: #5292ff;
					font-size: 40rpx;
					font-weight: 400;
				}

				.content {
					flex: 1;
				}
			}
		}
	
		.audit-head {
			padding: 0 32rpx;
			display: flex;
			align-items: center;
			height: 88rpx;
			line-height: 88rpx;
			justify-content: space-between;
			background-color: #fff;
			color: $blue;
		}
	}
</style>