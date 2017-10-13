<!-- 通知公告 -->
<template>
	<div class="right_">
		<file-list :parentData='fileData.fileOne'></file-list>
        <file-list :parentData='fileData.fileTwo'></file-list>
    </div>
</template>

<script>
	import fileData from './general/fileData'
	import fileList from './general/list'

	export default {
		data() {
			return {
				fileData
			}
		},
		created() {
			fileData.fileOne.title = '通知'
			fileData.fileTwo.title = '公告'
		},
		components: {
			fileList
		}
	}
</script>

<style></style>
