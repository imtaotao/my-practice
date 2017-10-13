<template>
	<div class="policy" style="width: 390px; float: left;" :style="[isright]">
            <div class="title1" style="width: 390px;">
                <span class="title_left" style="width: 110px; border-bottom: 2px solid rgb(31, 132, 222);">
                	{{parentData.title}}
                </span>
                <span class="title_right" style="float: right;"> 
	                <a href="" target="_blank" style="color: rgb(204, 204, 204); font-size: 12px;">
	                	更多&gt;&gt;
	                </a> 
                </span>
            </div>
            <div class="news zfwj">
                <ul>
                    <li v-for='item in parentData.content'>
	                    <dl>
	                        <dd>
	                        	<a href="" target="_blank">{{item.font}}</a>
	                        </dd>
	                        <dt>{{item.time}}</dt>
	                    </dl>
                    </li>
                </ul>
            </div>
        </div>
</template>

<script>
	export default {
		props: ['parentData'],
		data() {
			return {
				
			}
		},
		computed: {
			isright() {
				return this.parentData.style
			}
		}
	}
</script>

<style>
	.content .right_ {
	    width: 810px;
	    height: auto;
	    float: right;
	    margin-top: 11px;
	}
	.content .right_ .policy {
	    height: auto;
	    float: left;
	    display: block;
	    margin-right: 10px;
	}
	.content .right_ .policy .title1 {
	    height: 40px;
	    line-height: 40px;
	    font-size: 18px;
	    color: rgb(102, 102, 102);
	    font-family: 微软雅黑;
	    background-image: url('');
	    background-position: left bottom;
	    background-repeat: no-repeat;
	}
	.content .right_ .policy .zfwj {
	    width: 390px;
	}
	.content .right_ .policy .news {
	    width: 490px;
	    height: 200px;
	    margin-top: 10px;
	}
	.content .right_ .policy .title1 .title_left {
	    float: left;
	}
	a, a:link {
	    text-decoration: none;
	    color: rgb(51, 51, 51);
	}
	.content .right_ .policy .zfwj {
	    width: 390px;
	}
	.content .right_ .policy .news {
	    width: 490px;
	    height: 200px;
	    margin-top: 10px;
	}
	.content .right_ .policy .zfwj ul {
	    width: 390px;
	}
	.content .right_ .policy .news ul {
	    width: 490px;
	    height: 200px;
	    margin: 0px;
	    padding: 0px;
	}
	.content .right_ .policy .zfwj ul li {
	    width: 380px;
	}
	.content .right_ .policy .news ul li {
	    width: 490px;
	    height: 32px;
	    line-height: 32px;
	    margin: 0px;
	    padding-left: 10px;
	    list-style: outside none none;
	    background-image: url('');
	    background-repeat: no-repeat;
	    background-position: left center;
	}

	.content .right_ .policy .news ul li dl dd {
	    width: 370px;
	    float: left;
	    color: rgb(51, 51, 51);
	    font-family: 微软雅黑;
	    font-size: 14px;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	}
	.content .right_ .policy .zfwj ul li dl dd, .content .right_ .policy .zfwj ul li dl dd a, .content .right_ .policy .zfwj ul li dl dd a:hover {
	    width: 280px;
	}
	.content .right_ .policy .news ul li dl dt {
	    width: 120px;
	    float: right;
	    text-align: center;
	    color: rgb(204, 204, 204);
	    font-family: 微软雅黑;
	    font-size: 14px;
	}
	.content .right_ .policy .zfwj ul li dl dt {
	    text-align: right;
	    width: 90px;
	}
	.content .right_ .policy .news ul li dl {
	    width: 490px;
	    float: left;
	}
	.content .right_ .policy .zfwj ul li {
	    width: 380px;
	}
	.content .right_ .policy .zfwj ul li dl {
	    width: 380px;
	}
	.content .right_ .policy .news ul li dl dd a:hover {
	    width: 370px;
	    float: left;
	    color: rgb(255, 102, 0);
	    font-family: 微软雅黑;
	    font-size: 14px;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	}
</style>
