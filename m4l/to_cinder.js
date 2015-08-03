/*
	send instructions via TCP server to cinder
*/

inlets = 1;
outlets = 1;
autowatch = 1;

var send_to = "to_server";	//name of receive object

function anything()
{
	var args = arrayfromargs( messagename, arguments ),
		output = {};

	switch( args[0] ) { 

		case 'fire_video':

			output.type = "fire_video";
			output.data = {};
			output.data.idx = +args[1];		//the index of the video in directory
			output.data.dir = args[2];		//name of video directory
			messnamed( send_to, JSON.stringify( output ) );
	}
}
