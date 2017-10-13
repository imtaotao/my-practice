<!-- 环境质量模块 -->
<template>
	<div>
		<column-list :coData='eviroment'></column-list>
	</div>
</template>

<script>
	import columnList from '@/components/Column'
	export default {
		data() {
			return {
				eviroment: {
					columnList: ['环境状况公报', '环境质量月报', '空气质量月报', '水质月报', '酸雨月报', '重点污染源监测'],
					module: '环境质量'
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

