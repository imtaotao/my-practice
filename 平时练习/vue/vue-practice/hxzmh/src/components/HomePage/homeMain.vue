<!-- Index 模块 -->
<template>
	<div class="content">
		<div class="left">
	        <ul>
	            <li v-for='key in routeInfo' >
		            <router-link :to=key.url active-class='img_back' >
			            <div>
				            <ul class="iconfont font_img" :class='[key.className]'></ul>
				            <span class="ioc_font">{{key.name[0]}}</span>
				            <p class="ico_en">{{key.name[1]}}</p>
			            </div>
		            </router-link>
		        </li>
	        </ul>
	    </div>

	    <router-view></router-view>
	</div>
</template>
	
<script>
	import util from '@/common/util'

	export default {
		data() {
			return {
				routeInfo : {
					NEWS : {
						url: '/home/news',
						className: 'icon-news',
						name: ['新闻动态', 'NEWS']
					},
					ANNOUNCEMENTS : {
						url: '/home/announ',
						className: 'icon-announcement',
						name: ['通知公告', 'ANNOUNCEMENTS']
					},
					QUICK : {
						url: '/home/quick',
						className: 'icon-nav',
						name: ['快捷导航', 'QUICK NAVIGATION']
					},
					OFFICIAL : {
						url: '/home/official',
						className: 'icon-gongwen',
						name: ['待办公文', 'OFFICIAL DOCUMENT']
					},
					ENVIRONMENTAL : {
						url: '/home/envqua',
						className: 'icon-envqua',
						name: ['环境质量', 'ENVIRONMENTAL QUALITY']
					},
					POLICY : {
						url: '/home/policy',
						className: 'icon-zhengce',
						name: ['政策文件', 'POLICY DOCUMENT']
					}
				}
			}
		},
		created() {
           util.open( '/home/news' )
        },
	}
</script>

<style>
	.content {
	    width: 1000px;
	    margin: 0px auto;
	    border: 1px solid rgb(204, 204, 204);
	    padding: 12px;
	    padding-bottom: 10px;
	    margin-top: 20px;
	    overflow: hidden;
	}
	.content .left {
	    width: 170px;
	    float: left;
	}
	.content .left ul {
	    width: 170px;
	    float: left;
	    margin: 0px;
	    padding: 0px;
	}
	.content .left ul li {
	    width: 170px;
	    height: 57px;
	    margin-bottom: 6px;
	    list-style: outside none none;
	}
	.content .left ul li a {
	    width: 170px;
	    height: 57px;
	    float: left;
	    background-color: rgb(229, 229, 229);
	    list-style: outside none none;
	    display: block;
	    text-decoration: none;
	    color: rgb(102, 102, 102);
	}
	.content .left ul li a div {
	    width: 170px;
	    height: 57px;
	    margin: 0px auto;
	    position: relative;
	}
	.content .left ul li a div ul {
	    width: 32px;
	    height: 32px;
	    position: absolute;
	    left: 25px;
	    font-size: 32px;
	    margin-top: 5px;
	}
	.content .left ul li .ioc_font {
	    font-size: 16px;
	    font-family: "微软雅黑";
	    line-height: 44px;
	    margin-left: 68px;
	}
	.content .left ul li .ico_en {
	    font-size: 8px;
	    font-family: Cambria,"Hoefler Text","Liberation Serif",Times,"Times New Roman",serif;
	    margin-top: -4px;
	    width: 100%;
	    text-align: center;
	}
	.img_back {
		background: rgba(0, 0, 0, 0) url("../../../static/img/bg_chl.jpg") no-repeat scroll 0% 0%;
	}
	.img_back ul,.img_back span,.img_back p{
		font-size: 32px;
		color: #fff;
	}
</style>
