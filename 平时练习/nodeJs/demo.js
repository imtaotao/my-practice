// http模块（创建一个web服务器）
// ===============================================================================================

// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// var content = `
// 	<div style="font-size:20px;">你好</div>
// `

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end(content);
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// 事件模块
// ===============================================================================================
// var eventEmitter = require( 'events' ).EventEmitter,
// 	event = new eventEmitter();

// // 添加事件
// event.addListener( 'something' , function( one, two ) { //反正我现在是感觉addlistener和on添加事件是一样的
// 	console.log( one, two )
// })

// event.on( 'something' , function( one, two ) {
// 	console.log( 1, 2 )
// 	console.log( event.listenerCount( 'something' ) )
// })

// // 触发
// event.emit( 'something', '涛涛', '芳芳' );

// buffer类（存储二进制数据）
// ===============================================================================================
var buf = new Buffer( '你好芳芳，我是涛涛！' );
	//len = buf.write( '你好芳芳，我是涛涛！' )

// console.log( len )
console.log( buf.toString( 'utf8', 0, 30 ) )//读取 三个参数 编码格式  起始位置  终止位置
console.log( buf.toJSON( buf ) ) //转为json格式
