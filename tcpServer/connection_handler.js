var clients = [],
	MessageHandler = require('./message_handler.js'),
	msgHandler = new MessageHandler();

//route incoming messages through message handler
exports.handle_incoming = function( socket, obj ) {
	obj.sender = get_name( socket );
	msgHandler.handle_incoming( obj );
}

//send message from handler to client(s)
msgHandler.on( 'write', function( msg ) {
	//send message to correct recipients
	for ( var i = 0, il = msg.recipients.length; i < il; i++ ) {
		for ( var j = 0, jl = clients.length; j < jl; j++ ) {
			if ( msg.recipients[i] == clients[j].name ) {
				clients[j].conn.write( JSON.stringify( msg ) );
			}
		}
	}
});

//check if the client is in the list, DEPRECATED
var get_name = function( socket ) {
	for ( var i = 0, il = clients.length; i < il; i++ ) {
		if ( clients[i].conn === socket )
			return clients[i].name;
	}
}

//request that the newly connected client identify itself
exports.request_ident = function( socket ) {
	//send identification request
	var conn_request = {};
    conn_request.type = "request_ident";
    conn_request.data = null;
    socket.write( JSON.stringify( conn_request ) );
}

//add client to list
exports.add_client = function( socket, name ) {
	//add to client list
	var client = {};
	client.conn = socket;
	client.name = name;
	console.log( name + " " + socket.remoteAddress + " " + socket.remotePort + " has been added" );
	clients.push( client );
	var outgoing = {};
	outgoing.type = "status";
	outgoing.data = "connected as " + name;
	return JSON.stringify( outgoing );
}

exports.remove_client = function( socket ) {
	var match_counter = 0;
    for ( var i = 0, il = clients.length; i < il; i++ ) {
      if ( clients[i].conn === socket ) {
      	console.log( clients[i].name + " disconnected" );
        clients.splice( clients[i], 1 );
        match_counter ++;
      }
    }
    if ( match_counter == 0 )
      console.log( "disconnecting client was not found in connection list" );
}