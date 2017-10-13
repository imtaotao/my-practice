const events = require( 'events' );

const emitter = new events.EventEmitter;

emitter.on( 'dd', function() {
	console.log( '跟我写的一样嘛' );
});

emitter.emit( 'dd' );