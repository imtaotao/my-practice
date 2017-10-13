const crypto = require( 'crypto' );

module.exports =  function( text ) {
	if ( !Buffer.isBuffer( text ) ) text = text.toString()

	// 第一次加密
	const oneCrypt = crypto.createHash( 'md5' ).update( text ).digest( 'base64' )

	// 第二次加密
	const beforeCode = oneCrypt.slice( 1, 4 )
	const twoCrypt = crypto.createHash( 'md5' ).update( beforeCode ).digest( 'base64' ) + oneCrypt

	// 第三次加密
	return crypto.createHash( 'md5' ).update( twoCrypt ).digest( 'base64' )
};