<!-- 通讯录模块 -->
<template>
	<div>
		<column-list :coData='contact'></column-list>
	</div>
</template>

<script>
	import columnList from '@/components/Column'
	export default {
		data() {
			return {
				contact: {
					columnList: ['海西州环境保护局', '德令哈市环境保护局', '格尔木市环境保护局'],
					module: '通讯录'
				}
			}
		},
		components: {
			columnList
		}
	}
</script>

<style>
</style>

