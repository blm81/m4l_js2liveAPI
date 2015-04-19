var util = require( 'util' ),
	EventEmitter = require( 'events' ).EventEmitter;

function MessageHandler() {
	EventEmitter.call( this );
}

util.inherits( MessageHandler, EventEmitter );

MessageHandler.prototype.handle_incoming = function( obj ) {
	console.log( "message recieved: ", obj );
	this.write( "test" );
}

MessageHandler.prototype.write = function( output ) {
	this.emit( "write", output );
}

module.exports = MessageHandler;