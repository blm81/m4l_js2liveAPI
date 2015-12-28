/*
	traverse files in a folder (right now just supports AIFF),
	output JSON with array of filenames
*/

inlets = 1;
outlets = 1;

var folder,
	objOut = {};

function anything()
{
	var a = arrayfromargs( messagename, arguments );

	switch( a[0] ) {

		case "set_folder":
			post( "opening folder: " + a[1] + '\n' );
			folder = new Folder( a[1] );
			folder.typelist = [ "AIFF" ];
			objOut.files = [];

			while ( !folder.end ) {
				//filter out empty string
				//TODO figure out why this is happening
				if ( folder.filename !== "" ) {
			    	objOut.files.push( folder.filename );
				}
			    folder.next();
			}

			outlet( 0, JSON.stringify( objOut ));

			break;


	}
}