'use strict';
const http = require( 'http' );
const app = require( './app' );

const head = {
	'Content-Type':'text/html;charset=UTF-8',
	'Set-Cookie' : 'times=1',
};

var session = 1;
// 先构建服务器
http.createServer( ( req, res ) => {
	app.reqGet( req, res, '/tao', info => {
		const session = req.headers.cookie;
		if ( !!session ) {
			var times = head['Set-Cookie'].replace( 'times=', '' );
			head['Set-Cookie'] = `times=${ ++times }`;
		};

		console.log( session )
		res.writeHead( 200, head );
		res.end( `<h1>第${times}次访问</h1>` )
	});
	app.reqGet( req, res, '/', info => {
		res.end( `<h1>taotao</h1>` )
	});
}).listen( 80 ); 

console.log( '服务启动成功。。。' );