<!-- 新闻动态 -->
<template>
	<div class="right_">
        <div class="top">
            <!--- 头条 -->
            <div class="topimg"></div>
            <div class="topfont">

                <a href="" target="_blank">
                    环境保护局组织柴达木职业技术学院、高级...
                    <span>(06.21)</span>
                </a>

                <div class="topsmall">

                    <a href="" target="_blank">
                        地税收入提前实现时间任务“...
                        <span>(06.16)</span>
                    </a>

                    <a href="" target="_blank">
                        西宁-德令哈“星空之城”旅游专列开通
                        <span>(06.12)</span>
                    </a>

                </div>
            </div>
            <!-- 头条end -->
        </div>
        <div class="hot">
            <!-- 图片轮换 -->
            <div class="hot_img slideBox" id="hot_img" style="width: 350px; height: 265px;">
            	<!-- 轮播 -->
                <ul class="items animation" @webkitAnimationEnd='flag && animateEnd($event)' style="width: 1400px; left: 0px;">
                    <li 
                    style="width: 350px; height: 265px;" 
                    v-for='key in [0, 1]' 
                    :data-li = 'key'
                    >
	                    <a href=""  :title="rotation[index(img_i + key)][1]">
	                        <img 
	                        :src="rotation[index(img_i + key)][0]" 
	                        @mouseenter='cancelAnimate' 
	                        @mouseleave='startAnimate' 
	                        width="350" height="265"
	                        >
	                    </a>
                    </li>
                </ul>
            
                <div class="tips" style="opacity: 0.6;">
                    <div class="title">
                        <a href="" target="_blank">{{rotationTitle}}</a>
                    </div>
                    <div class="nums" style="">
                        <a 
                        v-for='(key, i) in rotation' 
                        href="" :class="[isActive(i)]" 
                        @mouseenter='currentImg($event, i)'
                        style="border-radius: 10px;"
                        > 
                        	{{key[1]}}
                        </a>
                    </div>
                </div>
            </div>
            <!-- 新闻列表 -->
            <div class="hot_news">
                <ul>
                    <li v-for='key in newList'>
	                    <dl>
	                        <dd>
	                        	<a href="" target="_blank">{{key[0]}}</a>
	                        </dd>
	                        <dt>{{key[1]}}</dt>
	                    </dl>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图片
				flag: true,
				img_i: 0,
				rotationTitle: '',
				middleWare: null,
				rotation: [
					['static/img/index/img1.png', '海西州环境保护局组织柴达木职业技术学院、海西'],
					['static/img/index/img2.jpg', '海西州环境保护局组织开展“环保进社区”宣传活动'],
					['static/img/index/img3.jpg', '海西州环境保护局参加州红十字会2017年红十字博'],
					['static/img/index/img4.png', '2017年海西州环境保护委员会第二次全体会议']
				],
				// 新闻列表
				newList: [
					['地税收入提前实现时间任务“...', '2017-06-01'],
					['西宁-德令哈“星空之城”旅游专列开通', '2017-06-01'],
					['海西州社会保障兜底工作成效明显', '2017-05-19'],
					['海西州深入开展非法卫星地面接收设...', '2017-06-01'],
					['1至5月乌兰县工业经济运行平稳增长', '2017-05-17'],
					['天峻县以工商登记制度改革激发大众...', '2017-05-15'],
					['海西州开展农牧区污水治理试点建设', '2017-05-11'],
					['“六·五”世界环境日宣传活动  绿水青山就是..', '2017-05-10']
				]
			}
		},
		methods: {
			animateEnd( e ) {
				const ul = this.ul = e.target;
				if ( this.middleWare === null ) {
					this.img_i++
					this.img_i > 3 && ( this.img_i = 0 )
				} else {
					this.img_i = this.middleWare
					this.middleWare = null
				}
				ul.classList.remove( 'animation' )

				this.currentIndex()		// 跟改页面 title 显示信息
				this.animate( ul )
			},
			animate( ul ) {
				this.timeout = setTimeout(() => {
					ul.classList.add( 'animation' )
				}, 3000 )
			},
			index( i ) {
				return i > 3 ? 0 : i
			},

			// 得到当前图片所在的 index
			currentIndex() {
				const index = this.index( this.img_i )
				this.rotationTitle = this.rotation[index][1]
			},

			// 单曲小圆点的显示
			isActive( i ) {
				return i === this.index( this.img_i ) ? 'active' : ''
			},

			// 小圆点的鼠标进入事件
			currentImg( e, i ) {
				const activeNode = e.target.parentElement.querySelector( '.active' )
				activeNode.classList.remove( 'active' )

				// 先停止轮播
				this.cancelAnimate()

				// 把后面那张图标变成需要的图片
				const imgUrl = this.rotation[i][0]
				const img = document.querySelector( '[data-li="1"] img' )
				img.src = imgUrl

				// 添加动画 class
				e.target.classList.add( 'active' )
				this.ul.classList.add( 'animation' )
				this.middleWare = i
				this.flag = true
				
			},

			// 图片进入停止轮播
			cancelAnimate( e ) {
				clearTimeout( this.timeout )
				this.timeout = null
				this.flag = false
				this.ul.classList.remove( 'animation' )
			},

			// 离开图片恢复轮播
			startAnimate() {
				this.flag = true
				this.animate( this.ul )
			}
		}
	}
</script>

