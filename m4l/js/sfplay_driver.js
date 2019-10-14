/*
	takes input from folder_traversal.js to create list of files to play
*/

inlets = 1;
outlets = 1;

var fromJson,
	folderPath,
	regexMatch,
	filtered,
	playingIndex = 0;

function anything()
{
	var a = arrayfromargs( messagename, arguments );

	switch( a[0] ) {

		//parse json from folder_traversal.js
		case "ft_json":
			try {
				fromJson = JSON.parse( a[1] );
			}
			catch ( exception ) {
				post( "sfplay_driver exception: " + exception + '\n' );
			}
			break;

		//set the folder path to files to play
		case "set_folder":
			if ( a[1] ) {
				folderPath = a[1] + "/";
			}
			else {
				post( "folder path must be provided" );
				return;
			}
			break;

		//filter list of files based on supplied string
		case "filter":
			//ensure that string to match in filenames has been provided
			if ( a[1] ) {
				regexMatch = new RegExp( a[1], "i" );
			}
			else {
				post( "please provide a string to filter filenames by" );
				return;
			}

			//push filenames that match regex to filtered array
			filtered = [];
			for ( var i = 0, il = fromJson.filenames.length; i < il; i++ ) {
				if ( fromJson.filenames[i].match( regexMatch ) !== null ) {
					filtered.push( fromJson.filenames[i] );
				}	
			}
			break;

		//play next file in sequence
		case "play_next":
			if ( filtered ) {
				outlet( 0, "open", folderPath + filtered[ playingIndex ]);
			}
			else {
				post( "filtered filename list is empty" );
				return;
			}
			playingIndex < filtered.length - 1 ? playingIndex++ : playingIndex = 0;
			break;

		//play random file in sequence
		case "play_random":
			if ( filtered ) {
				outlet( 0, "open", folderPath + filtered[ random_range( -1, filtered.length )]);
			}
			else {
				post( "filtered filename list is empty" );
				return;
			}
			break;
	}
}

function random_range( upper, lower ) {
	return Math.floor( Math.random() * ( upper - lower + 1) ) + lower;
}