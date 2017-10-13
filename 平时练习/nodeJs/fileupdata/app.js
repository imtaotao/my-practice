const express = require( "express" );
const path = require("path");
const formidable = require( 'formidable' );
const fs = require( 'fs');

const app = express();
app.use( express.static( path.join( __dirname, '/public' ) ) );

app.post( '/test', ( req, res ) => {
	const form = new formidable.IncomingForm;
	form.encoding = 'utf-8';
	// form.uploadDir = __dirname;

	form.parse( req, ( err, fields, files ) => {
		if( err ) console.log( err )
		console.log( fields )
		for( let key in files ) {
			fs.rename( files[key].path, __dirname + `/${key}` + path.extname(files[key].name))
		}
	});
	form.on( 'progress', ( receBt, expeBt ) => {
		const procent = ( receBt / expeBt   * 100 ).toFixed( 2 ) + '%';
		console.log( procent )
		if( procent == '100.00%') { res.send(procent) };
	});
});

app.get( '/ordinary', ( req, res ) => {
	console.log( req.url )
	res.send( JSON.stringify({ code: 'ok,get' }) );
})

app.post( '/ordinary', ( req, res ) => {
	console.log( req.url )
	res.send( JSON.stringify({ code: 'ok,post' }) );
})


app.listen( 3000 , () => console.log("服务启动成功") );