//based on example https://gist.github.com/creationix/707146#file-chatserver-js-L2

var net = require('net'), //load tcp library
    conn_handler = require('./connection_handler.js'),
    msg_handler = require('./message_handler.js');

//start TCP Server
var server = net.createServer(function (socket) {

  this.once( 'connection', function(socket) {
    conn_handler.request_ident( socket );
  });
 
  //handle incoming messages from clients.
  socket.on( 'data', function ( data ) {
    var obj = JSON.parse( data );
    if ( obj.type === "ident" )
      socket.write( conn_handler.add_client( socket, obj.data ) );
    else
      msg_handler.handle_incoming( obj );
  });
 
  //handle client removal
  socket.on('end', function () {
    conn_handler.get_clients.splice( conn_handler.get_clients.indexOf(socket), 1 );
    console.log( socket.name + " disconnected" );
  });
  
  //send a message to all clients
  function broadcast(message, sender) {
    conn_handler.get_clients.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return;
      client.write(message);
    });
    console.log( message );
  }
 
}).listen(5000);
