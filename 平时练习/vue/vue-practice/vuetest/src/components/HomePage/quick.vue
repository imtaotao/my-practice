<!-- 快捷导航 -->
<template>
	<div class="right_">
		<div class="app">
	        <a href="" target="_blank" v-for='(key, i) in moduleFont'>
	            <div class="app_kuang" :class='[color(i)]'>
	                <ul class="app_kuang_img app_1"></ul>
	                <span>{{key}}</span>
	            </div>
	        </a>
	    </div>
    </div>
</template>

<script>
	export default {
		data() {
			return {
				moduleFont: ['数据中心', '外网门户', '污染源监测', '水环境监测', '环境应急', '应急三维', '环保"一张图"', '移动办公', '一源一档']
			}
		},
		methods: {
			color( i ) {
				i = i >= 5 ? i - 5 : i
				return `color_${i+1}`
			}
		}
	}
</script>

<style>
	.content .right_ .app {
	    float: left;
	}
	.content .right_ .app a {
	    width: 90px;
	    height: 90px;
	    float: left;
	    margin-right: 10px;
	    margin-bottom: 10px;
	    text-align: center;
	}
	.app_kuang_img {
	    width: 40px;
	    height: 40px;
	    position: absolute;
	    left: 28px;
	    top: 20px;
	    background-image: url("../../../static/img/app_ico_3.png");
	}
	.app_kuang {
	    border-radius: 4px;
	    width: 90px;
	    height: 90px;
	    margin: 0px auto;
	    position: relative;
	}
	.content .right_ .app span {
	    width: 90px;
	    color: rgb(255, 255, 255);
	    position: absolute;
	    font-size: 14px;
	    display: block;
	    top: 65px;
	}
	.color_1 { background-color: rgb(57, 172, 229); }
	.color_2 { background-color: rgb(64, 197, 149); }
	.color_3 { background-color: rgb(237, 103, 104); }
	.color_4 { background-color: rgb(255, 179, 13); }
	.color_5 { background-color: rgb(246, 123, 186); }
</style>
