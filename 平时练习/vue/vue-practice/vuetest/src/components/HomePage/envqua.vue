<!-- 环境质量 -->
<template>
	<div class="right_">
		<list-file :parentData='fileData.fileOne'></list-file>
		<list-file :parentData='fileData.fileTwo'></list-file>
		 <div class="xinxi">
            <a href="" target="_blank" v-for='key in bottomList'>
            	<div class="xxbtn">{{key}}</div>
            </a>
        </div>
	</div>
</template>

<script>
	import fileData from './general/fileData'
	import listFile from './general/list'

	export default {
		data() {
			return {
				fileData,
				bottomList: ['空气质量月报', '水质月报', '饮用水源地月报', '酸雨月报', '重点污染源监测']
			}
		},
		created() {
			fileData.fileOne.title = '环境状况公报'
			fileData.fileTwo.title = '环境质量月报'

			// 裁剪数据
			fileData.fileOne.content.splice( 5, 5 )
			fileData.fileTwo.content.splice( 7, 2 )
		},
		components: {
			listFile
		}
	}
</script>

<style>
	.content .right_ .xinxi {
	    height: 90px;
	    float: left;
	    margin-top: 10px;
	}
	.content .right_ .xinxi a {
		float: left;
	}
	.content .right_ .xinxi .xxbtn {
	    width: 146px;
	    height: 36px;
	    float: left;
	    text-align: center;
	    line-height: 36px;
	    color: rgb(102, 102, 102);
	    font-size: 14px;
	    font-family: 微软雅黑;
	    border-radius: 4px;
	    margin: 8px auto 0px 12px;
	    border-width: 1px;
	    border-style: solid;
	    border-color: rgb(204, 204, 204);
	    border-image: initial;
	}
	.content .right_ .xinxi .xxbtn:hover {
		background-color: rgb(31, 132, 222); color: rgb(255, 255, 255);
	}
</style>
