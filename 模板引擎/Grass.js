// 指令引擎（暂时只支持绑定事件）-- > Dew
class Dew {
	constructor( data ) { this.data = data };	// 可以单独new执行指令绑定

	order( dom ) {
		!dom.nodeType && ( dom =  this.$( dom )[0] );	// 必须是元素节点

		const ev = /(@\w+\s?=\s?)("?\w+)(\([^(|)]*\))?"?/g;
		// 找到所有的子元素
		let allChildren = dom.getElementsByTagName( "*" );

		// 然后遍历执行每个子元素上的命令
		Array.from( allChildren ).forEach( node => {
			let copyNode = node.cloneNode( true );
			let event = this.parseNode( copyNode ).match( ev );	// 事件语句
			!!event && this.addEvent( node, event, this.data );
		});
	}

	// 详细处理事件语句
	addEvent( node, eventStr ) {
		const type_method = /\b\w+\b([(].*[)])?/g;
		const self = this;

		// 循环事件列表
		eventStr.forEach( eventVal => {
			const eventArr = eventVal.match( type_method );					// 截取后的数组
			const type = eventArr[0];										// 事件类型
			let method = eventArr[1];										// 事件方法名（带参数的）
			let arg = method.trim().match( /[(].*[)]/g ) || '';				// 正则截取带括号的参数
			let first = true;
			!!arg && (arg = arg[0]);										// 参数列表，有可能没有

			// 彻底切割方法名和参数
			method = method.replace( arg , '' );							// 截取方法名，去掉参数列表
			arg = arg.replace( /(&quot;)/g, '"').replace( /[(]|[)]/g, '' );	// 转义双引号
			arg = !!arg ? arg.split( ',' ) : null;							//截取成数组

			!this.data.event[method] && this.warn( method );				// 判断是否有这个方法

			// 转化成data里面的数据
			if( !!arg ) {
				arg = new Function( 'data', `with( data ) { return [${arg}] }` )( this.data );
			};

			// 绑定事件
			node.addEventListener( type, function( e ) {
				// 只入栈一次，不能点击一次就加一个event对象
				if( !!arg && !!first ) {
					arg.unshift( e );
					first = false;
				};

				let param = arg || [e];
				self.data.event[method].apply( this, param );
			});
		});
	}

	// 解析成单个元素字符串，不含内在子元素
	parseNode( node ) {
		node.innerHTML = '';
		let div = document.createElement( 'div' );
		div.append( node );
		return div.innerHTML;
	}

	// 选择器
	$( select , parents ) {
		return parents ? parents.querySelectorAll( select ) : document.querySelectorAll( select );
	}

	// 警告
	warn( msg, type ) {
		if( !type ) {
			throw new Error( `[Warn] : Data  [${msg}]  does not exist, but if there is a reference in the template, please double check the  [${msg}]\n\n\t\t\t\t\t\t\t\t\t\t--[ ${msg} ]`);
		}else{
			throw new Error( `[Warn] : ${msg}` )
		};
	}
};

/*
 ------------------------------------- 分 -------------------------------------------
 ------------------------------------- 界 -------------------------------------------
 ------------------------------------- 线 -------------------------------------------
*/


// 模板引擎 -- > Grass
class Grass extends Dew {
	constructor( data ) {
		super();
		if( typeof( data ) !== "object" ) {
		throw new Error(`[Warn] : [param] must be passed in the form of an object\n----[ param ]`);
		};

		this.root = [];				// ast树
		this.scope = this.root;		// 作用域
		this.html = '';				// 拼接成的html
		this.data = data;			// 数据
		this.init( data.el );		// 初始化
	}

	// 初始化
	init( el ) {
		!el && this.warn( 'Please specify the [el] attribute' , true );
		const self = this;
		const dom = self.dom = this.$( el );
		if( !!dom.length && dom.length > 2 ) { this.warn( 'Please ensure [dom] is the only', true )};

		document.addEventListener( 'DOMContentLoaded' , function ( e ) {
			self.parse( dom[0].innerHTML.trim() );
		});
	}

