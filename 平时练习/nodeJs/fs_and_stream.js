'use strict';
const fs = require( 'fs' );
const log = ( num, text ) => console.log( `${num}行 ：`, text );
const file = fs.readFileSync( './file/one.jpg' );

let n = 0;
// 创建可读流
let readStream = fs.createReadStream( './file/one.jpg' );

// 数据传输过程中触发 data 事件
readStream.on( 'data', chunk => {
	n++
	// log( 11, chunk.toString( 'utf8') );
	readStream.pause()	//暂停读取
	setTimeout(() => {
		log(16, '重新启动读取' )
		readStream.resume();
	}, 1000 )
})

.on( 'readable', () => {
	log( 15, '是可读的')
})
// 数据传输完毕中触发 end 事件
.on( 'end', () => {
	log( 19, '读完了')
	log( 20, n )
})
// 数据传输关闭中触发 close 事件
.on( 'close', () => {
	log( 23, '关闭了')
})
// 数据传输发送错误中触发 error 事件
.on( 'error', err => {
	log( 27, err )
});