<style>
	/* 轮播动画 class */
	.animation {
		animation: slide-lunbo .5s;
	}
	@keyframes slide-lunbo {
		0% { left: 0; }
    	100% { left: -350px }
	}
	.nums .active{
		background: #00da31 !important;
	}
	/* ------------ end ------------ */

	.content .right_ {
	    width: 810px;
	    height: auto;
	    float: right;
	    margin-top: 11px;
	}
	.content .right_ .top {
	    width: 810px;
	    height: 62px;
	    display: block;
	    border-bottom: 1px dashed rgb(204, 204, 204);
	    float: left;
	}
	.content .right_ .top .topimg {
	    width: 108px;
	    height: 60px;
	    float: left;
	    background: rgba(0, 0, 0, 0) url(../../../static/img/top.png) no-repeat scroll 0% 0%
	}
	.content .right_ .top .topfont {
	    width: 702px;
	    height: 60px;
	    float: left;
	    text-align: center;
	}
	.content .right_ .top .topfont a {
	    font-size: 20px;
	    font-family: 微软雅黑;
	    line-height: 38px;
	    color: rgb(0, 0, 0);
	    font-weight: bold;
	}
	.content .right_ .top .topfont a:hover {
	    color: rgb(255, 102, 0);
	}
	.content .right_ .top .topfont .topsmall {
	    width: 702px;
	    height: 20px;
	    text-align: center;
	}
	.content .right_ .top .topfont .topsmall a {
	    width: 280px;
	    font-size: 13px;
	    font-family: 微软雅黑;
	    line-height: 20px;
	    color: rgb(102, 102, 102);
	    font-weight: normal;
	    margin: 0px 10px;
	}
	.content .right_ .top .topfont .topsmall a:hover {
	    color: rgb(255, 102, 0);
	}

	/* hot */
	.content .right_ .hot {
	    width: 810px;
	    height: 265px;
	    float: left;
	    margin-top: 10px;
	}
	.content .right_ .hot .hot_img {
	    width: 350px;
	    height: 265px;
	    float: left;
	    margin: 0px auto;
	    position: relative;
	    font-size: 12px;
	    overflow: hidden;
	    display: block;
	}

	/*------------- 轮播 -----------------*/
	div.slideBox ul.items {
	    position: absolute;
	    float: left;
	    background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;
	    list-style: outside none none;
	    padding: 0px;
	    margin: 0px;
	}
	div.slideBox ul.items li {
	    float: left;
	    background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;
	    list-style: outside none none;
	    padding: 0px;
	    margin: 0px;
	}
	div.slideBox ul.items li a {
	    float: left;
	    line-height: normal !important;
	    padding: 0px !important;
	    border: medium none;
	}
	div.slideBox ul.items li a {
	    float: left;
	    line-height: normal !important;
	    padding: 0px !important;
	    border: medium none;
	}

	/* ---------------- end ------------*/
	div.slideBox div.tips {
	    position: absolute;
	    bottom: 0px;
	    width: 100%;
	    height: 30px;
	    background-color: rgb(0, 0, 0);
	    overflow: hidden;
	}

	div.slideBox div.tips div.title {
	    position: absolute;
	    left: 0px;
	    top: 0px;
	    height: 100%;
	}
	div.slideBox div.tips div.title a {
	    color: rgb(255, 255, 255);
	    font-size: 14px;
	    line-height: 30px;
	    margin-left: 10px;
	    text-decoration: none;
	}
	div.slideBox div.tips div.nums {
	    position: absolute;
	    right: 0px;
	    top: 0px;
	    height: 100%;
	}
	div.slideBox div.tips div.nums a {
	    display: inline-block;
	    width: 10px;
	    height: 10px;
	    background-color: rgb(255, 255, 255);
	    text-indent: -99999px;
	    margin: 10px 5px 0px;
	}
	.content .right_ .hot .hot_news {
	    width: 445px;
	    height: 265px;
	    margin-left: 10px;
	    float: left;
	}
	.content .right_ .hot .hot_news ul {
	    width: 445px;
	    height: 265px;
	    margin: 0px;
	    padding: 0px;
	}
	.content .right_ .hot .hot_news ul li {
	    width: 445px;
	    height: 34px;
	    line-height: 34px;
	    margin: 0px;
	    padding-left: 10px;
	    list-style: outside none none;
	    background-image: url(../../../static/img/tubiao.png);
	    background-repeat: no-repeat;
	    background-position: left center;
	}
	.content .right_ .hot .hot_news ul li dl {
	    width: 445px;
	    float: left;
	}
	.content .right_ .hot_news ul li dl dd {
	    width: 350px;
	    float: left;
	    color: rgb(51, 51, 51);
	    font-family: 微软雅黑;
	    font-size: 14px;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	}
	.content .right_ .hot .hot_news ul li dl dd a {
	    width: 350px;
	    float: left;
	    color: rgb(51, 51, 51);
	    font-family: 微软雅黑;
	    font-size: 14px;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	}
	.content .right_ .hot .hot_news ul li dl dt {
	    width: 85px;
	    float: right;
	    text-align: right;
	    color: rgb(204, 204, 204);
	    font-family: 微软雅黑;
	    font-size: 14px;
	}
	.content .right_ .hot .hot_news ul li dl dd a:hover {
	    width: 350px;
	    float: left;
	    color: rgb(255, 102, 0);
	    font-family: 微软雅黑;
	    font-size: 14px;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	}
</style>
