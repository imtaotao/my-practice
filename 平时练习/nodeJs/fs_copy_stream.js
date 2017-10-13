'use strict';
const fs = require( 'fs' );
const log = text => console.log( text );

// 复制文件 -- 有防爆仓处理
const readStream = fs.createReadStream( './file/Moonlight.mp3' );
const writeStream = fs.createWriteStream( './file/copy_moonlight.mp3' );

readStream.on( 'data', chunk => {
	if( !writeStream.write( chunk ) ) {
		readStream.pause();
		log( '没有写完，先暂停下' );
	};
});

writeStream.on( 'drain', () => {
	readStream.resume();
	log( '写完了，开始接着读吧' );
});

// 读完了，没有数据了，写入流也就要停止了
readStream.on( 'end', () => writeStream.end() );


// 如果用 pipe 方法重构
/*
	fs.createReadStream( './file/Moonlight.mp3' )
	.pipe( fs.createWriteStream( './file/copy_moonlight.mp3' ) );
*/