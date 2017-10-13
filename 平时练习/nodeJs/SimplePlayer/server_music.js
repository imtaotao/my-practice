'usr strict';
const http = require( 'http' );
const fs = require( 'fs' );
const app = require( './app' );

http.createServer( ( req, res ) => {
	app.staticRes( req, res, __dirname );
	app.reqGet( req, res, '/getMusic', info => {
		const musicName = info.query.name;
		// 创建可读文件流
		const readStream = fs.createReadStream( './file/' + musicName + '.mp3' );
		
		if( !readStream ) return;
		res.writeHead( 200, { 'Content-type':'multipart/arraybuffer' })
		readStream.on( 'data', chunk => {
			if( !res.write( chunk, 'blob' ) ) {
				readStream.pause();
			};
		});
		res.on( 'drain', () => {
			readStream.resume();
		});

		readStream.on( 'end', () => {
			res.end();
		});
	});

	// 获取歌词文件
	app.reqGet( req, res, '/getMusicLyrics', info => {
		const lyricsName = info.query.name;
		try{
			fs.readFile( './file/lrc/' + lyricsName + '.lrc', ( err, file ) => {
				res.writeHead( 200, { 'Content-type':'multipart/lrc' })
				if( !!file ) {
					res.end( file );
				}else{
					res.end( '0' );
				}
			});
		} catch( e ) {
			res.end( '0' );
		};
	});

	// 获取音响效果
	app.reqGet( req, res, '/getEffect', info => {
		const oogName = info.query.name;
		try{
			fs.readFile( './file/sound/' + oogName, ( err, file ) => {
				console.log( err, file )
				res.writeHead( 200, { 'Content-type':'multipart/arraybuffer' })
				res.end( file );
			});

		} catch( e ) {
			res.writeHead( 200, { 'Content-type':'text/plain' })
			res.end( '0' );
		};
	});
}).listen( 3000 );
console.log( '服务启动成功。。。' );