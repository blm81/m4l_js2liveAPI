/*
	trigger clips
*/

inlets = 1;
outlets = 1;

var live_api = new LiveAPI( "live_set" ),
	song_info = null,
	random_clip =  GM4L.RandomFire( live_api, [ 2, 5, 6 ], [ 11 ] );

function anything()
{
	var args = arrayfromargs( messagename, arguments ),
		str_from_global = "",
		event_obj = null;

	switch ( args[0] ) {

		//get an object with track/clip info about live set
		case 'get_song_info':

			get_song_info();

		case 'event':

			try {
				event_obj = JSON.parse( args[1] );
			}
			catch ( exception ) {
				post( "JSON parse exception: ", exception );
				return;
			}
			
			switch( event_obj.type ) {

				//time (meter) based events
				case 'time_ev':
					trigger_clip( event_obj.data );
					break; //time_ev
			}

			break; //time_ev
	}
}

function get_song_info() {

	var str_from_global = GM4L.get_song_info( live_api );
	post( "song info: ", str_from_global );

	try {
		song_info = JSON.parse( str_from_global );
	}
	catch( exception ) {
		post( "JSON parse exception: ", exception );
	}
	
	//print out object contents
	for ( var i = 0, il = song_info.tracks.length; i < il; i++ ) {
		post( "track ", song_info.tracks[i].index, " ", song_info.tracks[i].name, '\n' );
		for ( var j = 0, jl = song_info.tracks[i].clips.length; j < jl; j++ ) {
			post( "clip ", song_info.tracks[i].clips[j].index, " ", song_info.tracks[i].clips[j].name, '\n' );
		}
	}

}

function trigger_clip( str_cue ) {

	switch( str_cue ) {

		case 'beat':
			//post( "beat event", '\n' );
			random_clip.update();
			break; //beat

		case 'bar':
			post( "bar event", '\n' );
			break; //bar
	}
}
