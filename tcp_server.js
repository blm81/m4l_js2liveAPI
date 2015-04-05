//based on example https://gist.github.com/creationix/707146#file-chatserver-js-L2

var net = require('net'), //load tcp library
    conn_handler = require('./connection_handler.js'),
	  clients = [];

//start TCP Server
var server = net.createServer(function (socket) {

  this.on( 'connection', function(socket) {
    console.log( socket.remoteAddress + ":" + socket.remotePort + " has connected" );
    conn_handler.request_ident( socket );
    /*var conn_request = {};
    conn_request.type = "message";
    conn_request.data = "send_identification";
    socket.write( JSON.stringify( conn_request ) );*/
  });
 
  //identify client
  //socket.name = socket.remoteAddress + ":" + socket.remotePort;
 
  //add client to list
  //clients.push(socket);
 
  //connetion aknowledgement
  //socket.write(socket.name + "connected\n");
  //broadcast(socket.name + " connected\n", socket);
 
  //handle incoming messages from clients.
  socket.on('data', function (data) {
    broadcast(socket.name + "> " + data, socket);
  });
 
  //handle client removal
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    broadcast(socket.name + " left the chat.\n");
  });
  
  //send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return;
      client.write(message);
    });
    // Log it to the server output too
    //process.stdout.write(message)
    console.log( message );
  }
 
}).listen(5000);
