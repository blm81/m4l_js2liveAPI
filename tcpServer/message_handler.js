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
	console.log( "received msg: ", obj, "from sender: ", obj.sender );
	var recipients = [];
	var outgoing = {};
	outgoing.type = null;
	//handle messages with destination cinder
	if ( obj.type == "to_cinder" ) {
		recipients.push( "cinder" );
		outgoing.type = "from_max";
		outgoing.data = obj.data;
		if ( obj.data_type )
			outgoing.data_type = obj.data_type;
	}
	//handle messages with destination max
	else if ( obj.type == "to_max" ) {
		recipients.push( "max" );
		outgoing = obj;
		outgoing.type = "from_cinder";
		//console.log( "sending message: ", obj );
	}
	//filter malformed messages
	if ( outgoing.type != null ) {
		outgoing.recipients = recipients;
		try {
			this.write( outgoing );
		}
		catch ( exception ) {
			console.log( "socket write exception: ", exception );
		}
	}
}

//emit write message to connection handler which owns connections
MessageHandler.prototype.write = function( output ) {
	this.emit( "write", output );
}

module.exports = MessageHandler;