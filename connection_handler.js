var clients = [];

exports.get_clients = function() {
	return clients;
}

//check if the client is in the list
var client_present = function( socket ) {
	var match_counter = 0;
	for ( var i in clients ) {
		if ( clients.conn === socket );
		match_counter ++;
	}
	if ( match_counter < 1 )
		return false;
	else
		return true;
}

//request that the newly connected client identify itself
exports.request_ident = function( socket ) {
	//check if the client has already been added
	if ( !client_present( socket ) ) {
		//if not, send identification request
		var conn_request = {};
	    conn_request.type = "request_ident";
	    conn_request.data = null;
	    socket.write( JSON.stringify( conn_request ) );
	}
}

//add client to list
exports.add_client = function( socket, name ) {
	//check if the client has already been added
	if ( !client_present( socket ) ) {
		//if not, add to client list
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
}