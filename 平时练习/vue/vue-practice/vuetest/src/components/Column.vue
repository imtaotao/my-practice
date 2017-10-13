<!-- 通知公告模块 -->
<template>
	<div class="main clearfix w1024">
	    <div class="left fl column_list">
	        <div class="left_t left_t3" style="background:#0298fd;font-size:18x">
	            <ul class=" column_img_clk iconfont icon-announcement"></ul>
	            <span>{{coData.module}}</span>
	        </div>
	         <div class="l_item" 
	         v-for='(key, i) in coData.columnList' 
	         :class='addOn(i)'
	         @click.stop='toggleMoudle($event)'>
	        	<a href="./" @click.prevent=''><span>{{key}}</span></a>
	        </div>
	    </div>
	    <div class="main_right right_xxgk">
	        <div class="adress">
	            <span>
		            <a 
		            href="" 
		            target="_self" 
		            class="CurrChnlCls" 
		            v-for='(key, i) in title'
					v-if='i < title.length - 1'
		            >{{key}}&gt;&gt;</a>
		            <a
					href="" 
		            target="_self" 
		            class="CurrChnlCls"
		            v-else
		            >{{key}}</a>
	            </span>
	        </div>
	        <div class="mr_title"><p>{{title[2]}}</p></div>

	       <!-- 下面用另外一个组件 -->
	        <column-content 
	        	v-if='this.coData.module !== "通讯录"' 
	        	:columnDetail='columnContent'>
	        </column-content>
	        <column-content-cantact 
		        v-if='this.coData.module === "通讯录"' 
		        :columnDetail='contacts'>
	        </column-content-cantact>
	    </div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import columnListContent from '@/components/columnListContent'
	import columnContentCantact from '@/components/columnContentCantact'
	import util from '@/common/util'

	export default {
		props: ['coData'],
		data() {
			return {
				columnContent: [
					{
						content: '西部矿业股份有限公司大柴旦中间沟-断层沟铅锌矿采矿工程环境影响评价第二次公示',
						time: '2017-04-20'
					},
					{
						content: '青海绿纤环保科技有限公司年产10000吨纤维新材料生产项目环境影响评价公众参与结论公示',
						time: '2017-04-14'
					}
				],
				title: [],

				// 通讯录
				contacts: []
			}
		},
		methods: {
			addOn( i ) {
				return i === 0 ? 'on' : ''
			},
			// 点击事件
			toggleMoudle( e ) {
				const target = e.currentTarget
				const currentName = target.querySelector('span').innerHTML
				util.toggle( target, 'on' )
				Vue.set( this.title, 2, currentName )
			}
		},
		created() {
			this.title.push( '首页' )
			this.title.push( this.coData.module )
			this.title.push( this.coData.columnList[0] )
		},
		components: {
			'columnContent': columnListContent,
			'column-content-cantact': columnContentCantact 
		}
	}
</script>

<style>
	.main {
	    color: #474444;
	    font-size: 14px;
	    margin: 15px auto;
	    width: 1024px;
	}
	.left {
	    width: 230px;
	    background: #f5f5f5;
	    float: left;
	}
	.column_list{
		min-height: 650px;
	}
	.main .main_right {
	    width: 762px;
	    height: auto;
	    float: right;
	    padding-top: 5px;
	}
	.left_t {
	    width: 100%;
	    height: 50px;
	    line-height: 50px;
	    font-size: 16px;
	    color: #fff;
	    text-align: center;
	}
	.main .left .on {
	    background: #d7d7d7;
	}
	.l_item {
	    width: 100%;
	    cursor: pointer;
	}

	.left_t ul {
	    width: 22px;
	    height: 22px;
	    margin: 0px 10px 14px 55px;
	    float: left;
	    font-size: 22px;
	}
	.main a {
	    color: #474444;
	    font-size: 14px;
	}
	.list_li{
		border-bottom:1px solid #eee;
		height:40px;
		line-height:40px;	
	}
	.left_t span {
	    float: left;
	}
	.l_item>a {
	    display: block;
	    width: 200px;
	    margin: 0px 15px;
	    border-bottom: 1px solid #d7d7d7;
	    color: #666666;
	    font-size: 16px;
	}
	.l_item>a>span {
	    padding-left: 5px;
	    text-decoration: none;
	    line-height: 55px;
	}

	/* 右边模块 */
	.main .main_right {
	    width: 762px;
	    height: auto;
	    float: right;
	    padding-top: 5px;
	}
	.main .main_right .adress {
	    height: 40px;
	    line-height: 40px;
	    font-size: 14px;
	}
	.main .main_right .mr_title {
	    width: 760px;
	    height: 34px;
	    border-left: 1px solid #dcdcdc;
	    position: relative;
	    background: #fff;
	    border-bottom: 1px solid #dcdcdc;
	    position: relative;
	}
	.main .main_right .mr_con {
	    width: 740px;
	    padding: 10px;
	    height: auto;
	    border: 1px solid #dcdcdc;
	    border-top: none;
	}
	.page {
	    list-style: none;
	    margin: 10px auto;
	    float: right;
	    text-align: center;
	}

	.main .main_right .adress span {
	    margin: 0 5px;
	    color: #0298fd;
	}
	.main .main_right .mr_title p {
	    font-size: 16px;
	    height: 33px;
	    line-height: 28px;
	    padding: 0 40px;
	    text-align: center;
	    color: #0298fd;
	    border-top: 2px solid #0298fd;
	    border-right: 1px solid #dcdcdc;
	    background: #fff;
	    position: absolute;
	    top: 0;
	}
	.main .main_right .mr_con ul li {
	    position: relative;
	}
	.page>li {
	    float: left;
	    padding: 8px 10px;
	    cursor: pointer;
	}
	.page .pageItemDisable {
	    border: solid thin #DDDDDD;
	    margin: 5px;
	    background-color: #DDDDDD;
	}
	.page .pageItemActive {
	    border: solid thin #0298fd;
	    margin: 5px;
	    background-color: #0298fd;
	    color: white;
	}
	.main .main_right a:hover {
	    color: #F60;
	}
</style>
