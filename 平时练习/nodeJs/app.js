'use strict';
const url = require( 'url' );
const querystring = require( 'querystring' );
const fs = require( 'fs' );

module.exports = {
	inter : {},
	break( req, res, method, callback ) {
		let info = {},
			param = url.parse( req.url, true );
		if( method === 'GET' ) {
			info.query = param.query;
			info.pathname = param.pathname;
			callback( info );
		};

		if( method === 'POST' ) {
			info.pathname = param.pathname;
			info.query = '';

			req.on( 'data', chunk => {
				info.query += chunk;
			});
			req.on( 'end', () => {
				info.query = querystring.parse( info.query );
				callback( info );
			});
		};

		setTimeout(() => {
			if( !this.inter[info.pathname] ) {
				res.writeHead( 404, {'Content-Type' : 'text/html;charset=UTF-8'} );
				res.end( "<h1>404! 请求不存在</h1>" );
			};
		});
	},
	reqGet( req, res, connector, callback ) {
		req.url = req.url.replace( this.pubUrl, '' );
		if( req.method !== 'GET' ) return;

		// 存储当前接口名
		this.inter[connector] = connector;
		this.break( req, res, 'GET', info => {
			connector == info.pathname && !!callback && callback( info );
		});
	},
	reqPost( req, res, connector, callback ) {
		if( req.method !== 'POST' ) return;

		// 存储当前接口名
		this.inter[connector] = connector;
		this.break( req, res, 'POST', info => {
			connector == info.pathname && !!callback && callback( info );
		});
	},

	// 处理静态资源
	staticRes( req, res, pubUrl ) {
		if( req.method !== 'GET' ) return;
		let param = url.parse( req.url, true );
		let reg = /.js+|.css+|.html+|.png|.jpg|.jpeg|.gif/g;

		// 图标暂时不要
		if( param.pathname === '/favicon.ico' ) return;
		// 必须是静态资源才请求，否则 return
		if( !reg.test( param.pathname ) ) return
		let file = fs.readFileSync( pubUrl + param.pathname );
		let type;

		if( param.pathname.includes( 'html' ) ) {
			type = 'text/html';
		}else if( param.pathname.includes( 'js' ) ) {
			type = 'text/javascript';
		}else if( param.pathname.includes( 'png' ) ) {
			type = 'image/png';
		}else {
			type = 'text/css';
		};

		res.writeHead( 200, {'Content-Type': `${type};charset=UTF-8`});
		res.end( file );
	}
};