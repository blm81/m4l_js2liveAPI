exports.request_ident = function( socket ) {
	var conn_request = {};
    conn_request.type = "message";
    conn_request.data = "send_identification";
    socket.write( JSON.stringify( conn_request ) );
}