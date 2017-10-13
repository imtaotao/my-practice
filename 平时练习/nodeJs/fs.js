'use strict';
const fs = require( 'fs' );

let log = ( num, text ) => console.log( `${num}行 ——>>`, text )

// 改变文件名称
/* fs.rename( './file/taotao.jpg', './file/one.jpg', err => {
	!!err && console.log( err );

	});
*/

// 创建目录
// 第二个参数为权限，可以不写，window下默认忽略
/*
	fs.mkdir( './file/newFile', '0777', err => {
		!!err && console.log( err );
	});
*/

/*  fs 与 buff 的结合
	1、读取文件，
	2、写入文件，
	3、转化为base64格式，
	4、解码base64格式 

*/
	fs.readFile( './file/one.jpg', ( err, origin ) => {
		log( 30, Buffer.isBuffer( origin ) );	// 看读取的文件是不是buffer类型
		// 写入文件
		fs.writeFile( './file/one_buffer.png', origin, err => {
			!!err && log( 32, err );
		});

		// 把读取到的文件编码成 base64 格式
		const base64Img = origin.toString( 'base64' );
		//log( 38, base64Img );

		// 利用 buffer类 解码 base64 格式
		const decodeImg = new Buffer( base64Img, 'base64' );
		log( 42, Buffer.compare( origin, decodeImg ) );		// 输出 0 代码是一样的

		fs.writeFile( './file/one_decodedImg.jpg', decodeImg, err => {
			!!err && log( 45, err );
		});

	});
