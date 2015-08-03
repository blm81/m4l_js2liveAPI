/*
	observe and get info on cue points
*/

inlets = 1;
outlets = 1;
autowatch = 1;

var api_track = new LiveAPI( get_cuepoint_info ),	//track observer for cuepoints
	api_clip = new LiveAPI();						//for getting info on clips

//set to observe cue points in track
api_track.path = "live_set";
api_track.property = "cue_points";

function get_cuepoint_info( args ) {

	var arg_arr = arrayfromargs( args ),			//id's of cue points
		arg_len,									//the actual number of clips
		cue,										//object to contain cue info
		cue_points;									//array of cue objects

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