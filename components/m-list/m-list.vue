<template>
	<view class="m-list">
		<view class="m-list__head" v-if="checkboxVisible">
			<view class="m-list__cancel" @click="cancel">取消</view>
			<view class="m-list__checkall" @click="setSelectAll" v-if="checkbox">{{ mSelectAll ? '取消全选' : '全选' }}</view>
			<view class="m-list__checkall" v-else>已选择{{ mValue.length }}项</view>
		</view>

		<scroll-view class="m-list__scroll" :scroll-y="scroll.y" :scroll-x="scroll.x" :style="cstyle">
			<view
				class="m-list__item"
				v-for="(item, i) in data"
				:key="i"
				@click="onClick(item, i)"
				@longtap="onLongtap(item, i)">
				<view class="m-list__content">
					<slot :data-row="item" />
					<m-card
						v-if="!hasSlot"
						:value="item"
						:field-map="fieldMap"
						:color-map="colorMap" />
				</view>
				<view class="m-list__checked iconfont" v-if="checkboxVisible">
					{{ mValue.includes(valueKey ? item[valueKey] : i) ? '&#xe686;' : '&#xe63b;' }}
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'm-list',
		zhName: '列表容器',
		props: {
			data: { type: Array, default: () => [] },
			value: { type: Array, default: () => [] },
			valueKey: { type: String, default: 'id' },
			scroll: {
				type: Object,
				default: () => ({ x: false, y: true }),
			},
			checkbox: { type: Boolean, default: true },
			checkboxVisible: { type: Boolean, default: false },
			fieldMap: { type: Object, default: undefined },
			colorMap: { type: Object, default: () => ({}) },
			cstyle: {
				type: Object,
				default: () => ({ marginTop: '20rpx' }),
			},
		},
		data() {
			return { mValue: [], mSelectAll: false }
		},
		watch: { value(v) { this.mValue = v } },
		mounted() { this.mValue = this.value },
		computed: {
		hasSlot() {
			return Boolean(this.$slots.default)
		},
		},
		methods: {
			onClick(row, i) {
				if (!this.checkboxVisible) {
					this.$emit('click', { row, i })
					return
				}
				const key = this.valueKey ? row[this.valueKey] : i
				const idx = this.mValue.indexOf(key)
				if (this.checkbox) {
					if (idx > -1) this.mValue.splice(idx, 1)
					else this.mValue.push(key)
				} else {
					this.mValue = [key]
				}
				this.$emit('update:value', this.mValue)
				this.$emit('change', this.mValue)
			},
			onLongtap(row, i) {
				if (!this.checkboxVisible) this.$emit('longtap', { row, i })
			},
			cancel() { this.$emit('update:checkboxVisible', false) },
			setSelectAll() {
				this.mSelectAll = !this.mSelectAll
				this.mValue = this.mSelectAll ? this.data.map((it) => (this.valueKey ? it[this.valueKey] : it)) : []
				this.$emit('update:value', this.mValue)
				this.$emit('change', this.mValue)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-list {
		flex: 1;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow: hidden;

		&__scroll {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			overflow: hidden;

			.m-list__item {
				display: flex;
				align-items: stretch;
				justify-content: space-between;

				&:last-child { margin-bottom: 200rpx; }

				.m-list__checked {
					margin-left: 20rpx;
					align-self: center;
					color: $blue;
					font-size: 40rpx;
				}
				.m-list__content { flex: 1; min-width: 0; }
			}
		}

		&__head {
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
