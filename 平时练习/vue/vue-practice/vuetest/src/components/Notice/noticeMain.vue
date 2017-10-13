<!-- 通知公告模块 -->
<template>
	<div>
		<column-list :coData='notice'></column-list>
	</div>
</template>

<script>
	import columnList from '@/components/Column'
	export default {
		data() {
			return {
				notice: {
					columnList: ['通知', '公告'],
					module: '通知公告'
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
