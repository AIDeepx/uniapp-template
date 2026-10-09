<template>
	<view class="m-form">
		<slot />
	</view>
</template>

<script>
	export default {
		name: 'm-form',
		zhName: '表单容器',
		provide() {
			return { formContext: this }
		},
		data() {
			return { items: {} }
		},
		methods: {
			// 表单项在 mounted 时注册自身
			register(item) {
				if (item && item.name) this.items[item.name] = item
			},
			unregister(name) {
				if (name) delete this.items[name]
			},
			// 返回 { valid, errors, data }
			validate() {
				const errors = []
				const data = {}
				for (const name in this.items) {
					const item = this.items[name]
					data[name] = item.getValue()
					const r = item.validate()
					if (!r.valid) errors.push({ name, msg: r.msg })
				}
				return { valid: errors.length === 0, errors, data }
			},
			reset() {
				for (const name in this.items) {
					this.items[name].reset && this.items[name].reset()
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.m-form {
		width: 100%;
	}
</style>
