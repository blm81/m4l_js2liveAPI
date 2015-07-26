/*
	trigger clips
*/

inlets = 1;
outlets = 1;

var live_api = new LiveAPI( "live_set" ),
	//random_clip =  GM4L.RandomFire( live_api, [ 2, 5, 6 ], [ 11 ] );
	random_clips = [];

function anything()
{
	var args = arrayfromargs( messagename, arguments ),
		str_from_global = "",
		event_obj = null;

	switch ( args[0] ) {

		case 'event':

			try {
				event_obj = JSON.parse( args[1] );
			}
			catch ( exception ) {
				post( "JSON parse exception: ", exception, '\n' );
				return;
			}
			
			switch( event_obj.type ) {

				//time (meter) based events
				case 'time_ev':
					trigger_clip( event_obj.data );
					break; //time_ev
			}

			break; //time_ev

				//get an object with track/clip info about live set
		case 'get_song_info':

			get_song_info();

			break; //get_song_info

		case 'json':

			handle_json( args[1] );

			break; //json
	}
}

function get_song_info() {

	var str_from_global = GM4L.get_song_info( live_api ),
		song_info;

	try {
		song_info = JSON.parse( str_from_global );
	}
	catch( exception ) {
		post( "JSON parse exception: ", exception, '\n' );
	}
	
	//print out object contents
	for ( var i = 0, il = song_info.tracks.length; i < il; i++ ) {
		post( "track ", song_info.tracks[i].index, " ", song_info.tracks[i].name, '\n' );
		for ( var j = 0, jl = song_info.tracks[i].clips.length; j < jl; j++ ) {
			post( "clip ", song_info.tracks[i].clips[j].index, " ", song_info.tracks[i].clips[j].name, '\n' );
		}
	}
}

function handle_json( json_in ) {

	var obj_in = null;

	try {
		obj_in = JSON.parse( json_in );
	}
	catch( exception ) {
		post( "JSON handler exception: ", exception, '\n' );
	}

	if ( obj_in === null )
		return;

	else {

		switch( obj_in.type ) {

			case 'trigger':

				add_trigger( obj_in.data );

			break; //trigger
		}
	}
}

/*
	takes an array of trigger objects: see sample_trigger_config
*/
function add_trigger( arr_in ) {

	var i, il,
		random_clip = null;

	for ( i = 0, il = arr_in.length; i < il; i++ ) {

		try {

			//create random fire object
			if ( arr_in[i].type === 'random_fire' ) {

				random_clip = GM4L.RandomFire(
					live_api,
					arr_in[i].data.trigger,
					arr_in[i].data.tracks,
					arr_in[i].data.tick_range
				);

				//optional parameter for output range: don't use for random output
				if ( arr_in[i].data.output_range !== undefined )
					random_clip.output_range = arr_in[i].data.output_range
				random_clips.push( random_clip );
			}
		}
		catch ( exception ) {
			post( "add trigger exception: ", exception, '\n' );
		}
	}
}

function trigger_clip( str_cue ) {

	switch( str_cue ) {

		case 'beat':

			for ( var i = 0, il = random_clips.length; i < il; i++ ) {
				if ( random_clips[i].get_trigger() === 'beat' )
					random_clips[i].update();
			}
			break; //beat

		case 'bar':
			post( "bar event", '\n' );
			break; //bar
	}
}
