/*
	trigger clips
*/

inlets = 1;
outlets = 1;

var live_api = new LiveAPI( "live_set" ),
	song_info = null;

function anything()
{
	var args = arrayfromargs( messagename, arguments );

	switch ( args[0] ) {

		//get an object with track/clip info about live set
		case 'get_song_info':

			song_info = {
				tracks : []
			};

			//get tracks
			live_api.goto( "live_set" );
			var tracks = arrayfromargs( live_api.get( "tracks" ) );
			//loop through half the length as "id" and "number" each have own array index
			for ( var i = 0; i < tracks.length / 2; i++ ) {
				live_api.goto( "live_set tracks " + i );
				//make track object
				var track = {
					index : i,
					name : live_api.get( "name" ),
					clips : []
				};

				//get clips
				live_api.goto( "live_set tracks " + i );
				var clips = arrayfromargs( live_api.get( "clip_slots" ) );
				for ( var j =0; j < clips.length / 2; j++ ) {
					live_api.goto( "live_set tracks " + i + " clip_slots " + j );
					
					//check if clip slot actally has a clip, if so, add
					if ( live_api.get( "has_clip" ) == 1 ) {
						live_api.goto( "live_set tracks " + i + " clip_slots " + j + " clip" );
						var clip = {
							index : j,
							name : live_api.get( "name" )
						}
						track.clips.push( clip );
					}
				}
				song_info.tracks.push( track );
			}
			outlet( 0, JSON.stringify( song_info ) );
			
			break; //get_song_info
	}
}