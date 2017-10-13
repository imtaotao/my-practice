<template>
	<div>
		<div class="mr_con same1" style="min-height:500px;">
            <ul id="listcon">
                <li class="list_li" v-for='key in columnDetail'>
	                <font style="font-size:20px;">·</font>
	                <a href="" target="_blank">
	                	{{key.content}}
	                </a>
                    <span style="float:right;">{{key.time}}</span>
                </li>
            </ul>
        </div>
        <ul class="page" id="page" style="">
        	<li class="pageItemDisable" page-data="1" page-rel="firstpage">首页</li>
        	<li class="pageItemDisable" page-data="0" page-rel="prepage">&lt;上一页</li>
        	<li class="pageItemActive" page-data="1" page-rel="itempage">1</li>
        	<li class="pageItemDisable" page-data="2" page-rel="nextpage">下一页&gt;</li>
        	<li class="pageItemDisable" page-data="1" page-rel="lastpage">尾页</li>
        </ul>
	</div>
</template>

<script>
	export default {
		props: ['columnDetail'],
		data() {
			return {

			}
		}
	}
</script>

<style>
	
</style>