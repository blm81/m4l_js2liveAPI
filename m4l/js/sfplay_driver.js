/*
	takes input from folder_traversal.js to create list of files to play
*/

inlets = 1;
outlets = 1;

var fromJson,
	regexMatch,
	filtered;

function anything()
{
	var a = arrayfromargs( messagename, arguments );

	switch( a[0] ) {

		case "ft_json":
			try {
				fromJson = JSON.parse( a[1] );
			}
			catch ( exception ) {
				post( "sfplay_driver exception: " + exception + '\n' );
			}
			break;

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
			for ( var i = 0, il = filtered.length; i < il; i++ ) {
				post( "filtered entry: " + filtered[i] + '\n' );
			}
			break;
	}
}