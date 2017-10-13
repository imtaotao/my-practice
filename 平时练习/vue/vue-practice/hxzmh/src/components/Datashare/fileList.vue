<!-- 数据分享模块 -->
<template>
    <div class="fg_change" style="display: block;">
        <div class="news2">
            <ul>
                <li v-for='key in data[fileType]'>
	                <dl>
	                    <dd>
		                    <a href="" target="_blank">
		                   		{{key}}
		                    </a>
	                    </dd>
	                </dl>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
	export default {
		props: ['fileType'],
		data() {
			return {
				data: {
					policy: [
						`国务院关于建立完善 部分工业行业淘汰落后生产工艺装备和产品指导目录（2010年本`,
						'部分工业行业淘汰落后生产工艺装备和产品指导目录（2010年本）',
						'部分工业行业淘汰落后生产工艺装备和产品指导目录（2010年本）',
						'国务院关于建立完善部分工业行业淘汰落后生产工艺装备和产品指导目录（2010年本）',
						'部分工业行业淘汰落后生产工艺装备和产品指导目录（2010年本）',
						'部分工业行业淘汰落后生产工艺装备和产品指导目录（2010年本）'
					],
					document: [
						'IOS9001认证质量管理体系贯标方法'
					]
				}
			}
		}
	}
</script>

<style>
	.news2 {
	    width: 497px;
	    height: auto;
	    margin-left: 8px;
	}
	.news2 ul {
	    margin: 0px;
	    padding: 0px;
	}
	.news2 ul li {
	    width: 480px;
	    height: 32px;
	    line-height: 32px;
	    list-style: none;
	    float: left;
	    margin-right: 7px;
	}
	.news2 ul li dl {
	    width: 480px;
	    float: left;
	}
	.news2 ul li dl dd {
	    width: 480px;
	    float: left;
	    color: rgb(51, 51, 51);
	    font-family: 微软雅黑;
	    font-size: 14px;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	}
	.news2 ul li dl dd a {
	    width: 480px;
	    float: left;
	    color: rgb(51, 51, 51);
	    font-family: 微软雅黑;
	    font-size: 14px;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	}
	.news2 ul li dl dd a:hover {
	    width: 480px;
	    float: left;
	    color: rgb(255, 102, 0);
	    font-family: 微软雅黑;
	    font-size: 14px;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	}
</style>
