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

			outlet( 0, GM4L.get_song_info( live_api ) );

			break; //get_song_info
	}
}