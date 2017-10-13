const http = require( 'http' );
const fs = require( 'fs' );


// req =>　http.ClientRequest 客户端请求
// res =>　http.ServerResponse	服务器响应
http.createServer( ( req, res　) => {
	res.writeHead( 200, {
		'Content-Type': 'text/plain;charset=UTF-8', 
		'server': 'tao0'
	});

	const str = fs.readFileSync( 'input.txt' );
	
	res.end( str );
}).listen( 80 );
console.log( '在80端口启动服务器' )