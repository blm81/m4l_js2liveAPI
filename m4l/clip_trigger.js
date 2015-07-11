/*
	trigger clips
*/

inlets = 1;
outlets = 1;

var live_api = new LiveAPI( "live_set" ),
	song_info = null,
	random_clip =  RandomFire( live_api, [ 2, 5, 6 ], [ 11 ] );

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

/*
	fire a random clip

	@param api_obj		{obj}		api instance
	@param track_num: 	{array} 	track number(s), if multiple, will choose random track
	@param tick_range: 	{array} 	low [0] and high [1] range for fire time
									if only 1 arg, then clip will fire at that interval
	@param out_range: 	{array} 	optional *breaks random track* output range low [0] high [1]
*/
function RandomFire( api_obj, tracks, tick_range, output_range ) {

	var _counter = 0,
		_ticks,
		_track,
		_output;

	set_all();

	function set_ticks() {

		if ( tick_range[1] === undefined )
			_ticks = tick_range[0];
		else 
			_ticks = random_range( tick_range[0], tick_range[1] );
		post( "ticks set to: ", _ticks );
	}

	function set_track() {
		_track = tracks[ random_range( -1, tracks.length ) ];
		post( "track set to: ", _track );
	}

	function set_output() {
		_output = random_range( output_range[0], output_range[1] );
	}

	function set_all() {
		set_ticks();
		set_track();

		var clips_idx;

		//if there's an output range specified, choose a random index
		if ( output_range !== undefined )
			set_output();

		//otherwise, get the tracks clips and select a random index from them
		else {

			//make sure that the song info has been aquired
			if ( song_info === null ) 
				get_song_info();

			//get clips for the current track and set a randomly chosen one as output
			for ( var i = 0, il = song_info.tracks.length; i < il; i++ ) {
				if ( song_info.tracks[i].index === _track ) {
					bTrack_found = true;
					clips_idx = random_range( -1, song_info.tracks[i].clips.length );
					post( "output track: ", song_info.tracks[i].clips[ clips_idx ].name, '\n' );
					_output = song_info.tracks[i].clips[ clips_idx ].index;
				}
			}
		}
	}

	function update() {

		if( ++_counter === _ticks ) {
			//select and fire clip
			api_obj.goto( "live_set tracks " + _track + " clip_slots " + _output );
			api_obj.call( "fire" );
			//reset for next round
			set_all();
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