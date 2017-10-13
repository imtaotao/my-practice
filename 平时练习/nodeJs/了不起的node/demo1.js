// 'use strict';
// require('fs').readdirSync('.')	// 同步读取目录路径
// require('fs').readdir('.', ( err, file ) => {	// 异步读取目录路径
// 	console.log( file )
// })

const fs = require( 'fs' ),
	  stdin = process.stdin,
	  stdout = process.stdout;

var stats = [];

fs.readdir(process.cwd(), (err, files) => {		// process.cwd() 返回当前进程的工作目录
	console.log( '' );

	if ( !files.length ) {
		return console.log( 'no file show' )
	}

	console.log( 'select you want to see' )

	global.files = files;

	file( 0 )
});


function file( i ) {
	var filename = files[i];

	fs.stat(__dirname + '/' + filename, (err, stat) => {	// fs.stat 返回目录下的元数据
		stats[i] = stat;
		if (stat.isDirectory()) {
			console.log( '  ' + i + ' \033[36m' + filename + '/\033[39m');
		} else {
			console.log( '  ' + i + ' \033[90m' + filename + '/\033[39m');
		}

		if ( ++i == files.length ) {
			read();
		} else {
			file( i )
		}

	});
}

function read() {
	console.log( '' );
	stdout.write( 'enter you choice:' )
	stdin.resume();
	stdin.setEncoding('utf8');

	stdin.on( 'data', option );	
};

function option( data ) {
	var filename = files[Number(data)];
	if ( !filename ) {
		stdout.write( 'enter you choice:' )
	} else {
		stdin.pause();
		// 如果存在目录
		if (stats[+data].isDirectory()) {
			fs.readdir(__dirname + '/' + filename, (err, files) => {
				console.log('')
				console.log(`${files.length} files`)
				files.forEach(file => {
					console.log(` -- ${file}`)
				})
			})
		} else {
			fs.readFile
				console.log('')
				console.log( '\033[90m' + data.replace(/(.*)/g, '	$1') + '\033[39m' );
			})
		}
	}
}