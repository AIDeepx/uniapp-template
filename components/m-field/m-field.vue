<template>
	<view class="z-field">
		<view class="required" v-if="required">*</view>
		<view class="z-field-label">{{ title }}</view>
		<view class="z-field-content">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name:"m-field",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.z-field {
	display: flex;
}
</style>
