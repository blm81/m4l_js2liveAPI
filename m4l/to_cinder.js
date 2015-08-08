/*
	send instructions via TCP server to cinder
*/

inlets = 1;
outlets = 1;
autowatch = 1;

var send_to = "to_server";					//name of receive object

function anything()
{
	var args = arrayfromargs( messagename, arguments ),
		output = {};

	switch( args[0] ) { 

		case 'fire_video':

			output.type = "fire_video";
			output.data = {};
			output.data.dir = args[1];		//name of video directory
			output.data.idx = +args[2];		//the index of the video in directory
			messnamed( send_to, JSON.stringify( output ) );

		break; //fire_video
	}
}
