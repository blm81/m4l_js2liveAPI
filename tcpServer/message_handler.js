var util = require( 'util' ),
	EventEmitter = require( 'events' ).EventEmitter;

//construct message handler with event emitter
function MessageHandler() {
	EventEmitter.call( this );
}

//make message handler inherit event emitter
util.inherits( MessageHandler, EventEmitter );

//handle incoming messages from server
MessageHandler.prototype.handle_incoming = function( obj ) {
	var recipients = [];
	var outgoing = {};
	outgoing.type = null;
	if ( obj.type == "to_cinder" ) {
		recipients.push( "cinder" );
		outgoing.recipients = recipients;
		outgoing.type = "from_max";
		outgoing.data = obj.data;
		outgoing.data_type = "float";
	}
	if ( outgoing.type != null ) {
		this.write( outgoing );
	}
}

//emit write message to connection handler which owns connections
MessageHandler.prototype.write = function( output ) {
	this.emit( "write", output );
}

module.exports = MessageHandler;