<!-- 待办公文 -->
<template>
	<div class="right_">
		<fileList :parentData='fileData.fileOne'></fileList>
		<fileList :parentData='fileData.fileTwo'></fileList>
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
			fileData.fileOne.title = '收文'
			fileData.fileTwo.title = '发文'
		},
		components: {
			fileList
		}
	}
</script>

<style></style>
