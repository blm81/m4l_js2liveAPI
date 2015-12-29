/*
	keeps track of and sorts notes being played
	intended to drive live resonator
*/

inlets = 1;
outlets = 1;

var rootNote,
	chordNotes = [];

function anything()
{
	var a = arrayfromargs( messagename, arguments );

	switch( a[0] ) {

		case "note_event":
			//notes including and above middle C
			if ( a[1] >= 60 ) {
				if ( a[2] > 0 ) {
					chordNotes.push( a[1] );
					chordNotes.sort();
					post( "chord notes: " + chordNotes + '\n' );
				}
				else { 
					chordNotes.splice( chordNotes.indexOf( a[1] ), 1 );
				}
			}
			//notes below middle C
			else {
				if ( a[2] > 0 ) {
					rootNote = a[1];
					post( "root note: " + rootNote + '\n' );
				}
			}
			break;
	}
}