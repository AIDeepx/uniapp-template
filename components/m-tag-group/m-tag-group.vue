<template>
	<view class="tag-group">
		<slot />
		<m-tag v-for="(text, i) in options" :key="i">{{text}}</m-tag>
	</view>
</template>

<script>
	export default {
		name:"m-tag-group",
		props: {
			options: {
				type: Array,
				default: () => []
			}
		}
	}
</script>

<style lang="scss">
.tag-group {
	
}
</style>