	// 渲染完成后回调
	callback( html ) {
		const dom = this.dom[0];
		dom.innerHTML = html;		// 更新dom
		this.order( dom );			// 触发指令
	}

	// 模板解析渲染
	parse( str ) {
		const matches = str.match( /{{|{%/ );
		if( !!matches ) {
			var isBlock = matches[0] === '{%';
			var endIndex = matches.index;
		};

		// 获取文本节点（第一个{{或者{%位置前的肯定是文本节点了）
		let chars = str.slice( 0, !!matches ? endIndex : str.length );

		// 创建文本节点
		if( !!chars.length ) {
			// 转义空格
			chars = chars.trim().replace( /[&]\w{3}.{5}[;]/g, '&nbsp;');
			(this.scope != this.root ? this.scope.children : this.root).push( this.getNode(1, chars) );
		};

		if( !matches ) {
			// 添加一个结束节点，用于判断字符串解析完毕
			this.root.push({ type : 'END' });
			this.render( this.root, this.data );	// 第一次渲染用根数据
			return;
		};

		str = str.slice( endIndex + 2 );						// 更新剩余字符串
		const leftStart = matches[0];							// 左边开始的下标
		const rightEnd = isBlock ? '%}' : '}}';					// 结束字符，区分变量和语句节点
		const rightEndIndex = str.indexOf( rightEnd );			// 搜索结束位置
		let expression = str.slice( 0, rightEndIndex ).trim();	// 截取整段字符
		const lugType = this.tagType( expression );						// 判断语句类型（for 还是 if）
		let node;

		if( !!isBlock ) {
			// --------------------------- IF --------------------------
			if( !!lugType && lugType.type === 'if' ) {
				// 转义大于小于号
				lugType.content[1] = lugType.content[1].replace( /&gt;/g, '>' ).replace( /&lt;/g, '<' );
				node = this.getNode( 2, null, lugType.type, lugType.content[1] );
				// 添加节点
				( this.scope != this.root ? this.scope.children : this.root ).push( node );

				node.scope = this.scope;	// 添加父级作用域，以便于回退
				this.scope = node;			// 改变作用域
			};

			// --------------------------- FOR --------------------------
			if( !!lugType && lugType.type === 'for' ) {
				const data = lugType.content[1].replace( /\b\w+\b\s{1}/ig, '' ).trim();
				const key = lugType.content[1].replace( /\s+\b\w+\b/ig, '' ).trim();
				const item = `for( let i = 0; i < ${data}.length; i++ ) {`;
				node = this.getNode( 2, null, lugType.type, item, key, data );

				// 添加节点
				( this.scope != this.root ? this.scope.children : this.root ).push( node );

				node.scope = this.scope;		// 添加父级作用域，以便于回退
				this.scope = node;					// 改变作用域
			};

			// --------------------------- END --------------------------
			if( expression.includes( 'end' ) ) {
				this.scope = this.scope.scope;
			};

		}else{
			if( !expression.includes( '|' ) ) {
				node = this.getNode( 3, null, 'var', expression );
			}else{
				// 处理过滤器
				expression = expression.replace( /&gt;/g, '>' ).replace( /&lt;/g, '<' );
				let filters = this.processFilter( expression );

				node = this.getNode( 4, null, 'filter', filters );
			}

			// 如果不是根作用作用域证明还在父级里面
			( this.scope != this.root ? this.scope.children : this.root ).push( node );
		}

		// 递归调用直到整个字符串解析完毕
		!!str.length && this.parse( str.slice( rightEndIndex + 2 ).trim() );
	}

	processFilter( expr ) {
		const filterRE = /(?:\|\s*.+\s*)+$/;
		const filterSplitRE = /\s*\|\s*/;
		const arg = /[(].*[)]/;
		let result = expr;
		const matches = result.match( filterRE );	// 切割表达式

		if( !!matches ) {
			const arr = matches[0].trim().split( filterSplitRE );	// 切割详细的过滤器
			result = expr.slice( 0, matches.index );	// 拿到开头的变量节点
			// 遍历过滤器数组，拼接成想要的形式
			arr.forEach( name => {
				if( !name ) return;
				// 切割过滤器名字与参数
				let param = name.match( arg );
				if( !!param ) {
					name = name.replace( param[0], '' );
					param = param[0].replace( /[(]|[)]/g, '' ).split( ',' );
				};

				// 报错信息指定
			 	if( !this.data.filters ) {
			 		this.warn( 'A filter is used, but the  -[filters]- attribute is not specified', true );
			 		return;
			 	}else{
			 		if( !this.data.filters[name] ){
			 			this.warn( name );
			 			return;
			 		};
			 	};

				result = `_$f( filters.${name}, ${result}, ${param} )`;
			});
		};
		return result;
	}
	// 渲染ast树
	render( ast, data ) {
		ast.forEach( ( node, i ) => {
			if( node.type === 1 ) { this.html += node.text };								  // 文本
			if( node.type === 3 ) { this.html += this.computedExpression( data, node.item ) };// 变量
			if( node.type === 4 ) { this.html += this.computedExpression( data, node.item ) };// 过滤器
			if( node.type === 'END' ) { this.callback.call( this, this.html ) };			  // 结尾

			// 语句块
			if( node.type === 2 ) {
				// IF
				if( node.tag === 'if' ) {
					// 解析表达式的值
					let result = this.computedExpression( data, node.item );

					// 如果为真就继续解析children数组里面的内容
					if( !!result ) { this.render( node.children, data ) };
				};

				// FOR
				if( node.tag === 'for' ) { this.processFor( data, node ) };
			};
		});
	}

	// 计算表达式
	computedExpression( obj, expression ) {
		const methodBody = `return (${expression})`;
		const funString = !!obj ? `with( _obj_ ){ ${methodBody} }` : methodBody;
		const fun = new Function( '_obj_', '_$f', funString );

		// 返回结果
		try {
			let result = fun( obj, function( filterName ) {		// 预先设定好的回调函数，处理过滤器
				// param不知道有多少个，所以用arguments对象
				let param = Array.from( arguments );
				// 第一个参数是函数, 要去掉
				param.shift();	
				return filterName.apply( this, param );
			});
    		return ( result === undefined || result === null ) ? '' : result;
		} catch( err ) {
			console.error( err );
			return ''
		};
	}

	// 计算for
	processFor( obj, node ) {
		const funString = `
		with( _obj_ ) {
			${node.item} 
				self.render( ast, Object.assign( _obj_, {${node.key}:${node.data}[i], index:i, i:i} ));
			};
		}`;

		const fun = new Function( '_obj_', 'ast', 'self', funString );
		// 返回结果
		try {
			let result = fun( obj, node.children, this );
    		return ( result === undefined || result === null ) ? '' : result;
		} catch( err ) {
			console.error( err );
			return ''
		};
	}

	// 生成节点
	getNode( type, text, tag, item, key, data  ) {
		// 1 -> 文本，2 -> 语句块， 3 -> 变量，4 -> 过滤器
		if ( type === 1 ) { tag = 'TEXT' };
		if ( type === 2 ) { var children = [] };  
		return {
			type,
			item,
			text,
			tag,
			key,
			data,
			children
		};
	}

	// 判断语句类型
	tagType( expression ) {
		const IF =  expression.match( /^if\s+([\s\S]+)$/ );		// if语句
		const FOR = expression.match( /^for\s+([\s\S]+)$/ );	// for语句
		if( IF ) { return { type: 'if', content : IF } };
		if( FOR ) { return { type: 'for', content : FOR } };
	}
};

export default {Dew, Grass};