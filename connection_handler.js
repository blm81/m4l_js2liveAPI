var clients = [];

exports.get_clients = function() {
	return clients;
}

exports.request_ident = function( socket ) {
	var conn_request = {};
    conn_request.type = "request_ident";
    conn_request.data = null;
    socket.write( JSON.stringify( conn_request ) );
}

exports.add_client = function( conn, name ) {
	console.log( name + " has been added" );
	var client = {};
	client.conn = conn;
	client.name = name;
	console.log( name + " " + conn.remoteAddress + " " + conn.remotePort );
	clients.push( client );
	var outgoing = {};
	outgoing.type = "status";
	outgoing.data = "connected as " + name;
	return JSON.stringify( outgoing );
}