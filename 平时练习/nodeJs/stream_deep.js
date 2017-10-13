'use strict';
const http = require( 'http' );
const fs = require( 'fs' );
const request = require( 'request' );
const app = require( './app' );


// 接收 stream 的 pipe 方法
http.createServer( ( req, res ) => {
	//fs.createReadStream( './file/head.jpg' ).pipe( res );
	request( 'http://static.mukewang.com/static/img/common/logo.png?t=2.3' ).pipe( res )
}).listen( 80 );
console.log( '服务启动成功。。。');