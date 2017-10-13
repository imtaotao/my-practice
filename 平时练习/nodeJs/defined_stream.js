const stream = require( 'stream' );

const Readable = stream.Readable;

class myRead extends Readable {
	constructor( num ) {
		super();
		this.num = num;
	}

	_read() {
		setTimeout( () => {
			if ( this.num-- ) {
				this.push( this.num * 10 + '--;' );
			} else {
				this.push( null );
			}
		}, 100 );

	}
}

const read = new myRead( 5 )

read.pipe( process.stdout );