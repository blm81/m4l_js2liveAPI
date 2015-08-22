/*
	observe and get info on cue points
*/

inlets = 1;
outlets = 1;
autowatch = 1;

var api_track = new LiveAPI( get_cuepoint_info ),	//track observer for cuepoints
	api_clip = new LiveAPI(),						//for getting info on clips
	api_time = new LiveAPI( "live_set" ),			//for getting current time in beats
	cue_points,										//array of cue objects
	mode = null;									//specify output mode

//set to observe cue points in track
api_track.path = "live_set";
api_track.property = "cue_points";

function get_cuepoint_info( args ) {

	var arg_arr = arrayfromargs( args ),			//id's of cue points
		arg_len,									//the actual number of clips
		cue;										//object to contain cue info

	if ( arg_arr[0] === "cue_points" ) {
		
		cue_points = [];
		arg_len = ( arg_arr.length - 1 ) / 2;		//subtract one because the 1st index is always "cue points"

		for ( var i = 0; i < arg_len; i++ ) {
			cue = {};
			api_clip.goto( "live_set cue_points " + i );
			cue.name = api_clip.get( "name" );		//TO DO: figure out why name is "1" when cue point added
			cue.time = api_clip.get( "time" );
			cue_points.push( cue );					
			post( "cue: ", cue.name, " ", cue.time, '\n' );
		}
	}
}

function anything()
{
	var args = arrayfromargs( messagename, arguments ),
		obj_in,
		song_time,
		output;

	switch( args[0] ) {

		case 'set_mode':

			mode = args[1];
			post( "mode is: ", mode, '\n' );

		break; //set_mode

		case 'time_ev':

			try {
				obj_in = JSON.parse( args[1] )
			}
			catch( exception ) { post( "JSON parse error: ", exception, '\n' ); }

			if ( obj_in.data === "beat" ) {

				//get song time in beats
				song_time = Math.round( api_time.get( "current_song_time" ) );

				//compare to cue points, if match, then send fire message to server
				for ( var i = 0, il = cue_points.length; i < il; i++ ) {
					if( song_time === +cue_points[i].time ) {
						if( mode !== null ) {
							switch( mode ) {
								case 'single_video': 
									fire_videos( cue_points[i], "fire_video" );
								break; //single_video

								case 'pair_videos':
									fire_videos( cue_points[i], "fire_pair" );
								break; //pair videos
								default:
									post( "the cue point event mode set is not valid", '\n' );
								break;
							}
						}
						else 
							post( "cue point event output mode is not set", '\n' );
					}
				}
			}

		break; //time_ev
	}
}

function fire_videos( cue_point, mode_id ) {
	var name_str = cue_point.name.toString();
	output = name_str.split( " " );
	outlet( 0, mode_id, output[0], output[1] );
}