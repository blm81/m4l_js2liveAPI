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
		output = null,
		output_arr = [];

	switch( args[0] ) { 

		case 'fire_video':

			output = {};
			output.type = "fire_video";
			output.data = {};
			output.data.dir = args[1];		//name of video directory
			output.data.idx = +args[2];		//the index of the video in directory

		break; //fire_video

		case 'fire_pair':

			output = {};
			//TO DO: refactor this so less redundant
			output_arr[0] = args[1].split( "_" );
			output_arr[1] = args[2].split( "_" );
			output.type = "fire_pair";
			output.data = [
				{
					dir : output_arr[0][0],
					idx : +output_arr[0][1]
				},
				{
					dir : output_arr[1][0],
					idx : +output_arr[1][1]
				}
			];

		break;
	}

	if ( output !== null ) {
		messnamed( send_to, JSON.stringify( output ) );
	}
	else 
		post( "output message to cinder is not valid", '\n' );
}
