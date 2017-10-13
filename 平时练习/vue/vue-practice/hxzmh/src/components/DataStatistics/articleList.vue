<!-- 数据统计模块 -->
<template>
	<div id="fg_change">
	    <div class="fg_change" style="display: block;">
	        <ol class="rank-list hover" id="57-hot">
	            <li class="" v-for='(key, i) in articaeContent'>
	                <i :class="i > 2 ? 'n2' : 'n1'">{{i+1}}</i>
	                <a href="javascript:void(0)">{{key.name}}</a>
	                <span class="num">{{key.num}}</span>
	            </li>
	        </ol>
	    </div>
	</div>
</template>

<script>
	export default {
		props: ['articaeContent']
	}
</script>

<style>
	.rank-list {
	    padding: 7px 0 3px;
	}
	.rank-list li {
	    position: relative;
	    height: 34px;
	    line-height: 34px;
	    padding-left: 26px;
	    border-bottom: 1px solid #e6e6e6;
	}
	.rank-list .n1 {
	    background: #c00;
	    color: #fff;
	}
	.rank-list .n2 {
	    background: #e6e6e6;
	    color: #333;
	}
	.rank-list .n1, .rank-list .n2 {
	    position: absolute;
	    left: 0;
	    top: 8px;
	    width: 18px;
	    height: 18px;
	    font: italic bold 12px/18px "Palatino Linotype","Book Antiqua",Palatino,serif;
	    text-align: center;
	}
	a, a:link {
	    text-decoration: none;
	    color: rgb(51, 51, 51);
	    font-size: 14px;
	}
	.rank-list .num {
	    position: absolute;
	    top: 0;
	    right: 0px;
	    width: 50px;
	    height: 34px;
	    color: #999;
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
	.title .title_right a:hover {
	    color: #F60 !important;
	}
</style>
