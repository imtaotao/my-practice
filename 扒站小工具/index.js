const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');
const colors = require("colors");


// 获取 js 内容中引用的 img 文件
const jsImg = /('|"|`)(.+\.(jpg|png|gif|svg|jpeg){1}.*)('|"|`)/g;

// 获取 css html 内容中引用的 img 文件
const cssHtmlImg = /url\(("|')*([^\)]+)("|')*\)/g;

// 切割 js 文件后缀名
const jsFileName = /\/([^\/]+)\.js/g;

// 切割 css 文件后缀名
const cssFileName = /\/([^\/]+)\.css/g;

// 切割 img 文件后缀名
const imgFileName = /\/([^\/]+)\.(jpg|png|gif|svg|jpeg)/g;

// base64 格式的文件切割（需要改动）
const baseDate = /.*data:image\/\w+;base64,/g;

// base64 文件转化的格式
const baseFormat = /(data:\w+\/)(\w+)(\+\w+)*;/g;

// 相对路径和绝对路径的判断
const isAbs = /\w+:/g;

const stdin = process.stdin;
const stdout = process.stdout;

// 拷贝地址 存放地址 项目名
let websiteUrl;
let storageUrl;
let projectName;

/* ----------------------------------------------------------------------- */

const Cavalier = {
	start() {
		stdout.write( ' 请输入请求资源的文件路径：' );
		stdin.resume();					// 暂停
		stdin.setEncoding( 'utf8' );	// 编码格式
		stdin.on( 'data', this.option() );	
	},

	// 处理输入命令语句
	option() {
		const self = this;
		return function( data ) {
			if ( !websiteUrl ) {
				websiteUrl = data.trim();
				stdout.write( ' 请指定输出的文件路径：' );
			} else if( !storageUrl ) {
				storageUrl = data.trim();
				stdout.write( ' 请输入项目名称：' );
			} else {
				projectName = data.trim();
				stdin.pause();

				// 启动程序
				self.init();
			}
		};
	},

	init() {
		if ( !websiteUrl || !storageUrl || !projectName ) {
			console.log( '文件路径或文件名未指定'.red );
			return;
		};

		storageUrl = storageUrl + '/' + projectName;

		// 获取页面内容
		request( websiteUrl, ( err, res, body ) => {
			if ( !!err ) { console.log( err ); return };
			if ( !body ) { console.log( res ); return };

			// 项目文件夹
			if ( !fs.existsSync( storageUrl ) ) {
				fs.mkdirSync( storageUrl );
			} else {
				console.log( '文件以及存在！'.red );
				return;
			};

			this.pro(() => {
				const $ = cheerio.load( body );
				const img = this.getNode( $, 'img', 'src' );	// img 文件
				const js = this.getNode( $, 'script', 'src' );	// js  文件
				const css = this.getNode( $, 'link', 'href' );	// css 文件

				// 项目 html 文件
				const indexHtml = fs.createWriteStream( storageUrl + '/index.html' );
				indexHtml.write( body );

				// html 页面内嵌的图片
				const htmlImg = this.getImgUrl( 'html', body, websiteUrl );
				!!htmlImg && this.saveImgDetail( htmlImg );

				return { js, css, img };

			}).then( res => {
				console.log( ' > 正在拷贝 img 文件...'.yellow )

				this.filter( res.img );
				this.saveImgDetail( res.img );
				return Promise.resolve( res );

			}).then( res => {
				console.log( ' > 正在拷贝 css 文件...'.yellow )

				this.filter( res.css );
				this.saveCssDetail( res.css );
				return Promise.resolve( res );

			}).then( res => {
				console.log( ' > 正在拷贝 js  文件...'.yellow )

				this.filter( res.js );
				this.saveJsDetail( res.js );
				return Promise.resolve( res );
			}).then( res => {
				console.log( ' > 拷贝完成'.magenta );

			}).catch( err => {
			    console.log( err );
			});
		});
	},

	// promise
	pro( fun ) {
		return new Promise(( resolve, reject ) => {
			resolve( fun() );
		});
	},

	// 转化为绝对路径
	filter( urlArr ) {
		let hostUrl = websiteUrl;
		if ( websiteUrl.includes( '.html' ) ) {
			hostUrl = websiteUrl.replace( path.basename( websiteUrl ), '' );
		};

		!!urlArr && urlArr.forEach( ( val, i ) => {
			if (!val.match( isAbs ) ) {
				// 补全路径
				val.slice( 0, 1 ) !== '/' && ( val = '/' + val );

				// 去掉 hostUrl 结尾斜杠，为了统一性，统一处理
				if ( hostUrl.slice(hostUrl.length - 1, hostUrl.length) === '/' ) {
					hostUrl = hostUrl.slice( 0, hostUrl.length - 1 );
				};

				// 添加主机名转换成绝对路径
				urlArr[i] = hostUrl + val;
			};
		});
	},

	// 得到 img link script 标签
	getNode( $, select, content ) {
		let arr = [],
			node = $( select ),
			singleSrc;

		if ( !node ) return arr;
		if ( node.length > 0 ) {
			Array.from( node ).forEach( val => {
				// 获取 src 的属性值
				const src = $( val ).attr( content );
				// 获取 data-src 的属性值
				const dataSrc = $( val ).attr( `data-${content}` )

				!!src && arr.push( src );
				!!dataSrc && arr.push( dataSrc );
			});
			return arr;
		};

		singleSrc = node.attr( content );
		!!singleSrc && arr.push( singleSrc );
		return arr;
	},

	// 生成 css 文件
	saveCssDetail( urlArr ) {
		const cssDir = storageUrl + '/css';
		// 创建文件夹
		!fs.existsSync( cssDir ) && fs.mkdirSync( cssDir );

		!!urlArr && urlArr.forEach( url => {
			let fileName = url.match( cssFileName );
			fileName = !!fileName ? fileName[0] : '/NULL';

			try {
				// 过滤 css 文件，导出其中引用的 img 文件路径
				request( url, ( err, res, body ) => {
					if ( err ) console.log( err );

					const cssImgUrl = this.getImgUrl( 'css', body, url );
					!!cssImgUrl && this.saveImgDetail( cssImgUrl );
				});

				// 直接导入文件
				request( url ).pipe( fs.createWriteStream( cssDir + fileName ) );
			} catch ( err ) {
				console.log( '当前 css 文件路径有误'.red );
			}
		})
	},

	// 生成 img 文件
	saveImgDetail( urlArr ) {
		const imgDir = storageUrl + '/img';
		// 创建文件夹
		!fs.existsSync( imgDir ) && fs.mkdirSync( imgDir );

		!!urlArr && urlArr.forEach( url => {
			// 处理 base64 格式的文件
			if ( url.includes( 'base64') || url.includes( 'data:image') ) {
				// 文件计数
				if ( !this.saveImgDetail.num ) this.saveImgDetail.num = 0;
				this.saveImgDetail.num++;

				// 解码 base64
				const base64Data = url.replace( baseDate, '' );
				const decodeImg = Buffer.from( base64Data, 'base64' );

				let fileContent = url.match( baseFormat );
				if ( !!fileContent ) {
					fileContent = fileContent[0];
					var fileFormat = fileContent.replace( baseFormat, ( kw, $1, $2 ) => { return '.' + $2 });
				} else {
					// 出错处理，文件格式名字没有读取出来
					var fileFormat = '.NULL';
				};

				fs.writeFile( `${imgDir}/base64_${this.saveImgDetail.num}${fileFormat}`, decodeImg, err => {
					!!err && console.log( err );
				});

			} else {
				let fileName = url.match( imgFileName );
				fileName = !!fileName ? fileName[0] : '/NULL';

				try {
					request( url ).pipe( fs.createWriteStream( imgDir + fileName ) );
				} catch ( err ) {
					console.log( '当前图片路径有误'.red );
				};
			};
		});

	},

	// 生成 js 文件
	saveJsDetail( urlArr ) {
		const jsDir = storageUrl + '/js';
		// 创建文件夹
		!fs.existsSync( jsDir ) && fs.mkdirSync( jsDir );

		!!urlArr && urlArr.forEach( url => {
			let fileName = url.match( jsFileName );
			fileName = !!fileName ? fileName[0] : '/NULL';

			try {
				// 过滤 js 文件，导出其中引用的 img 文件路径
				request( url, ( err, res, body ) => {
					if ( err ) console.log( err );

					const jsImgUrl = this.getImgUrl( 'js', body, url );
					!!jsImgUrl && this.saveImgDetail( jsImgUrl );
				});

				request( url ).pipe( fs.createWriteStream( jsDir + fileName ) );
			} catch ( err ) {
				console.log( '当前 js 文件路径有误'.red );
			};
		});
	},

	getImgUrl( type, body, parUrl ) {
		let arr = [],
			detailUrl,
			imgUrlName,
			hostUrl = parUrl;

		// 去除文件后缀名
		if ( parUrl.includes( '.html' ) || parUrl.includes( '.css' ) || parUrl.includes( '.js' ) )
			hostUrl = parUrl.replace( path.basename( parUrl ), '' );

		// 正则表达式的切换
		if ( type === 'css' || type === 'html' ) detailUrl = cssHtmlImg;
		if ( type === 'js' ) detailUrl = jsImg;
		if ( !detailUrl ) return;

		imgUrl = body.match( detailUrl );

		!!imgUrl && imgUrl.forEach( url => {
			url = url.replace( detailUrl, ( kw, $1, $2 ) => {
				return $2;
			});

			// 如果是相对路径就去掉 hostUrl 结尾的 / ， 给图片路径加上 /
			if ( !url.match( isAbs ) ) {
				url.slice( 0, 1 ) !== '/' && ( url = '/' + url );
			
				if ( hostUrl.slice( hostUrl.length - 1, hostUrl.length ) === '/' )
					hostUrl = hostUrl.slice( 0, hostUrl.length - 1 );
			};

			!!url.match( isAbs ) ? arr.push( url ) : arr.push( hostUrl + url );
		});

		return arr;
	}
};

module.exports = Cavalier;
// Cavalier.start()