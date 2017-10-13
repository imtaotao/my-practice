<!-- 数据统计模块 -->
<template>
	<div class="content2">
		<div class="policy" style=" width:505px;">
	        <div class="title" style=" width:505px;">
	            <span class="title_left" style=" width:135px;">文章点击排行榜</span>
	        </div>
	        <article-list :articaeContent='clickRank'></article-list>
	    </div>

	    <!-- 文章发布排行榜 -->
	    <div class="policy" style=" width:505px; margin-left:12px">
	        <div class="title" style=" width:505px;">
	            <span class="title_left" style=" width:135px;">文章发布排行榜</span>
	            <span class="title_right" id="fg_title2">
	              <a href="." target="_blank" :class="{'clk':one}" @mouseenter='toggle'>当月</a>
	              <a href="" target="_blank" :class="{'clk':two}" @mouseenter='toggle'>当年</a>
	           </span>
	        </div>
	        <article-list :articaeContent='publicRank'></article-list>
	    </div>
	</div>
</template>

<script>
	import articleList from './articleList'
	import Vue from 'vue'
	export default {
		data() {
			return {
				clickRank: [
					{name: '农村环境综合整治初见成效', num: '1430'},
					{name: '都兰：推进环保宣传助力生态文明建设', num: '1320'},
					{name: '海西州环境保护局举行火电企业排污许可证颁发仪式', num: '1231'},
					{name: '格尔木市环保局积极开展环境卫生整治活动', num: '1208'},
					{name: '海西州环境保护局组织开展“环保进社区”宣传活动', num: '1113'},
					{name: '三江源生态保护与国家公园建设科技合作座谈会召开', num: '1089'},
					{name: '习近平主持召开中央全面深化改革领导小组第三十六次会议...', num: '910'},
					{name: '2016陈吉宁记者会：环保部部长陈吉宁答记者问（完整版）', num: '818'},
					{name: '王振昌同志在围绕“四个转变”推动海西“四个走在全省前...', num: '816'},
					{name: '环境保护部副部长黄润秋在湖南督察时要求 加快推进生态环...', num: '812'}
				],
				publicRank: [
					{name: '信息化与宣传教育中心', num: '40'},
					{name: '办公室', num: '32'},
					{name: '财务科', num: '30'},
					{name: '污控科', num: '28'},
					{name: '规划项目科', num: '24'},
					{name: '监察执法科', num: '22'},
					{name: '监测站...', num: '20'},
					{name: '格尔木市环保局', num: '18'},
					{name: '都兰县环保局', num: '16'},
					{name: '天峻县环保局', num: '12'}
				],
				one: true,
				two: false
			}
		},
		methods: {
			toggle() {
				this.one = !this.one
				this.two = !this.two
				this.publicRank.splice( 1, this.publicRank.length )
			}
		},
		components: {
			articleList
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
	    color: rgb(102, 102, 102);
	    font-family: 微软雅黑;
	    background-image: url(~static/img/bg_line_1.png);
	    background-position: left bottom;
	    background-repeat: no-repeat;
	}
	.title .title_left {
	    float: left;
	    width: 75px;
	    font-weight: bold;
	}

</style>
