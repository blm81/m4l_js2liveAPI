/*
	trigger clips
*/

inlets = 1;
outlets = 1;

var live_api = new LiveAPI( "live_set" ),
	song_info = null,
	random_clip =  RandomClip( live_api, 2, [ 11 ], [ -1, 3 ] );

function anything()
{
	var args = arrayfromargs( messagename, arguments ),
		str_from_global = "",
		event_obj = null;

	switch ( args[0] ) {

		//get an object with track/clip info about live set
		case 'get_song_info':

			var str_from_global = GM4L.get_song_info( live_api );

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

/*
	fire a random clip

	@param api_obj		{obj}		api instance
	@param track_num: 	{num} 		track number
	@param tick_range: 	{array} 	low [0] and high [1] range for fire time
									if only 1 arg, then clip will fire at that interval
	@param out_range: 	{array} 	output range low [0] high [1]
*/
function RandomClip( api_obj, track_num, tick_range, output_range ) {

	var _counter = 0,
		_ticks,
		_output;

	set_ticks();
	set_output();

	function set_ticks() {

		if ( tick_range[1] === undefined )
			_ticks = tick_range[0];
		else 
			_ticks = random_range( tick_range[0], tick_range[1] );
		post( "ticks set to: ", _ticks );
	}

	function set_output() {
		_output = random_range( output_range[0], output_range[1] );
	}

	function update() {

		if( ++_counter === _ticks ) {
			//select and fire clip
			api_obj.goto( "live_set tracks " + track_num + " clip_slots " + _output );
			api_obj.call( "fire" );
			//reset for next round
			set_output();
			_counter = 0;
		}
	}

	//get random int within a specified range
	function random_range( upper, lower ) {
		return Math.floor( Math.random() * ( upper - lower + 1) ) + lower;
	}

	return {
		update : update
	}
}