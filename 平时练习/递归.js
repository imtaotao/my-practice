let counter = 2
function aa() {
	if( counter < 1 ) return
	counter--

	if( counter >= 1 ) {
		aa()
	}

	if( counter === 0 ) {
		console.log( 'hello world' )
	}
}
aa() // ?
