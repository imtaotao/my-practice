<!-- 整体框架 -->
<template>
<div class="main-container">
	<div class="banner" style="position: relative;">
	    <div class="banner nr">
	        <i><img src="~static/img/nwlogo.png" width="426" height="107" border="0"></i>
	    </div>
	</div>
	<!-- 导航栏 -->
	<nav class="columns" >
	    <router-link :to='key.url' class="column" v-for="key in aNode">
	        <div class="column_c">
	            <ul class="iconfont" :class="[key.className]"></ul>
	            <span class="column_font" v-html="key.content"></span>
	        </div>
	    </router-link>
	</nav>
	<!--  通知 -->
	<div class="tool-wrap" v-show='isHomePage'>
	    <div class="latest-notice"><img src="~static/img/notice.png">最新通知</div>
	    <div id="noticeInfo" class="noticeInfo">
	        <span id="scroll_begin">
	            <a href="" target="_blank">关于暂停使用增值税发票管理新系统有关问题的通知</a>
	            <a href="" target="_blank">重庆市国家税务局2016年度纳税信用A级纳税人名单（2017年5月31日更新）</a>
	            <a href="" target="_blank">重庆市国家税务局关于调整部分农产品增值税进项税额核定扣除标准的公告</a>
	        </span>
	    </div>
	    <div class="noticeDate">2017年6月28日</div>
	</div>
	
	<!-- 模块详情 -->
	<!-- <transition name="fade" > -->
		<router-view></router-view>
	<!-- </transition> -->
	<!-- footer -->
	<main-footer></main-footer>
</div>
</template>

<script>
	import footer from '@/components/footer'
	import util from '@/common/util'
	export default {
		data() {
			return {
				aNode: {
					index: {
						url: '/home',
						className: 'icon-home',
						content: '首&nbsp;&nbsp;&nbsp;&nbsp;页'
					},
					list: {
						url: '/notice',
						className: 'icon-announcement',
						content: '通知公告'
					},
					prevention: {
						url: '/pollution',
						className: 'icon-measures',
						content: '污染防治'
					},
					environmental: {
						url: '/environment',
						className: 'icon-envqua',
						content: '环境质量'
					},
					datashare: {
						url: '/dataShare',
						className: 'icon-data',
						content: '资料共享'
					},
					datacenter: {
						url: '/dataStatis',
						className: 'icon-datastatistics',
						content: '数据统计'
					},
					mailList: {
						url: '/contacts',
						className: 'icon-mainlist',
						content: '通讯录'
					},
				},
				isHomePage: util.isPage( 'home' )
			}
		},
		// 只有首页才有通知
		created() {
			const router = util.router
			router.afterEach((to, from, next) => {
				this.isHomePage = util.isPage( 'home' )
			})
		},
		watch:{
			$route( to,from ){
				// console.log( to )	// 监听路由的变化
			}
		},
		components: {
			'main-footer': footer
		}
	}
</script>

<style>
	.columns{
		margin:14px auto;
		width:1024px;
		height:46px;
	}
	.column{
		float:left;
		width:130px;
		height:44px;
		margin-right:16px;
		border:1px solid #ccc;
		border-radius:4px;
		display:block; color:#666;
	}
	.column:last-child{
		margin-right:0px;
	}
	.column_c{
		width:130px;
		height:44px;
	}
	.column_c ul{
		float:left;
		width: 22px;
		height: 22px;
		display:block;
		margin:11px 10px 0px 15px;
		font-size: 22px;
	}
	.column_font{
		float:left;
		width:72px;
		height:auto;
		font-size:18px;
		font-family:"微软雅黑";
		line-height:44px;
		text-align:center;
		display:block;
		color:#666; 
	}
	.banner {
		margin: 0px auto;
		width: 100%;
		height: 177px;
		background-image: url("~static/img/bg_3.png");
		background-position: center top;
		background-repeat: no-repeat;
	}
	.banner .nr {
		width: 1024px;
		margin: 0px auto;
		padding-top: 37px;
		height: 140px;
		position: relative;
	}
	.clk {
	    background-color: #0298fd;
	    text-decoration: none;
   		color: rgb(51, 51, 51);
	}
	.clk ul,.clk span {
	    color: #fff;
	}

	/* 通知 */
	.tool-wrap {
	    height: 60px;
	    width: 1024px;
	    margin: 0 auto;
	    margin-top: 4px;
	    border: 1px solid #e5e5e5;
	    background-color: #fff;
	}
	.tool-wrap .latest-notice {
	    font-size: 20px;
	    color: #ed6768;
	    width: 150px;
	    line-height: 60px;
	    text-align: center;
	}
	.tool-wrap .noticeInfo {
	    font-size: 16px;
	    width: 660px;
	    height: 60px;
	    line-height: 60px;
	    color: #333;
	    margin-left: 20px;
	    white-space: nowrap;
	    overflow: hidden;
	}
	.tool-wrap .noticeDate {
	    line-height: 60px;
	    float: right;
	    margin: 0 20px;
	}
	.tool-wrap div {
	    float: left;
	}
	.tool-wrap .latest-notice>img {
	    vertical-align: middle;
	    margin-right: 16px;
	}
	.tool-wrap .noticeInfo a:hover {
	    color: #ed6768;
	}
	
</style>