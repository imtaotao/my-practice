/**
 *	route组件代码优化
 *	各个方法作说明，提高可读性
 *	对外接口，说明作用以及展示实例
 *	对可能产生bug的地方，做详细说明
 **/


/**
	html页面配置项及说明

	->	view 	data-view="view"	用于设置视图容器
		->	page 	data-role="page"	用于选定页面范围
			->	a 		href					用于指定html路径（内部页面加载）
						data-param="xxx"		用于传递参数
						data-reverse="back"		用于指定反向动画
						data-cache="false"		用于指定不用缓存（默认缓存）
						data-rel="return"		用于指定回退（不用指定html路径）
						data-href="xxx.com"		用于外部链接跳转

			->	script 	用于指定加载的js文件路径，以级内联JavaScript语句块

	*-------------------------------------------------------------------------------*
	js配置项说明

	route.config({
		data : {},			用于传递参数
		back : "back",		用于指定反向动画
		cache : "false",	用于指定不用缓存（默认缓存）
		jsUrl : "xx.js"		用于指定加载的js文件路径
	})


	*----------------------------------注意-----------------------------------------*
	*	请勿同时在html页面和js文件中配置js文件url，否则会导致加载两次

**/

(function( window, undefined ){
	// 保存是否已经初始化的信息
	let isInited = false;
	/*-----------------------------------------工具类-----------------------------------------------------------*/	
	/**
	 *	通用工具类
	 *	主要用于内部使用，但考虑到代码的复用性以及可扩展性，注册到全局
	 *	dom选择器以及通用的样式操作
	 *	内部aop接口与外部aop接口
	**/

	window.Tools = {
		/**
		 *	选择器，对外开放
		 *	@param 		select	css3选择器（ 必须的 ）
		 *	@result		单一dom元素 或 dom类数组对象
		 *	@example	Tools.$( '#id' );
		 				Tools.$( '[data-role=page]' );
		**/ 
		$ : function( select ) {
			if( !select ) return this;
			let el = document.querySelectorAll( select );
			el.length == 0 ? el = null :
			el.length == 1 ? el = el[0] :
								 el = el;
			return el;
		},

		/**
		 *	控制元素的显示，对外开放
		 *	@param 		elect：	dom元素（ 必须的 ）
		 *	@result		undefined
		 *	@example	Tools.show( el );
		**/ 	
		show : function( el ) {
			el.style.display = "block";
		},

		// 与show方法用法一致
		hide : function( el ) {
			el.style.display = "none";
		},

		/**
		 *  仅供内部使用，判断容器元素子节点是否从空到不为空，
		 	仅仅为jquery.ready方法的残缺版本，不适用于所有场合

		 *	@param 		el： 	dom元素（ 必须的 ）
		 				fun：	回调函数（ 必须的 ）

		 *	@result		undefined
		 *	@example	Tools.ready( el, function(){ ... } );
		**/
		ready : function( el , fun ) {
			let me = this;
			setTimeout(function(){
				if( !me.isObj( el ) ) {
					let el_html = el.innerHTML;
					if( !!el_html && el_html != '' ) {
						fun.call( el )
					}else{
						me.ready( el , fun )
					}
				}else{
					for( let i = 0 ; i < el.length ; el++ ) {
						if( !el_html && el_html == '' ) {
							me.ready( el , fun )
						}
					}
					fun.call( el )
				}
			} , 5 )
		},
		/**
		 *  类型判断，对外开放

		 *	@param 		val：	被判断的参数（ 必须的 ）
		 *	@result		boolean
		 *	@example	Tools.isFun( function(){ ... } );
		 				Tools.isArr( [1,2,3] );
		 				Tools.isString( 'aaa' );
		**/
		isFun : function( val ) {
			return Object.prototype.toString.call( val ) === '[object Function]';
		},
		isArr : function( val ) {
			return Object.prototype.toString.call( val ) === '[object Array]';
		},
		isString : function( val ) {
			return Object.prototype.toString.call( val ) === '[object String]';
		},
		isObj : function( val ) {
			return Object.prototype.toString.call( val ) === '[object Object]';
		},
		isNum : function( val ) {
			return Object.prototype.toString.call( val ) === '[object Number]';
		},

		/**
		 *  自定义显示框，对外开放

		 *	@param 		text：		用于显示的文本内容（ 必须的 ）
						duration：	显示时长，不传默认为1000毫秒

		 *	@result		undefined
		 *	@example	Tools.alert( '弹弹弹，弹走鱼尾纹' );
		 				Tools.alert( '弹弹弹，弹走鱼尾纹', 1000 )
		**/
		alert : function( text , duration ) {
			duration = this.isNum( duration ) ? duration : 1000;

	        let showBox = document.createElement('div');
	        showBox.innerHTML = text;

	        showBox.style.cssText =   'width:60%;'
	        						+ 'min-width:150px;' 
	        						+ 'background:#000;' 
	        						+ 'opacity:0.5;' 
	        						+ 'height:40px;' 
	        						+ 'color:#fff;' 
	        						+ 'line-height:40px;'
	        						+ 'text-align:center;' 
	        						+ 'border-radius:5px;' 
	        						+ 'position:fixed;' 
	        						+ 'top:30%;' 
	        						+ 'left:20%;' 
	        						+ 'z-index:999999;' 
	        						+ 'font-weight:bold;';

	        document.body.appendChild( showBox );

	        setTimeout( function () {
	            showBox.style.webkitTransition = '-webkit-transform 0.5s ease-in, opacity 0.5s ease-in';
	            showBox.style.opacity = '0';
	            setTimeout( function () {
	                document.body.removeChild( showBox );
	            }, 500 );
	        }, duration );
		},

		/**
		 *  仅供内部使用的aop方法

		 *	@param 		origin ： 		源方法（ 必须的 ）
						before ： 		源方法执行之前的方法 
						after ： 		源方法执行之后的方法
						changeParam : 	是否修改参数(true or false)，默认为 false

		 *	@result		origin( result );
		 *	@example	Tools.eventAop( origin, function( args ){ ... }, function( args ){ ... }, true );
		 				Tools.eventAop( origin, null, function( args ){ ... } )
		**/
		eventAop : function( origin, before, after, changeParam ) {
			return function() {
				// 默认不改动参数
		    	let args = !changeParam ? JSON.parse( JSON.stringify( arguments ) ) : arguments;
		    	!!before && before.call( this , args );

		        let res = origin.apply( this , arguments );

		        !!after && after.call( this , args , res );

		        return res;   
			};
		},

		// 队列操作
		queue : {
			fx : {},
			// 入队
			on : function( type, fun ) {
				// type必须为字符串，fun为回调 

				// 入队操作
				if( !Tools.queue.fx[type] ) {
					Tools.queue.fx[type] = [( next ) => fun( next ) ];

					// 进程锁
					Tools.queue.fx[type].open = false;

					// 初始化
					Tools.queue.fire( type )
				}else {
					Tools.queue.fx[type].push( ( next ) => fun( next ) );
				};
			},

			fire : function( type ) {
				if( !Tools.queue.fx[type] ) return;
				if( !Tools.queue.fx[type].open ) {
					// 判断队列是否执行完毕
					if( Object.keys( Tools.queue.fx[type] ).length == 1 ){
						Tools.queue.fx[type] = null;
						
						// 触发事件（判断是否为js加载）
						if( type === 'jsload' ) {
							onEvent.fire( 'renderafter' )
						};
						return 
					}

					// 下一个队列函数（出栈）
					let first = Tools.queue.fx[type].shift();
					!!first && ( Tools.queue.fx[type].open = true ) && first(function() {
						// 反正浏览器标签后退点击太快
						if( !Tools.queue.fx[type] )  return
							
						// 解开进程锁
						Tools.queue.fx[type].open = false;
						Tools.queue.fire( type );
					})
				};
			}
		},
	};




	/*-----------------------------------------动画引擎-----------------------------------------------------------*/ 

	/**
	 *	动画引擎，用于dom的动画操作，
	 *	注意：对于transfrom类的动画属性，如果参数为当前元素本来的值，会导致transform类的属性动画失效，
	 		  接口放置在元素的prototype里面，请不要重复命名防止冲突。
	 *
	 *	animate，delay，stop，clearAnimate四个接口对外开放
	**/
	// =====================================第一部分（矩阵操作）======================================= //
	let matrix3d = {
		// 工具函数，拼接成matrix3d字符串
		mtxSplice : function( arr ) {
			let newMatrix = 'matrix3d(';

			arr.forEach(function( val, i ) {
				newMatrix += i != arr.length - 1 ? val + ',' : val;	
			});

			return newMatrix += ')'
		},
		translate3d : function( matrix, x, y, z ) {
			let c12 = x * matrix[0] + y * matrix[4] + z * matrix[8] + Number( matrix[12] ),
				c13 = x * matrix[1] + y * matrix[5] + z * matrix[9] + Number( matrix[13] ),
				c14 = x * matrix[2] + y * matrix[6] + z * matrix[10] + Number( matrix[14] ),
				c15 = x * matrix[3] + y * matrix[7] + z * matrix[11] + Number( matrix[15] ),
				arr = [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], matrix[6], matrix[7], matrix[8], matrix[9], matrix[10], matrix[11], c12, c13, c14, c15];

			return arr;
		},
		translateX : function( matrix, x ) {
			return this.translate3d( matrix, x, 0, 0 );
		},
		translateY : function( matrix, y ) {
			return this.translate3d( matrix, 0, y, 0 );
		},
		translateZ : function( matrix, z ) {
			return this.translate3d( matrix, 0, 0, z );
		},
		translate : function( matrix, x, y ) {
			return this.translate3d( matrix, x, y, 0 );
		},

		// scale
		scale3d : function( matrix, x, y, z  ) {
			// 计算
			let s0 = matrix[0] * x, s4 = matrix[4] * y, s8 = matrix[8] * z,
				s1 = matrix[1] * x, s5 = matrix[5] * y, s9 = matrix[9] * z,
				s2 = matrix[2] * x,	s6 = matrix[6] * y, s10 = matrix[10] * z,
				s3 = matrix[3] * x, s7 = matrix[7] * y, s11 = matrix[11] * z,
				arr = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, matrix[12], matrix[13], matrix[14], matrix[15]];
			return arr;
		},
		scaleX : function( matrix, x ) {
			return this.scale3d( matrix, x, 1, 1 );
		},
		scaleY : function( matrix, y ) {
			return this.scale3d( matrix, 1, y, 1 );
		},
		scaleZ : function( matrix, z ) {
			return this.scale3d( matrix, 1, 1, z );
		},
		scale : function( matrix, x, y ) {
			return this.scale3d( matrix, x, y, 1 );
		},

		// rotate
		rotate3d : function( matrix, x, y, z, deg  ) {
			let agl = Math.PI * deg / 180,
				numSqrt = Math.sqrt( x*x + y*y + z*z ),
				ux = x / numSqrt,
				uy = y / numSqrt,
				uz = z / numSqrt;

			// 计算
			let r0 = ux * ux * ( 1 - Math.cos( agl ) ) + Math.cos( agl ),
				r1 = ux * uy * ( 1 - Math.cos( agl ) ) + uz * Math.sin( agl ),
				r2 = ux * uz * ( 1 - Math.cos( agl ) ) - uy * Math.sin( agl ),
				r4 = ux * uy * ( 1 - Math.cos( agl ) ) - uz * Math.sin( agl ),
				r5 = uy * uy * ( 1 - Math.cos( agl ) ) + Math.cos( agl ),
				r6 = uz * uy * ( 1 - Math.cos( agl ) ) + ux * Math.sin( agl ),
				r8 = ux * uz * ( 1 - Math.cos( agl ) ) + uy * Math.sin( agl ),
				r9 = uy * uz * ( 1 - Math.cos( agl ) ) - ux * Math.sin( agl ),
				r10 = uz * uz * ( 1 - Math.cos( agl ) ) + Math.cos( agl );

			let d0 = matrix[0] * r0 + matrix[4] * r1 + matrix[8] * r2,
				d1 = matrix[1] * r0 + matrix[5] * r1 + matrix[9] * r2,
				d2 = matrix[2] * r0 + matrix[6] * r1 + matrix[10] * r2,
				d3 = matrix[3] * r0 + matrix[7] * r1 + matrix[11] * r2,
				d4 = matrix[0] * r4 + matrix[4] * r5 + matrix[8] * r6,
				d5 = matrix[1] * r4 + matrix[5] * r5 + matrix[9] * r6,
				d6 = matrix[2] * r4 + matrix[6] * r5 + matrix[10] * r6,
				d7 = matrix[3] * r4 + matrix[7] * r5 + matrix[11] * r6,
				d8 = matrix[0] * r8 + matrix[4] * r9 + matrix[8] * r10,
				d9 = matrix[1] * r8 + matrix[5] * r9 + matrix[9] * r10,
				d10 = matrix[2] * r8 + matrix[6] * r9 + matrix[10] * r10,
				d11 = matrix[3] * r8 + matrix[7] * r9 + matrix[11] * r10,
				arr = [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, matrix[12], matrix[13], matrix[14], matrix[15]];

			return  arr;
		},
		rotateX : function( matrix, deg ) {
			return this.rotate3d( matrix, 1, 0, 0, deg );
		},
		rotateY : function( matrix, deg ) {
			return this.rotate3d( matrix, 0, 1, 0, deg );
		},
		rotateZ : function( matrix, deg ) {
			return this.rotate3d( matrix, 0, 0, 1, deg );
		},
		rotate : function( matrix, deg ) {
			return this.rotate3d( matrix, 0, 0, 1, deg );
		},

		// skew
		skew : function( matrix, x, y ) {
			let xtan = Math.tan ( Math.PI * x / 180 ),
				ytan = Math.tan ( Math.PI * y / 180 );

			let f0 = Number( matrix[0] ) + matrix[4] * ytan,
				f1 = Number( matrix[1] ) + matrix[5] * ytan,
				f2 = Number( matrix[2] ) + matrix[6] * ytan,
				f3 = Number( matrix[3] ) + matrix[7] * ytan,
				f4 = matrix[0] * xtan + Number( matrix[4] ),
				f5 = matrix[1] * xtan + Number( matrix[5] ),
				f6 = matrix[2] * xtan + Number( matrix[6] ),
				f7 = matrix[3] * xtan + Number( matrix[7] ),
				arr = [f0, f1, f2, f3, f4, f5, f6, f7, matrix[8], matrix[9], matrix[10], matrix[11], matrix[12], matrix[13], matrix[14], matrix[15]];

			return arr;
		},
		skewX : function( matrix, x ) {
			return this.skew( matrix, x, 0 );
		},
		skewY : function( matrix, y ) {
			return this.skew( matrix, 0, y );
		}

	}

	// =====================================第二部分（动画操作）======================================= //

	// 获取时间（生成时间后清空）
	/* ---------------------------------------------------------------------------------------------- */
	function createFxNow() {
		setTimeout(function(){
			Animate.fxNow = undefined;
		})
		return ( Animate.fxNow = Date.now() )
	};


	// 缓动对象，用于封装每个单独属性的动作
	/* ---------------------------------------------------------------------------------------------- */
	function tweens( val, key, option ) {
		this.elem = option.elem;							// 元素
		this.transform = option.prop.transform;				// transform属性集合
		this.key = key;										// 属性名
		this.end = val;										// 最终的目标属性值
		this.start = this.now = this.get();					// 目标的开始值
	};

	tweens.prototype = {
		get : function(){
			// 先得到这个元素的所有样式
			let computed = this.getStyles( this.elem ),
				endProp;

			// 得到具体的样式
			endProp = computed.getPropertyValue( this.key ) || computed[this.key];

			if( !endProp ) return;
			// 判断是否是颜色（拿到的值会自动转化为rgb小写）
			if ( endProp.includes( 'rgb' ) ) return this.colorRgba( endProp );

			return this.isNum( parseInt( endProp ) ) ? parseInt( endProp ) : this.getTransform( endProp );	
		},

		run : function( percent ) {
			// 总距离 * 百分比 + 开始的距离 = 元素应该在的位置
			// 如果start是个数组的话，就代表获取到的是矩阵或者颜色
			if( !this.start && this.start != 0 ) return;
			if( !this.start.length ) {
				this.now = ( this.end - this.start ) * this.swing( percent ) + this.start;

				//动态改变元素css属性值
				this.elem.style[this.key] = this.key === ( 'opacity' || 'zIndex' ) ? this.now : this.now + 'px';
			}else if( this.start.length > 4 ) {
				// transfrom的情况
				let result = this.changeProp( this.transform , percent ),
					matrix = this.getEnd( this.start, result );

				this.elem.style[this.key] = matrix3d.mtxSplice( matrix );
			}else {
				// 颜色的情况

				let end;
				// 判断传入的是数组还是颜色值
				if( !this.isArr( this.end ) ) {
					end = this.colorRgba( this.end );
				}else{
					end = this.colorRgba( this.end[0], this.end[1] );
				};

				let	colorList = this.changeColor( this.start, end , percent ),
					now = "rgba(" + colorList.join(",") + ")";

					this.elem.style[this.key] = now;
			}

			return this;
		},

		// 随时间变化改变的属性值，用来获取颜色值
		changeColor : function( start, end, percent ) {
			let colorList = []
			for( let i = 0; i < start.length; i++ ) {
				colorList[i] = ( end[i] - start[i] ) * this.swing( percent ) + start[i];

				// 取整，rgb不能有小数
				if( i != start.length -1 ) {
					colorList[i] =  Math.floor( colorList[i] )
				};
			};

			return colorList;
		},

		// 随时间变化改变的属性值，用来获取矩阵值
		changeProp : function( prop, percent ) {
			// 循环属性值，拿当前值乘以百分比，再回原

			// 先深拷贝prop
			let copy = JSON.parse( JSON.stringify( prop ) );

			for( let k in prop ) {
				// 分别判断四种情况

				// 如果不是数组
				if( !this.isArr( prop[k] ) ) {
					// 如果是scale，就是另外一种处理
					if( !!k.includes( 'scale' ) ) {
						copy[k] = ( prop[k] - 1 ) * this.swing( percent ) + 1;
					}else{
						copy[k] = prop[k] * this.swing( percent );
					}
				}

				// 如果length为2
				else if( prop[k].length == 2 ) {
					if( !!k.includes( 'scale' ) ) {
						copy[k][0] = ( prop[k][0] - 1 ) * this.swing( percent ) + 1;
						copy[k][1] = ( prop[k][1] - 1 ) * this.swing( percent ) + 1;
					}else{
						copy[k][0] = prop[k][0] * this.swing( percent );
						copy[k][1] = prop[k][1] * this.swing( percent );
					}
				}

				// 如果length为3
				else if( prop[k].length == 3 ) {
					if( !!k.includes( 'scale' ) ) {
						copy[k][0] = ( prop[k][0] - 1 ) * this.swing( percent ) + 1;
						copy[k][1] = ( prop[k][1] - 1 ) * this.swing( percent ) + 1;
						copy[k][2] = ( prop[k][2] - 1 ) * this.swing( percent ) + 1;
					}else{
						copy[k][0] = prop[k][0] * this.swing( percent );
						copy[k][1] = prop[k][1] * this.swing( percent );
						copy[k][2] = prop[k][2] * this.swing( percent );
					}
				}

				// 如果length为4（只有rotate3d才有四个值的情况）
				else if( prop[k].length == 4 ) {
					// 前三条是轴（不用动态改变），第四条才是值
					copy[k][3] = prop[k][3] * this.swing( percent );
				}
			};

			return copy;
		},

		// 获取元素样式
		getStyles : function( elem ) {
			return elem.currentStyle ? elem.currentStyle : getComputedStyle( elem );
		},

		// 动画公式
		swing : function( percent ) {
			return 0.5 - Math.cos( percent * Math.PI ) / 2;
		},

		// 截取成数组
		getTransform : function( transform ) {
			if( !transform ) {
				console.warn( 'transform is not defined' );
				return
			};

			let matrix = transform,
				dimension = 'matrix(';

			matrix === 'none' && ( matrix = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)' );
			matrix.indexOf( '3d' ) > -1 && ( dimension = 'matrix3d(' );
			matrix = matrix.replace( dimension, '' ).replace(')', '' ).split(',');

			// 2d和3d的兼容处理
			if( matrix.length < 7 ) {
				matrix = [matrix[0], matrix[1], 0, 0, matrix[2], matrix[3], 0, 0, 0, 0, 1, 0, matrix[4], matrix[5], 0, 1];
			};
			return matrix
		},

		isArr : function( val ) {
			return Object.prototype.toString.call( val ) === '[object Array]';
		},
		isNum : function( val ) {
			return ( Object.prototype.toString.call( val ) === '[object Number]' && !isNaN( val ) );
		},

		// 获取最终的矩阵值
		getEnd : function( start, end ) {
			let pre = start,
				min = Math.pow(10, -323);

			for( let k in end ) {
				if( !this.isArr( end[k] ) ) {
					pre = matrix3d[k]( pre, end[k] );
				}else if( end[k].length == 2 ) {
					pre = matrix3d[k]( pre, end[k][0], end[k][1] );
				}else if( end[k].length == 3 ) {
					pre = matrix3d[k]( pre, end[k][0], end[k][1], end[k][2] );
				}else if( end[k].length == 4 ) {
					pre = matrix3d[k]( pre, end[k][0], end[k][1], end[k][2], end[k][3] );
				}
			};

			// 解决视图不准的bug，0 == '0'，所以不需要转化为数字
			for( let i = 0; i < pre.length; i++ ) {
				if( pre[i] == 0 ) pre[i] += min;
			};

			return pre
		},

		// 16进制颜色与rgba之间的转化
		colorRgba : function( val, opacity = 1 ) {
			opacity > 1 && ( opacity = 1 )
			let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;

			// 全部转小写
		    let color = val.toLowerCase();

		    // 存在color且格式是16进制的
		    if( color && reg.test( color ) ) {
		    	// 先转化为六位的颜色值
		        if(color.length === 4){  
		            let colorNew = "#";  
		            for( let i = 1; i < 4; i++ ) {  
		                colorNew += color.slice( i, i+1 ).concat( color.slice( i, i+1 ) );
		            }
		            color = colorNew;  
		        };

		        //处理六位的颜色值（'0x'代表的就是十六进制）
		        let colorChange = [];  
		        for( let i = 1; i < 7; i += 2 ) {
		            colorChange.push( parseInt( "0x" + color.slice( i, i+2 ) ) );    
		        };

		        colorChange.push( opacity )
		        return colorChange

		    }

		    if( color.includes( 'rgb' ) ) {
		    	let prefix = color.includes( 'rgba' ) ? 'rgba(' : 'rgb(';
		    	color = color.replace( prefix, '' ).replace( ')', '' ).split( ',' );

		    	for( let i = 0; i < color.length; i++ ) {
		    		color[i] = Number( color[i] );
		    	};
		    	color.length == 3 && ( color[3] = opacity );
		    	return color;
		    };
		}

	};



	// 动画的主体函数
	/* ---------------------------------------------------------------------------------------------- */
	let Animate = function( elem, prop, time, callback, nextFun ) {
		// 把动画结束后应该调用的俩函数存起来
		elem.callback = callback;
		elem.nextFun = nextFun;
		elem.optionProp = prop;
		!elem.timers && ( elem.timers = [] );

		let filterProp = Animate.filter( prop );

		// 先把参数存起来
		elem.animateOption = {
			elem            : elem,
			prop            : filterProp,
			originalTime    : time,
			time 	        : time,
			startTime       : Animate.fxNow || createFxNow(),//动画开始时间
			tweens          : [] //存放每个属性的缓动对象，用于动画
		};

		// 如果没有传入属性，就延迟，再返回（用于delay接口）
		if( Object.keys( prop ).length == 0 ) {
			setTimeout(function(){
				nextFun()
			}, time )
			return
		}

		// 看看传了几个prop
		for( let key in filterProp ) {
			// 只有存在而且包含0，所以要用全等
			if( !!filterProp[key] || filterProp[key] === 0 ) {
				elem.animateOption.tweens.push( new tweens( filterProp[key], key, elem.animateOption ) );
			}
		}

		// tick 函数，动起来的逻辑
		let tick = function() {
			let currentTime = Animate.fxNow || createFxNow(),
				// 保证剩余的时间不会小于0
				remaining = Math.max( 0, elem.animateOption.startTime + elem.animateOption.time - currentTime ),
				temp = remaining /  elem.animateOption.time || 0,
				percent = 1 - temp;

			// 我们要遍历了，让每个属性都动起来，调用他们的缓动对象的run方法，go,go,go ~~
			elem.animateOption.tweens.forEach(function( val ) {
				val.run( percent );
			});

			// 我们判断停止还继续，来吧
			if( percent < 1 && !!elem.animateOption.tweens.length ) {
				return remaining;
			}else{
				return false;
			}
		};
		animateRun.timer.call( elem, tick )
	};

	// 过滤传输的属性对象
	Animate.filter = function( prop ) {
		// 先深拷贝prop
		let copy = JSON.parse( JSON.stringify( prop ) );

		copy.transform = {};

		for( let key in copy ) {
			if( key.includes( 'rotate' ) || 
				key.includes( 'scale' ) || 
				key.includes( 'translate' ) || 
				key.includes( 'skew' ) ) {

				// 先拷贝过来
				copy.transform[key] = copy[key];
				// 删除原有的transform属性
			 	delete copy[key]
			};
		};

		if( Object.keys( copy.transform ).length == 0 ) delete copy.transform;

		return copy
	};

	// 动画执行自用方法
	/* ---------------------------------------------------------------------------------------------- */
	let animateRun = {
		timer : function( tickFun ) {
			// 先入栈
			this.timers.push( tickFun );

			// 如果没有返回false就start，否则就出栈
			!!tickFun() ? animateRun.start.call( this ) : this.timers.pop( tickFun );
		},

		start : function() {
			// 通过requestAnimationFrame来进行动画
			let requestAnimationFrame = window.requestAnimationFrame || 
   										window.webkitRequestAnimationFrame ||
   										window.mozRequestAnimationFrame;

			this.timerId = requestAnimationFrame( animateRun.monitor.bind( this ) );
		},

		stop : function() {
			let elem = this,
			cancelAnimationFrame =  window.cancelAnimationFrame || 
										window.webkitCancelAnimationFrame ||
										window.mozCancelAnimationFrame;

			cancelAnimationFrame( elem.timerId );
			elem.timerId = null;

			if( !!elem.query && elem.query.length == 0) {
				elem.query = null;
			};

			// 动画结束后调用的函数
			if( !!elem.callback ) {
				elem.callback.call( elem, elem.nextFun );
				elem.callback  = null;
			};

			!!elem.nextFun ? elem.nextFun() : elem.query = null;
		},

		// 循环监测
		monitor : function() {
			let timers = this.timers;

			// 这里的val就是Animate里面的tick函数
			timers.forEach(function( val, i ) {
				// 如果返回false或者返回0的时候就代表结束了
				!val() && timers.splice( i--, 1 )
			})
			
			// 动画结束与否
			if( !timers.length ) {
				animateRun.stop.call( this );
				timers = undefined;
			}else{
				animateRun.start.call( this )
			}

			Animate.fxNow = undefined;
		}
	};


	// =====================================第三部分（动画队列操作）======================================= //

	// 动画出栈调用主体方法
	/* ---------------------------------------------------------------------------------------------- */
	animate.fire = function( elem ) {	// 启动
		// 动画锁的作用是当前动画正在执行的时候，不可能让你下一个动画执行
		if( !elem.fireing ) {
			// 动画函数出栈，并且拿到它
			let firstFun = !!elem.query && elem.query.shift();

			if( !!firstFun ) {
				// 加上动画锁吧，当前的动画要执行了，不允许后来者的打扰
				elem.fireing = true;

				// 动画开始的时候把这个后来者当成参数传入进去，总得给后来者一条路吧
				firstFun( function() {
					elem.fireing = false;	// 解开动画锁，不然路就被堵死了
					animate.fire( elem );
				})
			}
		}
	}

	// 入栈操作，对外接口
	/* ---------------------------------------------------------------------------------------------- */

	function animate( option, time, callback ) {
		let elem = this;
		// 先入栈
		if( !elem.query ) {
			elem.query = [];			// 动画队列
			elem.fireing = false;		// 动画锁
			elem.query.push(function( nextFun ) {
				// 在这里这个函数根本不会调用！！！
				Animate( elem, option, time, callback, nextFun );
			})
			animate.fire( elem );
		}else{
			elem.query.push(function( nextFun ) {
				Animate( elem, option, time, callback, nextFun );
			})
		}
		return elem
	}


	// =====================================对外接口======================================================= //
	// 停止当前动画
	/* ---------------------------------------------------------------------------------------------- */
	HTMLElement.prototype.stop = function() {
		let elem = this,
			cancelAnimationFrame = window.cancelAnimationFrame || 
									window.webkitCancelAnimationFrame ||
									window.mozCancelAnimationFrame;
		cancelAnimationFrame( elem.timerId );
		elem.timerId = null;

		// 清空队列和回调
		elem.query = null;
		elem.callback = null;

		// 重置时间
		Animate.fxNow = undefined;

		return this
	}

	// 清除动画队列
	/* ---------------------------------------------------------------------------------------------- */

	HTMLElement.prototype.clearAnimate = function() {
		this.query = undefined;
		return this;
	}

	// 延迟动画
	/* ---------------------------------------------------------------------------------------------- */

	HTMLElement.prototype.delay = function( time ) {
		this.animate({}, time );
		return this;
	};

	HTMLElement.prototype.animate = animate;







	/*-----------------------------------------事件系统-----------------------------------------------------------*/ 


	/**
	 *	事件系统，用于定义spa应用的页面声明周期，对外开放，
	 *	注意：在调用off方法时，必须保证删除的回调在同一js文件中，
	 *		  切换js文件时，回调函数在内存中的引用地址发生变化，
	 *	      不能保证唯一性，因此不能删除。
	 *
	 *	on，fire，off三个接口对外开放
	**/
	class Events {
		constructor() {
			// 用于保存事件类型以及内存中的回调函数
			this.listener = {}
		}

		/**
		 *  注册事件

		 *	@param 		type ：   事件类型（ 必须的 ）
						fun ： 	  回调函数（ 必须的 ）

		 *	@result		Events
		 *	@example	onEvent.on( 'renderafter', function( e ){ ... } )
		**/
		on( type, fun ) {
			if( Tools.isString( type ) && Tools.isFun( fun ) ) {
				// 没有就创建数组并添加，有就push
				if( !this.listener[type] ) {
					this.listener[type] = [fun]
				}else {
					for( let i = 0 , arr = this.listener[type] ; i < arr.length ; i++ ) {
						if( arr[i] === fun ) return this
					}
					this.listener[type] .push( fun )
				}

				return this
			}
		}

		/**
		 *  触发事件

		 *	@param 		type ：   事件类型（ 必须的 ）
						fun ： 	  回调函数，当未指定回调时，触发全部回调

		 *	@result		Events
		 *	@example	onEvent.fire( 'renderafter', fun )
		 				onEvent.fire( 'renderafter' )
		**/
		fire( type, fun ) {
			if( !type || !Tools.isString( type ) ) return this

			let event = this.createEvent( type );
			if( !!this.listener[type] && Tools.isFun( fun ) ) {
				for( let i = 0 , arr = this.listener[type] ; i < arr.length ; i++ ) {
					if( arr[i] === fun ) {
						fun.call( this, event );
						return this
					} 	
				}
			}

			// 只传了类型，没有指定回调函数
			if( !!this.listener[type] && !Tools.isFun( fun ) ) {
				for( let i = 0 , arr = this.listener[type] ; i < arr.length ; i++ ) {
					arr[i].call( this,  event )
				}
			}
			return this
		}

		/**
		 *  删除事件回调
		 *	注意：回调函数的引用不一致导致无法删除

		 *	@param 		type ：   事件类型（ 必须的 ）
						fun ： 	  回调函数，当未指定回调时，删除全部回调

		 *	@result		Events
		 *	@example	onEvent.off( 'renderafter', fun )
		 				onEvent.off( 'renderafter' )
		**/
		off( type, fun ) {
			if( !type || !Tools.isString( type ) ) return this

			if( !!this.listener[type] && Tools.isFun( fun ) ) {
				for( let i = 0 , arr = this.listener[type] ; i < arr.length ; i++ ) {
					if( arr[i] === fun ) {
						arr.splice( i , 1 );
						return this
					} 	
				}
			}

			// 只传了类型，没有指定回调函数，全部置为空
			if( !fun || !Tools.isFun( fun ) ) {
				this.listener[type] = null;
			}

			return this
		}

		/**
		 *  事件对象方法，仅供内部使用

		 *	@param 		type ：   事件类型（ 必须的 ）
		 *	@result		event
		 *	@example	this.createEvent( 'renderafter' )
		**/
		createEvent( type ) {
			return {
				type : type,
			}
		}
	};
	// 注册到window
	window.onEvent = new Events;
	

	/*-----------------------------------------路由系统-----------------------------------------------------------*/ 
	/**
	 *	路由系统（本插件核心部分）
	 *	程序路线
	 *		通过事件冒泡给a标签添加的点击事件，取消默认跳转
	 *		得到参数
	 *		调用h5 API pushState给浏览器历史记录栈插入新记录
	 *		发起ajax请求，并缓存页面文本内容	
	 *		加载页面
	 *		调用动画
	 *		监听onpopstate，调用生成页面的方法
	 *
	 *	注意：点击进入新页面的时，如果有动画过渡应等动画完成才能继续点击进入新页面，
	 		  否则会报错（禁止动画未完成时的连续点击）
	**/

	// route对象
	let route = {};

	// 用来保存js传递的页面参数
	route.pageConfig = {};

	// 保存单次页面的所有参数，用于pushState方法传递参数
	route.data = {};

	// spa应用的总容器
	route.container = null;

	// 判断是否是Webkit
	route.isWebkit = 'WebkitAppearance' in document.documentElement.style || typeof document.webkitHidden != "undefined";
	
	// 缓存页面文本内容
	route.pageCache = {};

	// 判断是否初始化route组件，防止反复初始化
	route.isInited = false;

	// 保存用户设置的动画样式
	route.animateStyle = null;

	// 版本信息	O(∩_∩)O哈哈~
	route.v = '1.1';

	// 版本新增修改功能
	route.help = {
		'title' : '新增功能',
		'一' : '新增动画引擎',
	};


	/**
	 *  route插件初始化
	 *	注意：不应该重复调用

	 *	@result		undefined
	 *	@example	route.init();
	**/
	route.init = function() {
		if( isInited === true ) {
			console.warn( 'route插件已自动初始化，请勿重复初始化' );
			return
		}

		// dom加载完成后重置容器和动画样式
		route.container = Tools.$( '[data-view=view]' );
		route.animateStyle = route.container.getAttribute( 'data-transition' );

		// 调用首页的renderafter事件
		onEvent.fire( 'renderafter' );

		// 只需要调用一次
		document.removeEventListener( 'click' , route.jump );
		document.addEventListener( 'click' , route.jump );

		// 默认填充历史记录为index，返回方式是back
		window.history.replaceState( {url : 'index.html' , back : 'back'}, 'index', 'index.html' );

		// 路径变化时,绑定onpopstate事件
		window.onpopstate =  route.popstateChange;

	};

	/**
	 *  接受js传递页面配置参数

	 *	@param 		param ：   页面参数配置（ 必须的 ）

	 *	@result		undefined
	 *	@example	route.config({ ... })
	**/
	route.config = function( param ) {
		if( !Tools.isObj( param ) )  {
			console.warn( '参数必须的对象类型' )
			return
		}
		this.pageConfig = param;
	}

	/**
	 *  popstate的事件回调函数，仅供内部使用

	 *	@param 		event

	 *	@result		undefined
	 *	@example	window.onpopstate =  route.popstateChange;
	**/
	route.popstateChange = function( e ) {
		let state = history.state;
		route.createPage( state.url, state.cache, state.jsUrl, state.param, state.back );
	};

	/**
	 *  a标签的点击事件回调函数，仅供内部使用

	 *	@param 		event

	 *	@result		undefined
	 *	@example	document.addEventListener( 'click' , route.jump );
	**/
	route.jump = function ( e ) {
		let target = e.target;
		if( target.nodeName !== "A" ){
			return
		};
		if( target.nodeName === "A" ) {
			// 阻止默认跳转
			e.preventDefault()
			let url = target.getAttribute( 'href' ),
				hash =  !!url && url.split( '.' ),
				pageInfor = route.pageConfig[hash] || "";	//pageInfor不为null，否则会报错

			// 判断是否是在当前页面
			if( location.href.indexOf( url ) > -1 || url === "#" ) return

			// 参数处理，以页面的参数优先，js传递的参数为后
			let	rel = target.getAttribute( 'data-rel' ) || pageInfor.rel,
				param = target.getAttribute( 'data-param' ) || pageInfor.data,
				back = target.getAttribute( 'data-reverse' )|| pageInfor.back,
				href = target.getAttribute( 'data-href' ),
				cache = ( target.getAttribute( 'data-cache' ) || pageInfor.cache) === 'false' ? false : true,
				jsUrl = pageInfor.jsUrl;

			// 当拥data-rel=return属性时，直接返回;
			if( rel === "return" ) { window.history.go( -1 ); return }; 

			route.data = {
				url : url,
				param : param,
				back : 'back',
				cache : cache,
				jsUrl : jsUrl
			}

		   
		    // 点击调用这个方法，后退也调用这个方法
		    if( !!url ) {
		    	route.createPage( url, cache, jsUrl, param, back )
		    	window.history.pushState( route.data, route.hash, url );
		    }else if( !!href ) {
		    	window.open( href, '_self' )
		    }else{
		    	Tools.alert( '该页面没有找到' )
		    };		    
		}
	};

	/**
	 *  配置页面生命周期中的leave，通过ajax请求页面文本内容，仅供内部使用

	 *	@param 		url： 		请求页面的url（ 必须的 ）
	 				jsUrl： 	js文件的url（ 必须的 ）
	 				data： 		传递给下个页面的参数（ 必须的 ）
	 				cache：		是否缓存（ 必须的 ）
	 				back： 		是否返回

	 *	@result		undefined
	 *	@example	route.createPage( url, jsUrl, param, cache, back );
	**/
	route.createPage = function( url, cache, jsUrl, data, back ) {
		let me = this;

		// 清空js加载队列
		!!Tools.queue.fx.jsload && ( Tools.queue.fx.jsload = null );

		// 在请求之前先触发leave事件，这是上一个页面的leave事件，所以修改过的event都存在
	    onEvent.fire( 'leave' );

	   	// 如果back === back的话，就是反向动画，只能以字符串back的形式传入，以防参数混淆
	    back = back === "back" ? true : false

		// 通过ajax请求
	    me.pageAjax({
	    	url : url,
	    	type : 'GET',
	    	cache : cache,
	    	callback : function( status, text ) {
	    			// 没有找到的话就alert没找到
	    		if( status == 404 ) {
	    			Tools.alert( '页面没有找到' );
	    		}else{
	    			// 加载页面和js，并在加载之前清除掉所有的生命周期事件事件，不然就被上一个页面的事件影响了
	    			onEvent.off( 'renderafter' )
	    			onEvent.off( 'leave' );
	    			// 加载页面
	    			me.singlePage( text, jsUrl, data, back );
	    		}
	    	}
	    })
	}


	/**
	 *  ajax，用来请求页面并缓存，仅供内部使用

	 *	@param 		param：		以对象形式传递的参数列表（必须的 ）
	 *	@result		undefined
	 *	@example	route.ajax({
						url : url,
						data : data,
						type : 'get',
						success : fun
					})
	**/
	route.pageAjax = function( param ) {
		if( !Tools.isObj( param ) ) return

		// 加载图标
		let mask = Tools.$( '.mask' );
		if ( !mask ) {
			mask = document.createElement("div");
			mask.className = 'mask';
			mask.innerHTML = '<i class="loading"></i>';
			document.body.appendChild( mask );
		}
		// 显示加载
		Tools.show( mask )
		// 判断是否有缓存
		if( !!route.pageCache[param.url] ) {
			param.callback.call( param , 200 , route.pageCache[param.url] );
			Tools.hide( mask )
			return
		}

		let url = param.url,
			data = param.data || '',
			type = param.type || "GET",
			callback = param.callback,
			cache = param.cache,
			xhr = new XMLHttpRequest();

			xhr.open( type , url , true );

			type === 'POST' && xml.setRequestHeader( "Content-type" , "application/x-www-form-urlencoded" );

			xhr.onload = function() {
				if( xhr.status == 200 ) {
					let parts = url.split( '.' );

					// 如果是html就缓存
					if( parts.length > 0 && parts[parts.length - 1] === "html" ) {
						!!cache && ( route.pageCache[url] = xhr.responseText )
					}

					// 调用回调
					callback.call( param ,  xhr.status , xhr.responseText )
				}
				if( xhr.status == 404 ) {

					// 报错
					callback.call( param ,  xhr.status , {} )
				}

				// 加载完成去掉加载图标
				Tools.hide( mask )
			};

			xhr.send( data );
	};


	/**
	 *  把请求的文本转化为dom节点，触发页面生命周期的renderbefore,仅供内部使用

	 *	@param 		nodeContent：	请求的html文本（必须的 ）
	 				jsUrl：			js的url（必须的 ）
	 				data：			传递给下一个页面的数据（必须的 ）
	 				back：			是否是返回操作（必须的 ）

	 *	@result		undefined
	 *	@example	route.singlePage( text, jsUrl, data, back );
	**/

	route.singlePage = function( nodeContent, jsUrl, data, back ) {
		let me = this,
			animateStyle = route.animateStyle,
		 	originPage = Tools.$( '[data-page=index]' );

		 originPage.setAttribute( 'data-page', '' );

		// 触发renderbefore事件
		onEvent.fire( 'renderbefore' );

		// 把字符串渲染成dom，暂时不支持ie
		let parser = new DOMParser(),
    		node = parser.parseFromString( nodeContent, "text/html" ).querySelectorAll( '[data-role=page]' )[0];

    	// 如果页面没有指定data-role=page，就返回，并报出错误信息
    	if( !node ) {
    		console.error( '页面没有指定data-role="page"属性' );
    		originPage.parentNode.removeChild( originPage );
    		return
    	};

    	node.setAttribute( 'data-page', 'index' )
    	// 先隐藏
    	Tools.hide( node );

    	// 根据容器指定的动画开始过渡
    	if( !animateStyle ) {
    		originPage.parentNode.removeChild( originPage );
    		route.container.appendChild( node );
    		Tools.show( node );
    		me.loadScript( jsUrl , data );
    	}

    	if( animateStyle === "slide" ){
    		originPage.classList.add( animateStyle );
    		node.classList.add( animateStyle );

    		// 如果不是“返回”操作
			if( !back ) {
				route.container.insertBefore( node , null );
				setTimeout( function() {
					me.transition( node, originPage, jsUrl, data );
				} , 17 );

			}else {
			// 如果是“返回”
				route.container.insertBefore( node, originPage );
				// 修正view的位置,（因为是反向，需要调整位置）
				route.container.style.transform = 'translateX(-50%)';
				setTimeout( function() {
					me.transition( node, originPage, jsUrl, data, back );
				} , 17 );
			}
    	}else if( animateStyle === "fade" ){
    		// 先改变3d视角
    		route.container.style.transformStyle = 'preserve-3d';
    		route.container.style.perspective = '1000px';

    		originPage.classList.add( animateStyle );
    		node.classList.add( animateStyle );
    		
    		// 加载容器
    		route.container.appendChild( node );
    		setTimeout( function() {
				me.transition( node, originPage, jsUrl, data );
			} , 17 );
    	} 			 
	};

	/**
	 *  页面过渡动画，仅供内部使用

	 *	@param 		pageInto：		进入视图的dom元素（必须的 ）
					pageOut：		离开视图的dom元素（必须的 ）
					jsUrl：			js的加载url（必须的 ）
					data：			传递给下一个页面的参数（必须的 ）
					back： 			是否是回退操作

	 *	@result		undefined
	 *	@example	me.transition( node, originPage, jsUrl, data );
	 				me.transition( node, originPage, jsUrl, data, back );
	**/
	route.transition = function( pageInto, pageOut, jsUrl, data, back ) {
		let me = this,
			animation = this.isWebkit ? "webkitAnimationEnd" : "animationEnd";

		// 先显示新加页面
		Tools.show( pageInto )

		// 添加新进来页面的动画样式
		pageInto.classList.add( "in" );
		pageInto.classList.remove( "out" );

		// 添加上一个页面移走的动画样式
		pageOut.classList.add( "out" );
		pageOut.classList.remove( "in" );

		// 是否是返回
		pageInto.classList[!!back? "add": "remove"]( "reverse" );
		pageOut.classList[!!back? "add": "remove"]( "reverse" );
		
		pageOut.addEventListener( 'webkitAnimationEnd', function ( e ) {
			// 删除上一个页面
			this.parentNode.removeChild( this );

			( route.animateStyle === 'slide' ) && !!back && ( route.container.style.transform = 'translateX(0%)' );

			// 动画执行完成加载js
			me.loadScript( jsUrl , data, pageInto );

			// 情况页面配置情况，防止页面都配置同一个路由，然后叠加了
			// =====================================================
			// 我觉得在index中所有的页面都初始化page，然后各个页面配置路由进行替换
			me.pageConfig = {};

		})
 
	};


	/**
	 *  执行js文件，队列操作，仅供内部使用
	 *	注意：请勿同时在html页面和js文件中配置js文件url，否则会导致加载两次

	 *	@param 		jsUrl：	js的加载url（必须的 ）
					data：	传递给下一个页面的参数（必须的 ）

	 *	@result		undefined
	 *	@example	route.loadScript( jsUrl , data );
	**/
	route.loadScript = function( jsUrl , data, page ) {
		let script = route.container.getElementsByTagName( 'script' );
		for( let i = 0; i < script.length; i++ ) {
			// 如果有h5的importNode，就用importNode
			if( !!document.importNode && this.isWebkit ) {
				// 队列操作
				Tools.queue.on( 'jsload', function( next ) {
					setTimeout( function() {
						let newScript =  document.importNode( script[i] , true );
						Tools.hide( newScript );

						document.head.appendChild( newScript );
	        			document.head.removeChild( newScript );

						// 当最后一个js加载的时候才传输data
						i == script.length -1 && route.passParam( data, page );

						// 通过scr属性判断是内连接js还是通过src引用的js
						if( !!newScript.src && newScript.src != '' ) {
							// 外联的要等js引入完毕才能继续
							newScript.onload = function() {
								// 继续加载
								next();
							};		
						}else{
							// 内联的只要dom生产生效就ok
							next();
						}
						
					}, 17 )
				});

			}else{
				Tools.queue.on( 'jsload', function( next ) {
					let scriptContent = script[i].innerHTML.trim(),
						attr = script[i].attributes,
						defindAttr = script[i].dataset;

					// 通过src引入js的情况
					if( !!attr.src &&　attr.src != '' ) {
						//添加
						setTimeout(function() {
							newScript = document.createElement( 'script' );

							// 标准属性
							for( let i = 0 ; i < attr.length ; i++ ) {
								newScript.setAttribute( attr[i].name , attr[i].value )
							}
							
							// 自定义属性
	                        // for( var k in defindAttr ) {
	                        //     newScript.setAttribute( k, defindAttr[k] )
	                        // }
						
							Tools.hide( newScript )
							document.head.appendChild( newScript );
							document.head.removeChild( newScript );

							// 当最后一个js加载的时候才传输data
							i == script.length -1 && route.passParam( data, page );

							// 继续加载
							newScript.onload = function() {
								next()
							}
						} , 17 )
					}else{
						// 通过javascript内联语句块的情况
						setTimeout(function() {
							let newScript = document.createElement( 'script' );

							// 添加属性
							for( let i = 0 ; i < attr.length ; i++ ) {
								newScript.setAttribute( attr[i].name , attr[i].value )
							}

							// 添加javascript代码块
							newScript.appendChild( document.createTextNode( scriptContent ) );

							Tools.hide( newScript )
							route.container.insertBefore( newScript, null );
							route.container.removeChild( newScript );
							newScript = null;

							// 当最后一个js加载的时候才传输data
							i == script.length -1 && route.passParam( data, page );

							// 继续加载
							next()
						}, 17 );
					}
				});
			}	
		};

		// 执行通过参数传入的js
		route.dojs( jsUrl , data )
	};


	/**
	 *  利用aop原理修改事件的event对象，仅供内部使用

	 *	@param 		data：	需要修改的数据（必须的 ）

	 *	@result		undefined
	 *	@example	route.passParam( data );
	**/
	route.passParam = function( data, page ) {
		let after = function( args , event ){
			event.data = data;
			!! page && ( event.page = page );
		}
		onEvent.createEvent = Tools.eventAop( onEvent.createEvent , null , after )
	};

	/**
	 *  清空页面缓存，对外开放

	 *	@result		undefined
	 *	@example	route.clearCache();
	**/
	route.clearCache = function() {
		this.pageCache = {};
	};

	/**
	 *  切换页面，对外开放
		
	 *	@param 		param：	页面的配置项参数（必须的 ）

	 *	@result		undefined
	 *	@example	route.open( 'xxx.html' );
								   url 		  js	 data  back  cache
					route.open(['xxx.html', 'xxx.js', {}, 'back', true ]);
	**/
	route.open = function( url, param, back, jsUrl, cache ) {
		cache !== false && ( cache = true );
		let data = {
				url : url,
				param : param,
				back : 'back',
				cache : cache,
				jsUrl : jsUrl
			}

		// 进入页面并且插入浏览器历史记录栈
	    if( !!url ) {
	    	route.createPage( url, cache, jsUrl, param, back )
	    	window.history.pushState( data, '', url );
	    }else{
	    	Tools.alert( '该页面没有找到' )
	    }
	};

	/**
	 *  执行js，对外开放
		
	 *	@param 		url:	被执行的js文件路径（必须的 ）

	 *	@result		undefined
	 *	@example	route.exejs( 'xxx.js' );
	**/
	route.dojs = function( url , data ) {
		if( !!url ) {
			let script = document.createElement( 'script' );

			//请求地址
			script.src = url;

			// 修改事件的event对象
			!!data && this.passParam( data );

			//添加
			setTimeout(function() {
				Tools.hide( script );
				document.head.appendChild( script );
				document.head.removeChild( script );
				// 触发renderAfter事件
				script.onload = function() {
					onEvent.fire( 'renderafter' )
				}
			} , 17 )
		}
	};

	// 页面加载完成后初始化组件
	window.addEventListener( "DOMContentLoaded", function() {
		if ( isInited === false ) {
			window.route = route;
			route.init();
			isInited = true;
		}
	});
})( window, undefined )