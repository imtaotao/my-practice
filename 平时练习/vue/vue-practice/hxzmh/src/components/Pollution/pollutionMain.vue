<!-- 污染防治模块 -->
<template>
<div>
	<div 
	:class="[content(i)]" 
	v-for='(key, i) in titleName'>
	    <div class="policy" style=" width:505px;" v-for='(item, index) in key'>
	        <div class="title" style=" width:505px;">
	            <span class="title_left" style="width: 100%;">{{item}}</span>
	        </div>
	        <div>
	            <chart v-if='i === 0 && index === 0'></chart>
	            <deviceList v-if='i === 0 && index === 1'></deviceList>
	            <license v-if='i === 1 && index === 0'></license>
	            <exposureDesk v-if='i === 1 && index === 1'></exposureDesk>
				<search v-if='i === 2 && index === 0'></search>
				<resourceSum v-if='i === 2 && index === 1'></resourceSum>
	        </div>
	    </div>
	</div>
</div>
</template>

<script>
	import chart from './pollutionChildComponent/chart'
	import deviceList from './pollutionChildComponent/deviceList'
	import exposureDesk from './pollutionChildComponent/exposureDesk'
	import license from './pollutionChildComponent/license'
	import resourceSum from './pollutionChildComponent/resourceSummary'
	import search from './pollutionChildComponent/search'

	export default {
		data() {
			return {
				titleName: [
					['建设项目环评汇总信息', '监测设备运行情况'],
					['许可证总体概况', '国控企业传输有效率曝光台'],
					['污染源档案搜索', '应急筹备资源统计汇总']
				]
			}
		},
		methods: {
			content( i ) {
				return i === 2 ? 'content3' : 'content2'
			}
		},
		components: {
			chart, deviceList, exposureDesk, license, resourceSum, search
		}
	}
</script>

<style>
	.content2 {
	    width: 1024px;
	    height: 242px;
	    margin: 0 auto 10px;
	}
	.content3 {
	    width: 1024px;
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
