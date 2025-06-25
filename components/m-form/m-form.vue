<template>
	<view class="z-form"><slot></slot></view>
</template>

<script>
export default {
	name: 'm-form',
	zhName: '表单容器',
	props: {
		form: undefined
	},
	provide() {
		return {
			formContext: this
		};
	},
	mounted() {
		if (this.form) {
			// this.mForm = this.form;
			// this.setFormItemValue();
		}
	},
	watch: {
		// form(val) {
		// 	if (val) {
		// 		this.mForm = val;
		// 		this.setFormItemValue();
		// 	}
		// }
	},
	data() {
		return {
			mForm: {},
			formItemContexts: {}
		};
	},
	methods: {
		initForm(context) {
			this.formItemContexts[context.name] = context;
			// if (this.form && this.form[context.name] !== undefined) {
			// 	this.mForm[context.name] = this.form[context.name];
			// 	return;
			// }
			// this.mForm[context.name] = '';
		},
		setFormValue(name, value) {
			// this.mForm[name] = value;
			// this.$emit('change', this.mForm);
		},
		setFormItemValue() {
			// Object.keys(this.formItemContexts).forEach(name => {
			// 	let ctx = this.formItemContexts[name];
			// 	if (ctx) {
			// 		ctx.mValue = this.mForm[ctx.name];
			// 	}
			// });
		},
		validate() {
			let result = {
				pass: true,
				errors: []
			};
			for (const name of Object.keys(this.formItemContexts)) {
				const context = this.formItemContexts[name];
				if (context.required && this.isEmpty(context.mValue)) {
					context.isError = true;
					result.pass = false;
					result.errors.push({
						name: context.name,
						context
					});
				} else {
					context.isError = false;
				}
			}
			return result;
		},
		isEmpty(val) {
			if (typeof val == 'object') {
				let objstr = JSON.stringify(val);
				if (objstr == '{}' || objstr == '[]') {
					return true;
				}
				return false;
			}
			return !val && val !== 0;
		}
	}
};
</script>

<style lang="scss" scoped>
.z-form {
	width: 100%;
}
</style>
