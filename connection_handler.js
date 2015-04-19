var clients = [],
	MessageHandler = require('./message_handler.js'),
	msgHandler = new MessageHandler();

exports.handle_incoming = function( obj ) {
	msgHandler.handle_incoming( obj );
}

msgHandler.on( 'write', function( msg ) {
	console.log( "test " + msg );
});

//check if the client is in the list, DEPRECATED
var client_present = function( socket ) {
	var match_counter = 0;
	for ( var i in clients ) {
		if ( clients[i].conn === socket )
			match_counter ++;
	}
	if ( match_counter < 1 )
		return false;
	else
		return true;
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
    for ( var i in clients ) {
      if ( clients[i].conn === socket ) {
      	console.log( clients[i].name + " disconnected" );
        clients.splice( clients[i], 1 );
        match_counter ++;
      }
    }
    if ( match_counter == 0 )
      console.log( "disconnecting client was not found in connection list" );
}