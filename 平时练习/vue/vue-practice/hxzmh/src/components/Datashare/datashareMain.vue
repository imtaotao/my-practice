<!-- 数据分享模块 -->
<template>
<div>
	<div class="content2">
		<div class="policy" style=" width:505px;">
			<div class="title" style=" width:505px;">
	            <span class="title_left">政策文件</span>
	            <span class="title_right" id="fg_title">
	              <a href="." target="_blank" class="clk">国家文件</a>
	              <a href="" target="_blank" class="">市政府文件</a>
	           </span>
	        </div>
	        <!-- 文件列表 -->
	        <file-list :fileType='type.policy'></file-list>
		</div>
		<div class="policy" style=" width:505px; margin-left:12px">
	        <div class="title" style=" width:505px;">
	            <span class="title_left">文档库</span>
	            <span class="title_right" id="fg_title2">
	              <a href="." target="_blank" class="clk">ISO认证</a>
	              <a href="" target="_blank" class="">公式材料</a>
	           </span>
	        </div>
	        <!-- 文件列表 -->
	        <file-list :fileType='type.document'></file-list>
	    </div>    
	</div>

	<!-- 法律法规与标准库 -->
	<div class="content2">
		<div class="policy" style=" width:505px;">
	        <div class="title" style=" width:505px;">
	            <span class="title_left">标准库</span>
	        </div>
	        <tab-toggle :tabList='tablistLibrary'></tab-toggle>
	    </div>
	    <div class="policy" style=" width:505px;margin-left:12px">
	        <div class="title" style=" width:505px;">
	            <span class="title_left">标准库</span>
	        </div>
	        <tab-toggle :tabList='tablistlaw'></tab-toggle>
	    </div>
    </div>
</div>
</template>

<script>
	import fileList from './fileList'
	import tabToggle from './tabToggle'

	export default {
		data() {
			return {
				type: {policy: 'policy', document: 'document'},
				tablistLibrary: [
					'水环境保护', 
					'大气环境保护', 
					'环境噪声与振动', 
					'土壤环境保护'
				],
				tablistlaw: [
					'水环境',
					'声环境',
					'气环境',
					'固体废物',
					'其他'
				]
			}
		},
		components: {
			fileList,
			tabToggle
		}
	}
</script>

<style>
	.content2 {
	    width: 1024px;
	    height: 242px;
	    margin: 0 auto 10px;
	}
	.policy {
	    height: auto;
	    float: left;
	    display: block;
	}
	.title {
	    height: 40px;
	    line-height: 46px;
	    font-size: 18px;
	    color: #666;
	    font-family: "微软雅黑";
	    background-image: url(~static/img/bg_line_1.png);
	    background-position: bottom left;
	    background-repeat: no-repeat;
	}
	.title .title_left {
	    float: left;
	    width: 75px;
	    font-weight: bold;
	}
	.title .title_right {
	    float: right;
	}
	.title .title_right .clk {
	    background: url(~static/img/bg_title.png) no-repeat;
	}
	.title .title_right a {
	    float: left;
	    margin-top: 12px;
	    width: 70px;
	    font-size: 14px;
	    line-height: 28px;
	    color: #666666;
	    text-align: center;
	}
</style>
